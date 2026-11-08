# Central Florida Food Access Gaps Platform

An interactive, production-grade decision-support platform identifying, classifying, and simulating food-access gaps across 490 census tracts in Orange, Osceola, Seminole, and Lake counties, Florida.

Built according to the **[Central Florida Food Access Gaps Specification (v1.1)](./SPECIFICATION.md)** for DataKind Beacon Challenge 2 (DevFest Florida 2026).

---

## 📋 Official Specification

The complete project specification provided for this implementation is stored in the repository:
- **Root Path:** [`SPECIFICATION.md`](./SPECIFICATION.md)
- **Docs Path:** [`docs/Central_Florida_Food_Access_Gaps_Specification_v1.1.md`](./docs/Central_Florida_Food_Access_Gaps_Specification_v1.1.md)
- **Web App Direct Download:** [`public/data/Central_Florida_Food_Access_Gaps_Specification_v1.1.md`](./public/data/Central_Florida_Food_Access_Gaps_Specification_v1.1.md)

---

## 🎯 Executive Summary & Regional Scope

- **Total Census Tracts Analyzed:** 490 tracts
  - Orange County: 267 tracts
  - Osceola County: 59 tracts
  - Seminole County: 89 tracts
  - Lake County: 75 tracts
- **Tracts with Active Food Access Barriers:** 149 tracts (30% of Central Florida)
- **Population in Food Access Gaps:** ~948,600 residents (34% of the regional 2.79M population)
- **Authorized SNAP Food Retailers Mapped:** 1,697 locations

---

## 🔍 Core Questions Addressed

### Q1: Where Are the Food-Access Gaps? (FR-01 to FR-06)
- Red-scale choropleth map shaded by gap severity (Classic Food Desert, Vehicle-Compounded Gap, SNAP Enrollment Gap, Possible Blind Spot, Insufficient Data).
- Layer overlays for Poverty Rate (ACS S1701), SNAP Enrollment (ACS S2201), No-Vehicle Low Access Share (USDA SRAM), and Data Confidence Level.
- Dynamic filtering by county with synchronized unboxed metrics.
- Interactive slide-over tract inspector drawer with 90% margins of error (MOE) and actionable intervention recommendations.
- Full 490-tract ranked priority table sorted by population living in food access gaps.

### Q2: What Types of Food-Access Gaps Exist? (FR-07 to FR-09)
- 5-step classification engine distinguishing physical grocery absence from vehicle poverty and benefit under-enrollment.
- **County × Gap Type Matrix:**
  - **Classic Food Deserts:** 68 tracts (~444,000 residents) — high poverty + low physical supermarket access.
  - **Vehicle-Compounded Gaps:** 75 primary tracts (108 total with secondary) (~480,000 residents) — low access combined with zero-vehicle households.
  - **SNAP Enrollment Gaps:** 5 primary tracts (12 total with secondary) (~24,500 residents) — high poverty but low SNAP participation.
  - **Possible Blind Spots:** 58 tracts (~315,000 residents) — multiple elevated Q3 signals without a single Q4 trigger.
  - **Insufficient Data:** 2 tracts — unpopulated or missing Census counts.

### Q5: What Don't We Know? (FR-10 to FR-12)
- Scorecards of statistical unknowns across the 4 counties.
- Pockets of potential hidden need: 58 blind-spot tracts.
- Margins of error audit: 18 gap tracts where poverty margin of error exceeds 30% of the estimate.
- Documented data limitations (CDC PLACES transportation measure blank in Central Florida, straight-line distance barriers, SNAP retailer inventory quality).

### Scenario Studio: What-If Simulation (FR-13)
- Real-time simulation sliders:
  - Poverty Rate shock (-20% to +40%)
  - Vehicle Low-Access shock (-20% to +50%)
- Benchmark comparison table highlighting newly flagged tracts under a +10% regional poverty stress scenario.

### Upload Portal & Gap Engine (Section 8.2 & 8.3)
- Drag-and-drop file ingestion portal validating the 7 Census ACS, USDA SRAM, and SNAP retailer source files against their expected schemas.
- In-browser recomputation pipeline with audit logging and versioned CSV/JSON export.

