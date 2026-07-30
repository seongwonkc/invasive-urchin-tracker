// src/api.js

export const SPECIES = [
  {
    id: "purple-urchin",
    scientificName: "Strongylocentrotus purpuratus",
    commonName: "Purple Sea Urchin",
    shortName: "Purple urchin",
    category: "Kelp pressure",
    regionHint: "US West Coast",
    rangeLabel: "California to British Columbia",
    managementType: "Overabundant grazer",
    sourceName: "The Nature Conservancy",
    sourceUrl: "https://www.nature.org/en-us/magazine/magazine-articles/kelp-forest/",
    thresholds: { high: 30, medium: 10 },
    story:
      "Purple urchins can persist in dense barrens after kelp forest collapse, keeping recovery sites locked in a grazed-down state.",
    activismAction:
      "Map barren-adjacent records, interview divers, and identify restaurants already comfortable serving uni.",
    recipe: {
      title: "Kelp-Forest Uni Toast",
      time: "12 min",
      skill: "Easy",
      yield: "4 small toasts",
      flavor: "Sweet brine, lemon, herbs",
      ingredients: [
        "Fresh processed uni",
        "Toasted sourdough",
        "Lemon zest",
        "Chives",
        "Cold butter",
      ],
      steps: [
        "Toast bread until crisp enough to hold soft uni.",
        "Spread a thin layer of cold butter.",
        "Top with uni, lemon zest, and chives.",
        "Serve immediately with a note explaining kelp-barren removal.",
      ],
    },
    safety:
      "Only use legally harvested, properly handled uni. Do not harvest from closed or contaminated waters.",
  },
  {
    id: "longspined-urchin",
    scientificName: "Centrostephanus rodgersii",
    commonName: "Long-spined Sea Urchin",
    shortName: "Long-spined urchin",
    category: "Range extender",
    regionHint: "Australia / Tasmania",
    rangeLabel: "New South Wales to Tasmania",
    managementType: "Climate-driven range expansion",
    sourceName: "Frontiers in Marine Science",
    sourceUrl: "https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2023.1224067/full",
    thresholds: { high: 20, medium: 7 },
    story:
      "Long-spined urchins are expanding into Tasmanian kelp systems, where concentrated grazing can convert reef into barrens.",
    activismAction:
      "Track range-edge observations and pair them with kelp-loss stories from fisheries and dive groups.",
    recipe: {
      title: "Urchin Butter for White Fish",
      time: "18 min",
      skill: "Medium",
      yield: "4 portions",
      flavor: "Rich, oceanic, savory",
      ingredients: [
        "Cleaned long-spined urchin roe",
        "Unsalted butter",
        "White fish",
        "Miso",
        "Lemon juice",
      ],
      steps: [
        "Blend softened butter with uni and a little miso.",
        "Pan-sear white fish until just cooked.",
        "Finish with a spoon of uni butter off heat.",
        "Serve with lemon and a short note on targeted barren harvest.",
      ],
    },
    safety:
      "Long spines are hazardous. Handling should be done by trained harvesters under local rules.",
  },
  {
    id: "green-urchin",
    scientificName: "Strongylocentrotus droebachiensis",
    commonName: "Green Sea Urchin",
    shortName: "Green urchin",
    category: "Kelp pressure",
    regionHint: "North Atlantic",
    rangeLabel: "Maine, Canada, Greenland, Norway",
    managementType: "Overgrazing pressure",
    sourceName: "Reef Check Foundation",
    sourceUrl: "https://www.reefcheck.org/kelp-forest-program/kelp-forest-urchin-barren-dynamics/",
    thresholds: { high: 30, medium: 10 },
    story:
      "Green urchins can maintain barrens in cold-water kelp systems, especially where predator balance has shifted.",
    activismAction:
      "Build a chef-facing briefing on how steady demand can support targeted removals without creating perverse incentives.",
    recipe: {
      title: "Nordic Uni Potato Soup",
      time: "35 min",
      skill: "Easy",
      yield: "4 bowls",
      flavor: "Briny, soft, dill-forward",
      ingredients: ["Green urchin roe", "Potatoes", "Leeks", "Dill", "Cream"],
      steps: [
        "Simmer potatoes and leeks until tender.",
        "Blend with a small amount of cream.",
        "Fold in uni off heat so it stays delicate.",
        "Top with dill and serve in small portions.",
      ],
    },
    safety:
      "Check local shellfish advisories and harvest closures before eating any wild urchin.",
  },
  {
    id: "lionfish",
    scientificName: "Pterois volitans",
    commonName: "Red Lionfish",
    shortName: "Lionfish",
    category: "Reef predator",
    regionHint: "Southeast US / Caribbean",
    rangeLabel: "Atlantic reefs and Caribbean",
    managementType: "Invasive predator",
    sourceName: "NOAA Fisheries",
    sourceUrl: "https://www.fisheries.noaa.gov/southeast/ecosystems/impacts-invasive-lionfish",
    thresholds: { high: 18, medium: 6 },
    story:
      "Lionfish consume native reef fish and have few predators in invaded Atlantic and Caribbean reefs.",
    activismAction:
      "Recruit dive shops and seafood restaurants into a 'remove, report, serve' weekend challenge.",
    recipe: {
      title: "Lionfish Citrus Tacos",
      time: "25 min",
      skill: "Medium",
      yield: "8 tacos",
      flavor: "Mild white fish, lime, chile",
      ingredients: [
        "Clean lionfish fillets",
        "Corn tortillas",
        "Lime",
        "Cabbage slaw",
        "Avocado",
      ],
      steps: [
        "Use professionally cleaned fillets with venomous spines removed.",
        "Season lightly and sear until opaque.",
        "Serve in warm tortillas with slaw, avocado, and lime.",
        "Add a table card explaining why lionfish removals help reefs.",
      ],
    },
    safety:
      "Lionfish spines are venomous. Only trained handlers should clean whole fish; fillets are the safer outreach format.",
  },
  {
    id: "silver-carp",
    scientificName: "Hypophthalmichthys molitrix",
    commonName: "Silver Carp",
    shortName: "Silver carp",
    category: "River invader",
    regionHint: "Mississippi River Basin",
    rangeLabel: "Large US river systems",
    managementType: "Invasive carp",
    sourceName: "USGS",
    sourceUrl: "https://www.usgs.gov/faqs/can-i-eat-asian-carp",
    thresholds: { high: 25, medium: 8 },
    story:
      "Invasive carp compete low on the food web and can dominate large river systems where they become established.",
    activismAction:
      "Prototype boneless carp recipes and explain the intramuscular-bone problem honestly.",
    recipe: {
      title: "Silver Carp Cakes",
      time: "40 min",
      skill: "Medium",
      yield: "10 cakes",
      flavor: "Mild, firm, parsley, mustard",
      ingredients: [
        "Cooked silver carp meat",
        "Egg",
        "Breadcrumbs",
        "Dijon mustard",
        "Parsley",
      ],
      steps: [
        "Cook carp and carefully flake meat away from bones.",
        "Mix with egg, crumbs, mustard, and parsley.",
        "Form small cakes and chill for 10 minutes.",
        "Pan-sear until crisp and serve with lemon yogurt sauce.",
      ],
    },
    safety:
      "Follow local fish-consumption advisories and never transport live invasive carp.",
  },
  {
    id: "blue-catfish",
    scientificName: "Ictalurus furcatus",
    commonName: "Blue Catfish",
    shortName: "Blue catfish",
    category: "Estuary predator",
    regionHint: "Chesapeake Bay",
    rangeLabel: "Atlantic tributaries and reservoirs",
    managementType: "Introduced predator",
    sourceName: "NOAA Fisheries",
    sourceUrl: "https://www.fisheries.noaa.gov/feature-story/blue-catfish-invasive-and-delicious",
    thresholds: { high: 22, medium: 8 },
    story:
      "Blue catfish have spread through Chesapeake waters and prey on many native fish and shellfish species.",
    activismAction:
      "Build a school cafeteria tasting proposal around smaller legal fish and local consumption advisories.",
    recipe: {
      title: "Blue Catfish Rice Bowls",
      time: "30 min",
      skill: "Easy",
      yield: "4 bowls",
      flavor: "Clean, savory, peppery",
      ingredients: [
        "Blue catfish fillets",
        "Steamed rice",
        "Cucumber",
        "Soy-lime glaze",
        "Scallions",
      ],
      steps: [
        "Season fillets and sear until flaky.",
        "Brush with soy-lime glaze.",
        "Serve over rice with cucumber and scallions.",
        "Include a note on Chesapeake invasive-predator removal.",
      ],
    },
    safety:
      "Check state consumption advisories, especially for larger fish and specific waterways.",
  },
  {
    id: "green-crab",
    scientificName: "Carcinus maenas",
    commonName: "European Green Crab",
    shortName: "Green crab",
    category: "Shoreline invader",
    regionHint: "North America coasts",
    rangeLabel: "Atlantic, Pacific, and Alaska shorelines",
    managementType: "Invasive crab",
    sourceName: "National Invasive Species Information Center",
    sourceUrl: "https://www.invasivespeciesinfo.gov/aquatic/invertebrates/european-green-crab",
    thresholds: { high: 35, medium: 12 },
    story:
      "European green crabs damage eelgrass and shellfish habitat and are a major target for shoreline monitoring programs.",
    activismAction:
      "Teach beach walkers the 'find, keep, report' workflow used by monitoring teams, with local rules checked first.",
    recipe: {
      title: "Green Crab Stock",
      time: "55 min",
      skill: "Easy",
      yield: "1 quart",
      flavor: "Sweet shellfish, tomato, fennel",
      ingredients: [
        "Humanely dispatched green crabs",
        "Tomato paste",
        "Fennel",
        "Onion",
        "Bay leaf",
      ],
      steps: [
        "Confirm local possession and harvest rules before collecting.",
        "Roast shells with tomato paste until fragrant.",
        "Simmer with aromatics for 35 minutes.",
        "Strain and use for risotto, chowder, or ramen broth.",
      ],
    },
    safety:
      "Rules vary sharply by state. Some places require reporting or prohibit possession; check first.",
  },
  {
    id: "chesapeake-channa",
    scientificName: "Channa argus",
    commonName: "Chesapeake Channa",
    shortName: "Channa",
    category: "Freshwater predator",
    regionHint: "Mid-Atlantic US",
    rangeLabel: "Potomac and Chesapeake tributaries",
    managementType: "Invasive fish",
    sourceName: "Maryland DNR",
    sourceUrl: "https://dnr.maryland.gov/fisheries/pages/snakehead.aspx",
    thresholds: { high: 16, medium: 5 },
    story:
      "Chesapeake Channa, formerly called northern snakehead, is promoted in Maryland as an edible invasive fish.",
    activismAction:
      "Create a poster that pairs legal handling rules with recipes, because live transport restrictions matter.",
    recipe: {
      title: "Channa Lettuce Wraps",
      time: "28 min",
      skill: "Easy",
      yield: "4 servings",
      flavor: "Firm white fish, ginger, garlic",
      ingredients: [
        "Channa fillets",
        "Lettuce leaves",
        "Ginger",
        "Garlic",
        "Rice vinegar",
      ],
      steps: [
        "Dice fillets and saute with ginger and garlic.",
        "Season with soy, rice vinegar, and a small amount of chile.",
        "Spoon into lettuce leaves.",
        "Serve with a reminder not to transport live fish.",
      ],
    },
    safety:
      "Do not possess or transport live fish where prohibited. Follow local invasive-fish rules.",
  },
];

export const ACTION_LOG = [
  {
    date: "2025-09",
    title: "Started with kelp barrens",
    text:
      "Built the first map around overabundant sea urchins and learned how public biodiversity records can reveal management hotspots.",
  },
  {
    date: "2026-01",
    title: "Added evidence tracking",
    text:
      "Added year-over-year GBIF summaries so the project can show whether the data picture is improving over time.",
  },
  {
    date: "2026-04",
    title: "Launched recipe outreach concept",
    text:
      "Converted species research into chef-friendly recipe cards that make removal feel practical instead of abstract.",
  },
  {
    date: "2026-07",
    title: "Expanded to an invasivore atlas",
    text:
      "Broadened the project from urchins to invasive fish, crabs, and reef predators with source links, safety notes, and action prompts.",
  },
];

export const CAMPAIGN_METRICS = [
  { label: "Target species", value: SPECIES.length },
  { label: "Recipe cards", value: SPECIES.length },
  { label: "Official sources", value: SPECIES.length },
  { label: "Student log entries", value: ACTION_LOG.length },
];

const GBIF_BASE_URL = "https://api.gbif.org/v1/occurrence/search";
const YEARS_BACK = 5;
const PAGE_LIMIT = 300;
const MAX_PER_SPECIES = 900;
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
