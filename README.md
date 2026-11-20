# TrackWise

[![CI](https://github.com/peyoquintero/TrackWise/actions/workflows/ci.yml/badge.svg)](https://github.com/peyoquintero/TrackWise/actions/workflows/ci.yml)
![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6)
![React 19](https://img.shields.io/badge/React-19-61dafb)

Decision-support dashboard for food access gaps across 490 Central Florida census tracts
(Orange, Osceola, Seminole, Lake). Full requirements: [SPECIFICATION.md](SPECIFICATION.md).

## Quick start

Requires Node 22+.

```bash
npm install
cp .env.example .env     # optional: add GEMINI_API_KEY and VITE_GOOGLE_MAPS_API_KEY
npm run dev              # http://localhost:3000 (Express API + Vite middleware)
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run lint` / `npm run format` | Biome lint + format check / auto-fix |
| `npm run typecheck` | `tsc --noEmit` (strict + `noUncheckedIndexedAccess`) |
| `npm run verify` | Everything CI runs: lint, typecheck, tests, build |
| `npm test` | Vitest: classification engine, API, dataset consistency, React components (jsdom) |
| `npm run build` | Production client bundle to `dist/` |
| `npm start` | Serve `dist/` + API in production mode (build first) |
| `npm run generate:assets` | Regenerate church/school JSON in `public/data` |

## Docker

```bash
docker build -t trackwise .
docker run -p 3000:3000 -e GEMINI_API_KEY=... trackwise
```

The image runs as a non-root user and exposes a health check on `/api/health`.

## Layout

```
server/        Express API (app.ts is testable; index.ts boots dev/prod; stats.ts computes every headline number)
src/
  components/  Views. dashboard/ holds the story page: useDashboardModel (state + derived data)
               and one component per section (Section1-4, RulesFooter)
  lib/         Pure helpers: countyStats (spec table), routeUtils (distance, depots), quotaGuard, a11y
  services/    foodGapEngine.ts: the classification rules, scenario model and CSV schema validation
tests/         Vitest suites (server, engine, route utils, components)
docs/          Data pipeline notes (the specification lives in SPECIFICATION.md)
public/data/   Datasets served to the client and the API (also holds a downloadable copy of the spec)
public/assets/brand/  Logos and social image
```

## API

Read-only. `GET /api/health`, `/api/db/{tracts,snap-retailers,churches,schools,summary}`
(`?county=Orange|Osceola|Seminole|Lake|All` on tracts and retailers), and `POST /api/chat`
(`{ "message": string }`, max 500 chars, 20 requests/min/IP).

## Design notes

- **Classification is a pure function.** `classifyTractGaps` applies the five ordered rules from the specification, so every gap type is unit-tested without a browser.
- **The assistant never makes up numbers.** `server/stats.ts` computes totals from the loaded dataset; the Gemini prompt and the offline fallback both quote those values.
- **The API is read-only on purpose.** Writes are blocked at the route level and in `firestore.rules`.
- **Firebase web config is public by design.** Access is controlled by the Firestore rules, not by hiding the config.

## Configuration

See [.env.example](.env.example). Notes:

- `GEMINI_API_KEY` is server-only. Without it the assistant answers from a built-in analytics fallback.
- In production, cross-origin API access is off unless `CORS_ALLOWED_ORIGINS` lists origins.
- `VITE_*` variables are embedded in the browser bundle: restrict the Maps key by HTTP referrer.

## Security headers

Helmet is enabled. In production a Content-Security-Policy is sent in **report-only** mode
(`CSP_MODE=off|report-only|enforce`). Review browser-console violation reports on a deployed build, then switch to `enforce`.

## Known issues

- The tract-level dataset cannot be regenerated from `raw_data/` yet: see [docs/DATA_PIPELINE.md](docs/DATA_PIPELINE.md).
- The what-if scenario model does not reproduce the baseline at 0%/0% adjustment (flags 3 extra tracts);
  tracked by an `it.fails` test in `tests/foodGapEngine.test.ts`.

- Lint/format uses Biome rather than ESLint because `typescript-eslint` does not yet support TypeScript 7.

A pre-commit hook (simple-git-hooks) runs lint and typecheck after `npm install`. Dependabot opens weekly update PRs.
