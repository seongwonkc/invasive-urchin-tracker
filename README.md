# Invasive Sea Urchin Tracker

A student-built biodiversity dashboard that maps recent sea urchin occurrence
records from GBIF and turns them into a simple risk view for kelp-forest
restoration conversations.

## What It Does

- Fetches coordinate-backed GBIF records from the last five years.
- Tracks purple, long-spined, and green sea urchins.
- Groups records into 1-degree map cells.
- Flags cells as low, medium, or high density.
- Shows hotspot summaries, selected-cell examples, and harvest notes.
- Compares the last two complete years and shows the current year to date, so
  the project can demonstrate evidence growth over a one-year period.

This is a public-data prototype, not an official monitoring system. GBIF records
can include sampling bias, duplicate survey effort, and uneven regional coverage.

## Run Locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
npm audit
```

## Data Source

Occurrence data comes from the GBIF occurrence search API:

https://api.gbif.org/v1/occurrence/search

The app calls GBIF directly from the browser. Older versions routed traffic
through a public CORS proxy, which is no longer reliable.