### Data Dictionary & Deliverables (FR-14 & Section 10)
- 40-field metadata dictionary detailing data types, sources, and definitions.
- Direct downloads for master CSVs, SNAP retailer lists, tract GeoJSON, and the v1.1 Specification.

---

## 🗺️ Dual Mapping Engines

The platform includes two mapping engines accessible via the top-bar engine toggle:
1. **Google Maps Platform (`@vis.gl/react-google-maps`)**:
   - Supports Roadmap, Satellite, and Terrain basemaps.
   - Dynamic polygon styling on Google Maps Data Layer with zero tile watermarks.
   - Interactive hover tooltips and SNAP retailer store markers.
   - Built-in two-tier client-side quota monitoring.
2. **Canvas GIS (`Leaflet` + Esri World Gray Canvas)**:
   - High-performance, zero-watermark vector canvas mapping requiring zero API keys.

---

## 📂 Repository File Tree

```
├── SPECIFICATION.md                      # Complete Project Specification v1.1
├── README.md                             # Project documentation & user guide
├── docs/
│   └── Central_Florida_Food_Access_Gaps_Specification_v1.1.md
├── public/
│   ├── data/
│   │   ├── Central_Florida_Food_Access_Gaps_Specification_v1.1.md # Downloadable spec
│   │   ├── central_fl_tracts.geojson     # 490 Census tract polygon boundaries (3.6 MB)
│   │   ├── central_florida_food_gaps.json# Master classified tract dataset
│   │   ├── central_florida_food_gaps.csv # Spreadsheet export of master tract dataset
│   │   ├── central_florida_snap_retailers.json # 1,697 geocoded SNAP retailers
│   │   ├── central_florida_snap_retailers.csv  # CSV of SNAP retailers
│   │   └── summary_metrics.json          # Rollup county & regional statistics
│   └── assets/aistudio/                  # Raw project attachments
├── raw_data/                             # Original Census ACS & USDA raw files
│   ├── ACS 2024 S1701, S2201, S0101, S1901, B23025
│   ├── USDA SRAM 2026 Straight Line Distance & Tract Characteristics
│   └── SNAP Retailer Location data
├── src/
│   ├── components/                       # UI & Visualization components
│   │   ├── MapGoogle.tsx                 # Google Maps Platform component
│   │   ├── MapLeaflet.tsx                # Esri Canvas GIS component
│   │   ├── Header.tsx                    # Top navigation & CSV export
│   │   ├── CountyFilterBar.tsx           # County segmented filter
│   │   ├── TractDetailModal.tsx          # Tract profile inspector drawer
│   │   ├── RankedTractsTable.tsx         # FR-06 tract table with search & sort
│   │   ├── Q2GapTypeView.tsx             # Gap type matrix & intervention guide
│   │   ├── Q5UnknownsView.tsx            # Uncertainty scorecards & blind spots
│   │   ├── ScenarioModelView.tsx         # What-if simulation sliders
│   │   ├── UploadPortalView.tsx          # Upload portal & schema validator
│   │   └── DataDictionaryView.tsx        # 40-field dictionary & downloads
│   ├── services/
│   │   └── foodGapEngine.ts              # 5-step classification engine
│   ├── types/
│   │   └── index.ts                      # TypeScript models (40 fields)
│   ├── App.tsx                           # Root application layout & routing
│   └── main.tsx                          # App entry point
├── package.json                          # Dependencies & build scripts
├── vite.config.ts                        # Vite bundler config
└── tsconfig.json                         # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js 22)
- npm or bun

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build & Linting
```bash
npm run lint
npm run build
```
The optimized bundle will be created in `/dist`.

---

## 📄 License & Attribution
- Application code provided under the Apache 2.0 License.
- Data sources: U.S. Census Bureau ACS 2024 5-Year Estimates, USDA Economic Research Service SRAM (July 2026), USDA Food and Nutrition Service SNAP Retailer Directory, CDC PLACES 2025.
