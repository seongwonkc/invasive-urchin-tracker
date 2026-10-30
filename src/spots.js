// Harvest hotspots and the rules for taking each species there.
//
// Every rule below was read on the official page linked in `official`
// (or the legal code it rests on) on CHECKED. Fields we could not confirm
// from an official source are left out rather than guessed. Status:
//   go      – open, no bag limit
//   licence – open, with a licence, limits or gear rules
//   no      – hands off for the public
//   check   – we could not confirm the rules; ask the authority first

export const CHECKED = "30 October 2026";

// Tailwind classes for each status, shared by the map legend, cards and badges.
export const STATUS = {
  go: { label: "No bag limit", dot: "bg-kelp-400", text: "text-kelp-300", ring: "border-kelp-400/50 bg-kelp-400/10" },
  licence: { label: "Open, with rules", dot: "bg-uni-400", text: "text-uni-300", ring: "border-uni-400/50 bg-uni-400/10" },
  no: { label: "Hands off", dot: "bg-rose-400", text: "text-rose-300", ring: "border-rose-400/50 bg-rose-400/10" },
  check: { label: "Rules unconfirmed", dot: "bg-mist", text: "text-mist", ring: "border-mist/40 bg-mist/10" },
};

export const RULES = [
  {
    id: "ca-caspar",
    place: "Mendocino, California",
    status: "go",
    headline: "Purple urchins in any number at Caspar Cove, by hand. Bring a California fishing licence if you're 16 or older.",
    licence: "A sport fishing licence is required for anyone 16 or older.",
    limits:
      "At Caspar Cove, purple urchins may be taken in any number to restore the kelp (the exemption runs to 2029). Elsewhere in Humboldt, Mendocino and Sonoma, 40 gallons a day when skin or scuba diving. Statewide, 35 of each urchin species a day. No possession limit for purple urchin.",
    season: "No closed season for invertebrates.",
    gear: "At Caspar Cove, by hand or hand-held tools only. North of Yankee Point, scuba may be used only for urchins, rock scallops and Cancer crabs.",
    offLimits: "State marine reserves are closed to all invertebrate take. Other marine protected areas may restrict it.",
    official: {
      name: "California Department of Fish and Wildlife",
      url: "https://wildlife.ca.gov/Fishing/Ocean/Regulations/Sport-Fishing/Invertebrate-Fishing-Regs",
    },
  },
  {
    id: "or-coast",
    place: "Southern Oregon coast",
    status: "licence",
    headline: "35 purple urchins a day with an Oregon shellfish licence, all year.",
    licence: "Everyone 12 and older needs a shellfish licence.",
    limits:
      "Purple urchins: 35 a day. Red urchins count toward a combined 10 a day with other unlisted invertebrates.",
    season: "All year, at all hours, except while a public health advisory is in effect.",
    gear: "By hand or hand-powered tools. Release unwanted urchins unharmed.",
    offLimits: "Marine Gardens, Marine Reserves, Research Reserves, Habitat Refuges and Shellfish Preserves.",
    notes:
      "In February 2025 the Fish and Wildlife Commission raised the purple urchin limit to 35 a day and approved controlled culling at three priority sites.",
    official: {
      name: "Oregon Department of Fish and Wildlife",
      url: "https://myodfw.com/articles/oregon-shellfish-regulations",
    },
  },
  {
    id: "tas-centro",
    place: "Northeast Tasmania",
    status: "go",
    headline: "No licence and no catch limit. Tasmania asks divers to harvest long-spined urchins themselves.",
    licence: "No licence required for shellfish, including sea urchins.",
    limits: "Long-spined urchin: no catch limit and no size limit.",
    season: "Open all year.",
    offLimits: "Check the area restrictions in the Recreational Sea Fishing Guide before you dive.",
    notes:
      "Fisheries Tasmania: \"If you come across Centro while snorkelling or diving, try harvesting yourself.\" The guide on file runs to 31 October 2026, so look for the new edition.",
    official: {
      name: "Fishing Tasmania",
      url: "https://fishing.tas.gov.au/centro-site/Pages/you-can-help.aspx",
    },
  },
  {
    id: "no-finnmark",
    place: "Finnmark, Norway",
    status: "check",
    headline: "A huge, well-documented barren, but we could not confirm the recreational rules from an official page.",
    notes:
      "The Directorate of Fisheries' recreational pages and the harvest regulation say nothing specific about sea urchins. Ask the Directorate before taking any.",
    official: {
      name: "Norwegian Directorate of Fisheries",
      url: "https://www.fiskeridir.no/fritidsfiske",
    },
  },
  {
    id: "kr-coast",
    place: "East coast, South Korea",
    status: "no",
    headline: "Most rocky coast is licensed village fishing ground, so leave urchins to the haenyeo and fishers and buy them at the market.",
    licence: "There is no recreational licence. Village fishing rights (마을어업) are licensed only to the local 어촌계 or fisheries cooperative.",
    gear:
      "Outside licensed grounds, non-fishers may use only hand tools and snorkel gear (mask, snorkel, wetsuit, fins). No scuba tanks, no powered gear, one of each tool.",
    offLimits: "Village fishing grounds (마을어장). Selling a non-fisher's catch is illegal, with fines up to ₩10 million.",
    official: {
      name: "Fishery Resources Management Act, Enforcement Decree art. 7-2 (law.go.kr)",
      url: "https://www.law.go.kr/법령/수산자원관리법시행령",
    },
  },
  {
    id: "kr-dokdo",
    place: "Dokdo, South Korea",
    status: "no",
    headline: "A restricted island. Removal here is a government restoration project, not a public harvest.",
    offLimits: "Dokdo is a restricted island, and Korea's non-fisher rules and village fishing rights apply on top of that.",
    official: {
      name: "Fishery Resources Management Act (law.go.kr)",
      url: "https://www.law.go.kr/법령/수산자원관리법",
    },
  },
  {
    id: "fl-lionfish",
    place: "Florida Panhandle",
    status: "go",
    headline: "No bag limit, and divers need no licence when using a net, pole spear, Hawaiian sling or lionfish-specific spear.",
    licence:
      "Not required for divers using a hand-held net, pole spear, Hawaiian sling or a spearing device made and sold only for lionfish. Other gear and non-divers need a licence.",
    limits: "No recreational bag limit.",
    gear: "Lionfish are the one species you may take while diving on a rebreather. A powerhead may be used on lionfish only.",
    offLimits:
      "No spearfishing within 100 yards of public bathing beaches, fishing piers and fishing bridges, within 100 feet of jetties, or in state parks. Never bring in live lionfish.",
    notes: "These are Florida state-water rules. Federal waters further offshore can differ.",
    official: {
      name: "Florida Administrative Code 68B-5.006",
      url: "https://www.flrules.org/gateway/ruleNo.asp?id=68B-5.006",
    },
  },
  {
    id: "md-snakehead",
    place: "Potomac River, Maryland",
    status: "go",
    headline: "No season, creel or size limit, as long as you kill the snakehead the moment you catch it.",
    licence: "In non-tidal waters you need a Maryland angler's licence. Check DNR for tidal waters.",
    limits: "No season, creel limit or size limit.",
    gear: "Any legal method, if the snakehead is killed immediately on capture.",
    offLimits: "Never keep, transport, sell or breed a live snakehead.",
    official: {
      name: "Code of Maryland Regulations 08.02.19.06",
      url: "https://regs.maryland.gov/us/md/exec/comar/08.02.19.06",
    },
  },
  {
    id: "va-bluecat",
    place: "Tidal James River, Virginia",
    status: "go",
    headline: "No daily limit on the tidal James, except only one blue catfish a day longer than 32 inches.",
    limits:
      "Tidal James below the fall line to the Hog Point–College Creek line: no daily limit, but only one blue catfish over 32 inches a day. Other rivers below the fall line: no daily limit. Statewide elsewhere: 20 a day.",
    offLimits: "It is illegal to release a blue catfish into any water other than the one it came from.",
    official: {
      name: "Virginia DWR creel and length limits, 2026",
      url: "https://dwr.virginia.gov/wp-content/uploads/media/creel-and-length-limits.pdf",
    },
  },
  {
    id: "il-carp",
    place: "Illinois River, Illinois",
    status: "go",
    headline: "No harvest limit on silver carp with an Illinois sport fishing licence. Just never keep one alive.",
    licence: "A valid sport fishing licence is required.",
    limits: "No harvest or size limit.",
    gear:
      "Bowfishing is allowed with a bow, spear, gig, pitchfork or underwater spear gun. Fish taken this way may not be sold.",
    offLimits:
      "No live possession and no use as live bait. A carp that jumps into your boat may be returned straight to the water.",
    official: {
      name: "Illinois DNR Fishing Information, 2026–27",
      url: "https://dnr.illinois.gov/content/dam/soi/en/web/dnr/publications/documents/00000953.pdf",
    },
  },
  {
    id: "me-greencrab",
    place: "Casco Bay, Maine",
    status: "licence",
    headline: "No licence needed for personal use if you catch green crabs by hand, minnow trap, dip net, spear or hook and line.",
    licence:
      "None for personal use by hand, minnow trap, hand dip net, spear, harpoon or hook and line. Ordinary crab traps are not on that list, so ask DMR before setting one.",
    official: {
      name: "Maine Revised Statutes, Title 12 §6808",
      url: "https://legislature.maine.gov/statutes/12/title12sec6808.html",
    },
  },
];

