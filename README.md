# Urchin Tracker

A student-built citizen-science map of sea urchins and the barrens they leave
behind, with a secondary watch list of edible invasive species ("invasivores").
Every species links to its recipes in the
[TROPICA recipe book](https://tropica-eats.netlify.app).

Live: https://seaurchintracking.netlify.app

## What It Does

- Draws GBIF's own hex density tiles for each species, so the map covers every
  coordinate-backed record instead of a capped sample. Toggle all years or the
  last five years.
- Pulls true totals from GBIF facet counts: a 15-year records trend, top
  countries, and the observation vs. museum-specimen mix.
- World or Korean-coast view. Korea adds 보라성게 (*Heliocidaris crassispina*)
  and 둥근성게 (*Mesocentrotus nudus*), and stats switch to Korean records.
- Tap anywhere on the map to list the records inside a box around that spot.
- Shows recent openly licensed photos from GBIF, credited to their creators.
- Field log: record your own sightings (date, site, species, count, depth,
  notes, location from the map or GPS). The log is saved in this browser only;
  export and import it as CSV.
- `?species=<id>` preselects a species (used by links from TROPICA).

This is a public-data prototype, not an official monitoring system. GBIF records
can include sampling bias, duplicate survey effort, and uneven regional
coverage. More records can reflect more reporting, not more animals. Always
follow local harvest, transport, possession, and fish/shellfish consumption
rules.

## Run Locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Data Sources

- Occurrence search and facets: https://api.gbif.org/v1/occurrence/search
- Density tiles: https://api.gbif.org/v2/map/occurrence/density
- Basemap: Esri World Dark Gray Canvas
