// src/api.js

export const SPECIES = [
  {
    id: "purple",
    scientificName: "Strongylocentrotus purpuratus",
    commonName: "Purple Sea Urchin",
    regionHint: "US West Coast",
    rangeLabel: "California to British Columbia",
    story:
      "Dense purple urchin barrens can block kelp recovery after marine heat waves and predator loss.",
  },
  {
    id: "longspined",
    scientificName: "Centrostephanus rodgersii",
    commonName: "Long-spined Sea Urchin",
    regionHint: "Australia / Tasmania",
    rangeLabel: "New South Wales to Tasmania",
    story:
      "A warming-driven range expansion is pushing long-spined urchins into Tasmanian kelp ecosystems.",
  },
  {
    id: "green",
    scientificName: "Strongylocentrotus droebachiensis",
    commonName: "Green Sea Urchin",
    regionHint: "North Atlantic",
    rangeLabel: "Maine, Canada, Greenland, Norway",
    story:
      "Green urchin outbreaks can maintain bare seafloor where kelp forests previously stored carbon and habitat.",
  },
];

const GBIF_BASE_URL = "https://api.gbif.org/v1/occurrence/search";
const YEARS_BACK = 5;
const PAGE_LIMIT = 300;
const MAX_PER_SPECIES = 1800;
const REQUEST_TIMEOUT_MS = 12000;

function buildGbifUrl(scientificName, offset = 0) {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - YEARS_BACK;

  const params = new URLSearchParams({
    scientificName,
    hasCoordinate: "true",
    year: `${startYear},${currentYear}`,
    limit: PAGE_LIMIT.toString(),
    offset: offset.toString(),
  });

  return `${GBIF_BASE_URL}?${params.toString()}`;
}

async function fetchJsonWithTimeout(url) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`GBIF returned ${response.status}`);
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

function cleanOccurrence(record) {
  if (
    typeof record.decimalLatitude !== "number" ||
    typeof record.decimalLongitude !== "number"
  ) {
    return null;
  }

  return {
    key: record.key,
    lat: record.decimalLatitude,
    lng: record.decimalLongitude,
    year: record.year,
    country: record.country,
    stateProvince: record.stateProvince,
    locality: record.locality,
    basisOfRecord: record.basisOfRecord,
  };
}

export async function fetchOccurrencesForSpecies(
  scientificName,
  maxRecords = MAX_PER_SPECIES
) {
  let all = [];
  let offset = 0;

  while (all.length < maxRecords) {
    const url = buildGbifUrl(scientificName, offset);
    const data = await fetchJsonWithTimeout(url);
    const pageResults = Array.isArray(data.results) ? data.results : [];

    const cleaned = pageResults.map(cleanOccurrence).filter(Boolean);
    all = all.concat(cleaned);

    if (data.endOfRecords || pageResults.length === 0) {
      break;
    }

    offset += PAGE_LIMIT;
  }

  return all.slice(0, maxRecords);
}

export async function fetchAllSpeciesOccurrences() {
  const settled = await Promise.allSettled(
    SPECIES.map(async (species) => {
      const occurrences = await fetchOccurrencesForSpecies(species.scientificName);
      return [species.id, occurrences];
    })
  );

  const data = {};
  const failures = [];

  settled.forEach((result, index) => {
    const species = SPECIES[index];

    if (result.status === "fulfilled") {
      const [id, occurrences] = result.value;
      data[id] = occurrences;
    } else {
      data[species.id] = [];
      failures.push({
        speciesId: species.id,
        commonName: species.commonName,
        message: result.reason?.message || "Unknown GBIF error",
      });
    }
  });

  return { data, failures };
}

export function computeGridCells(
  occurrences,
  cellSizeDeg = 1,
  thresholds = { high: 30, medium: 10 }
) {
  const { high, medium } = thresholds;
  const grid = new Map();

  occurrences.forEach((occurrence) => {
    const latIdx = Math.floor(occurrence.lat / cellSizeDeg);
    const lngIdx = Math.floor(occurrence.lng / cellSizeDeg);
    const key = `${latIdx}_${lngIdx}`;

    const cell = grid.get(key) || {
      latIdx,
      lngIdx,
      count: 0,
      samples: [],
    };

    cell.count += 1;
    if (cell.samples.length < 4) {
      cell.samples.push(occurrence);
    }

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

    cells.push({
      id,
      lat: (cell.latIdx + 0.5) * cellSizeDeg,
      lng: (cell.lngIdx + 0.5) * cellSizeDeg,
      count: cell.count,
      risk,
      samples: cell.samples,
    });
  }

  cells.sort((a, b) => b.count - a.count);

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

export function computeYearlyEvidence(
  occurrences,
  cellSizeDeg = 1,
  thresholds = { high: 30, medium: 10 }
) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  const byYear = years.map((year) => {
    const records = occurrences.filter((occurrence) => occurrence.year === year);
    const grid = computeGridCells(records, cellSizeDeg, thresholds);

    return {
      year,
      label: year === currentYear ? `${year} YTD` : String(year),
      records: records.length,
      cells: grid.summary.cellCount,
      highRiskCells: grid.summary.highCount,
    };
  });

  const previous = byYear[0];
  const latestComplete = byYear[1];
  const current = byYear[2];
  const recordDelta = latestComplete.records - previous.records;
  const highRiskDelta = latestComplete.highRiskCells - previous.highRiskCells;

  return {
    years: byYear,
    previous,
    latestComplete,
    current,
    recordDelta,
    highRiskDelta,
    recordDeltaPercent:
      previous.records > 0
        ? Math.round((recordDelta / previous.records) * 100)
        : null,
  };
}
