# TrackWise

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
server/   Express API (app.ts is testable; index.ts boots dev/prod)
src/      React client; services/foodGapEngine.ts holds the classification rules
tests/    Vitest suites (server, engine, components)
docs/     Data pipeline notes and the specification
public/data/  Datasets served to the client and the API
```

## API

Read-only. `GET /api/health`, `/api/db/{tracts,snap-retailers,churches,schools,summary}`
(`?county=Orange|Osceola|Seminole|Lake|All` on tracts and retailers), and `POST /api/chat`
(`{ "message": string }`, max 500 chars, 20 requests/min/IP).

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
