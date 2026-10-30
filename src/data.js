// src/data.js

export const TROPICA_URL = "https://tropica-eats.netlify.app";

export function tropicaSpeciesUrl(speciesId) {
  return `${TROPICA_URL}/species/${speciesId}`;
}

export const GROUPS = [
  { id: "urchin", label: "Sea urchins" },
  { id: "invasive", label: "Invasivores" },
];

export const REGIONS = {
  world: {
    id: "world",
    label: "World",
    country: null,
    bounds: [
      [-55, -170],
      [72, 170],
    ],
  },
  korea: {
    id: "korea",
    label: "Korean coast",
    country: "KR",
    bounds: [
      [33.0, 124.4],
      [38.7, 131.0],
    ],
  },
};

export const SPECIES = [
  {
    id: "purple-urchin",
    group: "urchin",
    taxonKey: 2278852,
    scientificName: "Strongylocentrotus purpuratus",
    commonName: "Purple Sea Urchin",
    shortName: "Purple urchin",
    category: "Kelp pressure",
    regionHint: "US West Coast",
    rangeLabel: "California to British Columbia",
    managementType: "Overabundant grazer",
    sourceName: "The Nature Conservancy",
    sourceUrl: "https://www.nature.org/en-us/magazine/magazine-articles/kelp-forest/",
    story:
      "Purple urchins can persist in dense barrens after kelp forest collapse, keeping recovery sites locked in a grazed-down state.",
    activismAction:
      "Map barren-adjacent records, interview divers, and identify restaurants already comfortable serving uni.",
    safety:
      "Only use legally harvested, properly handled uni. Do not harvest from closed or contaminated waters.",
  },
  {
    id: "bora-urchin",
    group: "urchin",
    taxonKey: 5842743,
    scientificName: "Heliocidaris crassispina",
    commonName: "Purple Sea Urchin (NW Pacific)",
    koreanName: "보라성게",
    shortName: "보라성게",
    category: "Korean reefs",
    regionHint: "Korea / Japan",
    rangeLabel: "Northwest Pacific rocky shores",
    managementType: "Barren grazer",
    sourceName: "Algae (2015), east coast of South Korea",
    sourceUrl:
      "https://pure.skku.edu/en/publications/changes-in-macroalgal-assemblage-with-sea-urchin-density-on-the-e/",
    story:
      "A grazing urchin of Korean rocky reefs. A study near Samcheok found that the abundance of some seaweeds tracked sea urchin density, the pattern behind 갯녹음 (barren ground).",
    activismAction:
      "Log barren-ground sites you visit with depth and photos, then compare them against the GBIF density map.",
    safety:
      "In Korean village fishing grounds (마을어장), urchins belong to licensed fishers and haenyeo. Do not collect them yourself; buy from a market.",
  },
  {
    id: "dunggeun-urchin",
    group: "urchin",
    taxonKey: 6474261,
    scientificName: "Mesocentrotus nudus",
    commonName: "Northern Purple Sea Urchin",
    koreanName: "둥근성게",
    shortName: "둥근성게",
    category: "Korean reefs",
    regionHint: "Korea / Japan",
    rangeLabel: "Cold-water coasts of the NW Pacific",
    managementType: "Barren grazer",
    sourceName: "Botanica Marina (2021), East Sea removal experiment",
    sourceUrl: "https://www.degruyterbrill.com/document/doi/10.1515/bot-2021-0043/html",
    story:
      "A cold-water urchin of Korea's East Sea coast. A field experiment on the east coast found that removing urchins alone let seaweed forest recover quickly on barren ground.",
    activismAction:
      "Pair each logged barren site with a note on depth and seaweed cover so changes after removals can be compared.",
    safety:
      "In Korean village fishing grounds (마을어장), urchins belong to licensed fishers and haenyeo. Do not collect them yourself; buy from a market.",
  },
  {
    id: "green-urchin",
    group: "urchin",
    taxonKey: 2278856,
    scientificName: "Strongylocentrotus droebachiensis",
    commonName: "Green Sea Urchin",
    shortName: "Green urchin",
    category: "Kelp pressure",
    regionHint: "North Atlantic",
    rangeLabel: "Maine, Canada, Greenland, Norway",
    managementType: "Overgrazing pressure",
    sourceName: "Reef Check Foundation",
    sourceUrl: "https://www.reefcheck.org/kelp-forest-program/kelp-forest-urchin-barren-dynamics/",
    story:
      "Green urchins can maintain barrens in cold-water kelp systems, especially where predator balance has shifted.",
    activismAction:
      "Build a chef-facing briefing on how steady demand can support targeted removals without creating perverse incentives.",
    safety:
      "Check local shellfish advisories and harvest closures before eating any wild urchin.",
  },
  {
    id: "longspined-urchin",
    group: "urchin",
    taxonKey: 4876934,
    scientificName: "Centrostephanus rodgersii",
    commonName: "Long-spined Sea Urchin",
    shortName: "Long-spined urchin",
    category: "Range extender",
    regionHint: "Australia / Tasmania",
    rangeLabel: "New South Wales to Tasmania",
    managementType: "Climate-driven range expansion",
    sourceName: "Frontiers in Marine Science",
    sourceUrl: "https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2023.1224067/full",
    story:
      "Long-spined urchins are expanding into Tasmanian kelp systems, where concentrated grazing can convert reef into barrens.",
    activismAction:
      "Track range-edge observations and pair them with kelp-loss stories from fisheries and dive groups.",
    safety:
      "Long spines are hazardous. Handling should be done by trained harvesters under local rules.",
  },
  {
    id: "lionfish",
    group: "invasive",
    taxonKey: 2334438,
    scientificName: "Pterois volitans",
    commonName: "Red Lionfish",
    shortName: "Lionfish",
    category: "Reef predator",
    regionHint: "Southeast US / Caribbean",
    rangeLabel: "Atlantic reefs and Caribbean",
    managementType: "Invasive predator",
    sourceName: "NOAA Fisheries",
    sourceUrl: "https://www.fisheries.noaa.gov/southeast/ecosystems/impacts-invasive-lionfish",
    story:
      "Lionfish consume native reef fish and have few predators in invaded Atlantic and Caribbean reefs.",
    activismAction:
      "Recruit dive shops and seafood restaurants into a 'remove, report, serve' weekend challenge.",
    safety:
      "Lionfish spines are venomous. Only trained handlers should clean whole fish; fillets are the safer outreach format.",
  },
  {
    id: "silver-carp",
    group: "invasive",
    taxonKey: 2362473,
    scientificName: "Hypophthalmichthys molitrix",
    commonName: "Silver Carp",
    shortName: "Silver carp",
    category: "River invader",
    regionHint: "Mississippi River Basin",
    rangeLabel: "Large US river systems",
    managementType: "Invasive carp",
    sourceName: "USGS",
    sourceUrl: "https://www.usgs.gov/faqs/can-i-eat-asian-carp",
    story:
      "Invasive carp compete low on the food web and can dominate large river systems where they become established.",
    activismAction:
      "Prototype boneless carp recipes and explain the intramuscular-bone problem honestly.",
    safety:
      "Follow local fish-consumption advisories and never transport live invasive carp.",
  },
  {
    id: "blue-catfish",
    group: "invasive",
    taxonKey: 5202525,
    scientificName: "Ictalurus furcatus",
    commonName: "Blue Catfish",
    shortName: "Blue catfish",
    category: "Estuary predator",
    regionHint: "Chesapeake Bay",
    rangeLabel: "Atlantic tributaries and reservoirs",
    managementType: "Introduced predator",
    sourceName: "NOAA Fisheries",
    sourceUrl: "https://www.fisheries.noaa.gov/feature-story/blue-catfish-invasive-and-delicious",
    story:
      "Blue catfish have spread through Chesapeake waters and prey on many native fish and shellfish species.",
    activismAction:
      "Build a school cafeteria tasting proposal around smaller legal fish and local consumption advisories.",
    safety:
      "Check state consumption advisories, especially for larger fish and specific waterways.",
  },
  {
    id: "green-crab",
    group: "invasive",
    taxonKey: 5178595,
    scientificName: "Carcinus maenas",
    commonName: "European Green Crab",
    shortName: "Green crab",
    category: "Shoreline invader",
    regionHint: "North America coasts",
    rangeLabel: "Atlantic, Pacific, and Alaska shorelines",
    managementType: "Invasive crab",
    sourceName: "National Invasive Species Information Center",
    sourceUrl: "https://www.invasivespeciesinfo.gov/aquatic/invertebrates/european-green-crab",
    story:
      "European green crabs damage eelgrass and shellfish habitat and are a major target for shoreline monitoring programs.",
    activismAction:
      "Teach beach walkers the 'find, keep, report' workflow used by monitoring teams, with local rules checked first.",
    safety:
      "Rules vary sharply by state. Some places require reporting or prohibit possession; check first.",
  },
  {
    id: "chesapeake-channa",
    group: "invasive",
    taxonKey: 4284921,
    scientificName: "Channa argus",
    commonName: "Chesapeake Channa",
    shortName: "Channa",
    category: "Freshwater predator",
    regionHint: "Mid-Atlantic US",
    rangeLabel: "Potomac and Chesapeake tributaries",
    managementType: "Invasive fish",
    sourceName: "Maryland DNR",
    sourceUrl: "https://dnr.maryland.gov/fisheries/pages/snakehead.aspx",
    story:
      "Chesapeake Channa, formerly called northern snakehead, is promoted in Maryland as an edible invasive fish.",
    activismAction:
      "Create a poster that pairs legal handling rules with recipes, because live transport restrictions matter.",
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
