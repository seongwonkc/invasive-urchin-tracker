# Invasivore Atlas

A student-built citizen-science dashboard for turning edible invasive and
overabundant species into action: map them, understand the ecological issue,
open a recipe, and learn what to report or remove safely.

## What It Does

- Fetches coordinate-backed GBIF records from the last five years.
- Covers sea urchins, lionfish, invasive carp, blue catfish, European green
  crab, and Chesapeake Channa.
- Groups records into 1-degree map cells and flags density hotspots.
- Shows a one-year evidence panel using the last two complete years plus the
  current year to date.
- Provides one-click recipe cards with ingredients, steps, time, and safety
  notes.
- Includes a student action log to demonstrate project growth and activism.
- Links each species profile to an official or credible source.

This is a public-data prototype, not an official monitoring system. GBIF records
can include sampling bias, duplicate survey effort, and uneven regional
coverage. Always follow local harvest, transport, possession, and fish/shellfish
consumption rules.

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
