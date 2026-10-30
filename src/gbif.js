// src/gbif.js
// Thin client for the public GBIF APIs. Totals and trends come from facet
// counts over every record; the map draws GBIF's own density tiles, so nothing
// here is capped at a sample.

const API = "https://api.gbif.org/v1/occurrence/search";
const TILE_BASE = "https://api.gbif.org/v2/map/occurrence/density";
const REQUEST_TIMEOUT_MS = 15000;

export const TREND_YEARS = 15;
export const DENSITY_STYLE = "classic-noborder.poly";

const responseCache = new Map();

async function getJson(params, signal) {
  const url = `${API}?${params.toString()}`;
  if (responseCache.has(url)) return responseCache.get(url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`GBIF returned ${response.status}`);
    const json = await response.json();
    responseCache.set(url, json);
    return json;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}

function baseParams(taxonKey, { country, yearRange } = {}) {
  const params = new URLSearchParams({ taxonKey: String(taxonKey) });
  if (country) params.set("country", country);
  if (yearRange) params.set("year", `${yearRange[0]},${yearRange[1]}`);
  return params;
}

export function windowYears(windowId) {
  if (windowId === "recent") {
    const year = new Date().getFullYear();
    return [year - 4, year];
  }
  return null;
}

export function densityTileUrl(taxonKey, { country, yearRange } = {}) {
  const params = new URLSearchParams({
    srs: "EPSG:3857",
    taxonKey: String(taxonKey),
    bin: "hex",
    hexPerTile: "32",
    style: DENSITY_STYLE,
  });
  if (country) params.set("country", country);
  if (yearRange) params.set("year", `${yearRange[0]},${yearRange[1]}`);
  return `${TILE_BASE}/{z}/{x}/{y}@1x.png?${params.toString()}`;
}

export async function fetchCount(taxonKey, filters, signal) {
  const params = baseParams(taxonKey, filters);
  params.set("limit", "0");
  const json = await getJson(params, signal);
  return json.count || 0;
}

function facetMap(json, field) {
  const facet = (json.facets || []).find((item) => item.field === field);
  return facet ? facet.counts : [];
}

export async function fetchSpeciesStats(taxonKey, { country } = {}, signal) {
  const params = baseParams(taxonKey, { country });
  params.set("limit", "0");
  params.append("facet", "year");
  params.append("facet", "country");
  params.append("facet", "basisOfRecord");
  params.set("facetLimit", "300");
  const json = await getJson(params, signal);

  const currentYear = new Date().getFullYear();
  const yearCounts = new Map(
    facetMap(json, "YEAR").map((item) => [Number(item.name), item.count])
  );
  const trend = [];
  for (let year = currentYear - TREND_YEARS + 1; year <= currentYear; year += 1) {
    trend.push({
      year,
      label: year === currentYear ? `${year}*` : String(year),
      records: yearCounts.get(year) || 0,
    });
  }

  const countries = facetMap(json, "COUNTRY")
    .slice(0, 6)
    .map((item) => ({ code: item.name, name: countryName(item.name), count: item.count }));

  const basis = facetMap(json, "BASIS_OF_RECORD").map((item) => ({
    id: item.name,
    label: basisLabel(item.name),
    count: item.count,
  }));

  return {
    total: json.count || 0,
    trend,
    countries,
    countryCount: facetMap(json, "COUNTRY").length,
    basis,
  };
}

export function bboxForZoom(lat, lng, zoom) {
  const half = Math.min(5, Math.max(0.04, 90 / 2 ** zoom / 4));
  return {
    south: Math.max(-90, lat - half),
    north: Math.min(90, lat + half),
    west: Math.max(-180, lng - half),
    east: Math.min(180, lng + half),
  };
}

export async function fetchRecordsInBox(taxonKey, box, { yearRange } = {}, signal) {
  const params = baseParams(taxonKey, { yearRange });
  params.set("decimalLatitude", `${box.south},${box.north}`);
  params.set("decimalLongitude", `${box.west},${box.east}`);
  params.set("limit", "40");
  const json = await getJson(params, signal);

  const records = (json.results || [])
    .map((record) => ({
      key: record.key,
      date: record.eventDate ? record.eventDate.slice(0, 10) : record.year ? String(record.year) : "",
      place: [record.locality, record.stateProvince, record.country].filter(Boolean).join(", "),
      basis: basisLabel(record.basisOfRecord),
      lat: record.decimalLatitude,
      lng: record.decimalLongitude,
    }))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return { count: json.count || 0, records: records.slice(0, 6) };
}

function photoUrl(identifier) {
  if (!identifier) return null;
  // iNaturalist serves sized variants next to the original upload.
  if (identifier.includes("inaturalist-open-data") && identifier.includes("/original.")) {
    return identifier.replace("/original.", "/medium.");
  }
  return identifier;
}

export function licenseLabel(license) {
  if (!license) return null;
  const match = license.match(/licenses\/([a-z-]+)\/([\d.]+)/i);
  if (match) return `CC ${match[1].toUpperCase()} ${match[2]}`;
  if (/publicdomain\/zero/i.test(license)) return "CC0";
  if (/^CC/i.test(license)) return license.replace(/_/g, " ");
  return null;
}

export async function fetchPhotos(taxonKey, { country } = {}, signal) {
  const params = baseParams(taxonKey, { country });
  params.set("mediaType", "StillImage");
  params.set("limit", "24");
  const json = await getJson(params, signal);

  const photos = [];
  for (const record of json.results || []) {
    const media = (record.media || []).find(
      (item) => item.type === "StillImage" && item.identifier && licenseLabel(item.license)
    );
    if (!media) continue;
    photos.push({
      key: record.key,
      src: photoUrl(media.identifier),
      creator: media.creator || media.rightsHolder || "Unknown",
      license: licenseLabel(media.license),
      publisher: media.publisher || record.datasetName || "",
      date: record.eventDate ? record.eventDate.slice(0, 10) : "",
      place: [record.stateProvince, record.country].filter(Boolean).join(", "),
      href: `https://www.gbif.org/occurrence/${record.key}`,
    });
    if (photos.length >= 12) break;
  }
  return photos;
}

const regionNames =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function countryName(code) {
  if (!code) return "Unknown";
  try {
    return regionNames?.of(code) || code;
  } catch {
    return code;
  }
}

const BASIS_LABELS = {
  HUMAN_OBSERVATION: "Observation",
  OBSERVATION: "Observation",
  MACHINE_OBSERVATION: "Machine observation",
  PRESERVED_SPECIMEN: "Museum specimen",
  MATERIAL_SAMPLE: "Material sample",
  FOSSIL_SPECIMEN: "Fossil",
  LIVING_SPECIMEN: "Living specimen",
  OCCURRENCE: "Other record",
  MATERIAL_CITATION: "Literature",
};

function basisLabel(id) {
  return BASIS_LABELS[id] || "Other record";
}