export const SPOTS = [
  {
    id: "caspar-cove",
    name: "Caspar Cove",
    speciesId: "purple-urchin",
    rule: "ca-caspar",
    lat: 39.367,
    lng: -123.824,
    zoom: 12,
    why: "After the 2014–16 marine heatwave, purple urchins rose sixtyfold in 2015 and bull kelp fell by more than 90% along over 350 km of coast. Caspar Cove was one of the survey sites.",
    source: { name: "Rogers-Bennett & Catton, Scientific Reports (2019)", url: "https://www.nature.com/articles/s41598-019-51114-y" },
  },
  {
    id: "orford-reef",
    name: "Port Orford reefs",
    speciesId: "purple-urchin",
    rule: "or-coast",
    lat: 42.76,
    lng: -124.55,
    zoom: 10,
    why: "Urchins boomed after sea star wasting disease wiped out the sunflower stars that ate them, and Port Orford no longer has thriving kelp forests.",
    source: { name: "OPB (December 2024)", url: "https://www.opb.org/article/2024/12/08/oregon-kelp-forests-coast-ocean-report-urchin/" },
  },
  {
    id: "st-helens",
    name: "St Helens and Elephant Rock",
    speciesId: "longspined-urchin",
    rule: "tas-centro",
    lat: -41.33,
    lng: 148.33,
    zoom: 10,
    why: "Long-spined urchins carried south by warming water have built extensive, well-established barrens on Tasmania's northeast reefs.",
    source: {
      name: "University of Wollongong (December 2022)",
      url: "https://www.uow.edu.au/media/2022/sea-urchins-have-invaded-tasmania-and-victoria-but-we-cant-work-out-what-to-do-withthem.php",
    },
  },
  {
    id: "porsanger",
    name: "Porsangerfjorden",
    speciesId: "green-urchin",
    rule: "no-finnmark",
    lat: 70.3,
    lng: 25.3,
    zoom: 8,
    why: "With their predators gone, green urchins exploded along northern Norway, and barrens still cover about 5,000 km². Large-scale removal here has brought the kelp back.",
    source: { name: "NIVA (June 2023)", url: "https://www.niva.no/en/news/restoring-norways-underwater-forests" },
  },
  {
    id: "samcheok",
    name: "Samcheok coast",
    speciesId: "bora-urchin",
    rule: "kr-coast",
    lat: 37.44,
    lng: 129.19,
    zoom: 10,
    why: "A study near Samcheok found that the amount of some seaweeds tracked sea urchin density, the pattern behind 갯녹음 (barren ground).",
    source: {
      name: "Algae (2015), east coast of South Korea",
      url: "https://pure.skku.edu/en/publications/changes-in-macroalgal-assemblage-with-sea-urchin-density-on-the-e/",
    },
  },
  {
    id: "dokdo",
    name: "Dokdo",
    speciesId: "dunggeun-urchin",
    rule: "kr-dokdo",
    lat: 37.24,
    lng: 131.87,
    zoom: 11,
    why: "Runaway growth of 둥근성게 and spreading coralline algae sped up 갯녹음 here. The Ministry of Oceans and Fisheries had removed about 12.8 tonnes of urchins by 2019.",
    source: { name: "이투데이 (July 2020)", url: "https://www.etoday.co.kr/news/view/1914784" },
  },
  {
    id: "pensacola-reefs",
    name: "Pensacola artificial reefs",
    speciesId: "lionfish",
    rule: "fl-lionfish",
    lat: 30.2,
    lng: -87.2,
    zoom: 9,
    why: "In a 2013 survey of the northern Gulf, lionfish on artificial reefs were about a hundred times denser than on natural reefs.",
    source: { name: "Dahl & Patterson, PLoS ONE (2014)", url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0105852" },
  },
  {
    id: "potomac",
    name: "Tidal Potomac tributaries",
    speciesId: "chesapeake-channa",
    rule: "md-snakehead",
    lat: 38.68,
    lng: -77.12,
    zoom: 10,
    why: "Northern snakehead is well established in the Potomac River and several of its tributaries in Virginia and Maryland.",
    source: { name: "USGS Nonindigenous Aquatic Species", url: "https://nas.er.usgs.gov/queries/FactSheet.aspx?speciesID=2265" },
  },
  {
    id: "james-river",
    name: "Tidal James River",
    speciesId: "blue-catfish",
    rule: "va-bluecat",
    lat: 37.33,
    lng: -77.27,
    zoom: 10,
    why: "Virginia calls the tidal James the best blue catfish water in the state, with hundreds of 30 to 60 pound fish pulled out each year.",
    source: { name: "Virginia DWR", url: "https://dwr.virginia.gov/waterbody/james-river-tidal/" },
  },
  {
    id: "la-grange",
    name: "La Grange Reach, Illinois River",
    speciesId: "silver-carp",
    rule: "il-carp",
    lat: 40.3,
    lng: -90.06,
    zoom: 10,
    why: "Silver carp density was generally higher in the Alton and La Grange reaches than further upstream.",
    source: { name: "Coulter et al., PLoS ONE (2019)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6594630/" },
  },
  {
    id: "casco-bay",
    name: "Casco Bay",
    speciesId: "green-crab",
    rule: "me-greencrab",
    lat: 43.7,
    lng: -70.1,
    zoom: 10,
    why: "Maine's 2013 statewide survey caught hundreds of green crabs per trap in several Casco Bay towns.",
    source: {
      name: "Casco Bay Estuary Partnership (2013)",
      url: "https://www.cascobayestuary.org/wp-content/uploads/2021/01/2013-CBEP-Factsheet-Green-Crabs-for-web.pdf",
    },
  },
];
