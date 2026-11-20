# Data pipeline

How the datasets served by TrackWise relate to the raw inputs, and what is and is not reproducible today.

## Inputs (`raw_data/`, `fl_tracts_shapefile/`)

| Folder | Source | Used for |
| --- | --- | --- |
| `Population_Below_Poverty_Level/` | Census ACS 5-year 2024, table S1701 | `poverty_rate`, `poverty_rate_moe` |
| `Households_Receiving_SNAP_S2201/` | Census ACS 5-year 2024, table S2201 | `snap_rate`, `snap_rate_moe`, `snap_households` |
| `Total_Population_S0101/` | Census ACS 5-year 2024, table S0101 | `population` |
| `Household_Income_Median_S1901/` | Census ACS 5-year 2024, table S1901 | `median_household_income` |
| `Employed_Unemployed_LaborForce/` | Census ACS 5-year 2024, table B23025 | Not referenced by the app |
| `Low_Grocery_Access_SRAM/` | USDA Supermarket Reach Analysis Model | `lila_flag`, `low_access_flag`, `no_vehicle_*`, `urban_flag` |
| `fl_tracts_shapefile/` | Census TIGER/Line 2020 tracts | Boundaries, `aland`, `awater`, centroids |

Required columns for each table are listed in `REQUIRED_SCHEMAS` in `src/services/foodGapEngine.ts`
(this is also what the Upload Portal validates).

## Outputs (`public/data/`)

| File | Rows | Produced by |
| --- | --- | --- |
| `central_florida_food_gaps.{json,csv}` | 490 tracts x 45 columns | **Not in this repo** (see below) |
| `summary_metrics.json` | regional and per-county aggregates | **Not in this repo** |
| `central_fl_tracts.geojson` | tract boundaries | **Not in this repo** |
| `central_florida_snap_retailers.{json,csv}` | 1,697 stores | **Not in this repo** |
| `central_florida_churches.json`, `central_florida_schools.json` | 40 / 35 sites | `npm run generate:assets` (hand-curated list in `scripts/generate-assets.js`) |

## Known gap: the tract-level transformation is not reproducible

No script in the repository joins the raw tables, applies the Section 6 method of
[the specification](../SPECIFICATION.md), and writes `central_florida_food_gaps.*` and
`summary_metrics.json`. The classification rules exist in TypeScript (`classifyTractGaps`,
`scoreConfidence`) but are used only by the Upload Portal and what-if model, not to build the shipped data.

Consequences:

- A change to a rule, threshold or input table cannot currently be reflected in the shipped data without the original (external) process.
- The what-if model re-implements the rules separately and does not match the shipped baseline at 0% adjustment (see the `it.fails` test in `tests/foodGapEngine.test.ts`).

## What is checked automatically

`tests/server.test.ts` asserts that `summary_metrics.json` agrees with the tract-level file
(tract count, population, gap-tract count, per-gap-type counts), so the two cannot silently drift apart.

## Recommended next step

Commit the original processing code (or rewrite it) as `scripts/build-dataset.ts`, driven by `raw_data/`,
reusing `classifyTractGaps` and `scoreConfidence` so one implementation defines the rules. Add a test that the
script's output matches the committed JSON. That removes the duplicate rule logic and fixes the scenario-model discrepancy at the source.
