// src/api.js

// ---- Species configuration ----

export const SPECIES = [
  {
    id: "purple",
    scientificName: "Strongylocentrotus purpuratus",
    commonName: "Purple Sea Urchin",
    regionHint: "US West Coast",
  },
  {
    id: "longspined",
    scientificName: "Centrostephanus rodgersii",
    commonName: "Long-spined Sea Urchin",
    regionHint: "Australia / Tasmania",
  },
  {
    id: "green",
    scientificName: "Strongylocentrotus droebachiensis",
    commonName: "Green Sea Urchin",
    regionHint: "North Atlantic",
  },
];

// Base GBIF endpoint
const GBIF_BASE_URL = "https://api.gbif.org/v1/occurrence/search";

// Use a public CORS proxy so the browser can talk to GBIF
const CORS_PROXY = "https://corsproxy.io/?";

const YEARS_BACK = 5;
const PAGE_LIMIT = 300;        // GBIF max per page is 300
const MAX_PER_SPECIES = 2000;  // Safety cap so we don't overload the browser

// ---- Helpers ----

function buildGbifUrl(scientificName, offset = 0) {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - YEARS_BACK;

  const params = new URLSearchParams({
    scientificName,
    hasCoordinate: "true",
    year: `${startYear},${currentYear}`, // last N years
    limit: PAGE_LIMIT.toString(),
    offset: offset.toString(),
  });

  return `${GBIF_BASE_URL}?${params.toString()}`;
}

// Fetch a single species’ occurrences from GBIF
export async function fetchOccurrencesForSpecies(
  scientificName,
  maxRecords = MAX_PER_SPECIES
) {
  let all = [];
  let offset = 0;

  while (all.length < maxRecords) {
    const url = buildGbifUrl(scientificName, offset);
    const proxiedUrl = CORS_PROXY + encodeURIComponent(url);

    const res = await fetch(proxiedUrl);

    if (!res.ok) {
      throw new Error(`GBIF request failed (${res.status}): ${res.statusText}`);
    }

    const data = await res.json();
    const pageResults = Array.isArray(data.results) ? data.results : [];

    const cleaned = pageResults
      .filter(
        (r) =>
          typeof r.decimalLatitude === "number" &&
          typeof r.decimalLongitude === "number"
      )
      .map((r) => ({
        key: r.key,
        lat: r.decimalLatitude,
        lng: r.decimalLongitude,
        year: r.year,
        country: r.country,
        stateProvince: r.stateProvince,
      }));

    all = all.concat(cleaned);

    if (data.endOfRecords || pageResults.length === 0) break;
    offset += PAGE_LIMIT;
  }

  return all.slice(0, maxRecords);
}

// Fetch all configured species in parallel
export async function fetchAllSpeciesOccurrences() {
  const entries = await Promise.all(
    SPECIES.map(async (s) => {
      const occurrences = await fetchOccurrencesForSpecies(s.scientificName);
      return [s.id, occurrences];
    })
  );

  return Object.fromEntries(entries);
}

// ---- Invasiveness / grid aggregation ----

// Group occurrences into lat/lng grid cells and classify risk by count
export function computeGridCells(
  occurrences,
  cellSizeDeg = 1,
  thresholds = { high: 30, medium: 10 }
) {
  const { high, medium } = thresholds;
  const grid = new Map();

  occurrences.forEach((o) => {
    const latIdx = Math.floor(o.lat / cellSizeDeg);
    const lngIdx = Math.floor(o.lng / cellSizeDeg);
    const key = `${latIdx}_${lngIdx}`;

    const cell = grid.get(key) || {
      latIdx,
      lngIdx,
      count: 0,
      samples: [],
    };

    cell.count += 1;
    cell.samples.push(o);
    grid.set(key, cell);
  });

  const cells = [];
  let highCount = 0;
  let medCount = 0;
  let lowCount = 0;

  for (const [id, cell] of grid.entries()) {
    let risk = "Low";
    if (cell.count >= high) {
      risk = "High";
      highCount += 1;
    } else if (cell.count >= medium) {
      risk = "Medium";
      medCount += 1;
    } else {
      lowCount += 1;
    }

    const latCenter = (cell.latIdx + 0.5) * cellSizeDeg;
    const lngCenter = (cell.lngIdx + 0.5) * cellSizeDeg;

    cells.push({
      id,
      lat: latCenter,
      lng: lngCenter,
      count: cell.count,
      risk,
      samples: cell.samples,
    });
  }

  return {
    cells,
    summary: {
      totalRecords: occurrences.length,
      cellCount: cells.length,
      highCount,
      medCount,
      lowCount,
    },
  };
}
