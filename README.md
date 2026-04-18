# contact-app

A TypeScript monorepo for a contacts application, powered by [pnpm](https://pnpm.io/) workspaces and [Turborepo](https://turbo.build/).

## Stack

- **API** (`apps/api`) — [Hono](https://hono.dev/) + [tRPC](https://trpc.io/) server
- **Web** (`apps/web`) — frontend app (placeholder)
- **Core** (`packages/core`) — shared domain: config, logger, Drizzle ORM, Postgres, S3 client
- **UI** (`packages/ui`) — shared UI library (placeholder)
- **Infra** — PostgreSQL 14 and MinIO (S3-compatible) via Docker Compose

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) `10.10.0` (see `packageManager` in `package.json`)
- [Docker](https://www.docker.com/) with Docker Compose

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create your `.env` from the template:

   ```bash
   cp .env.example .env
   ```

3. Start infrastructure (Postgres + MinIO):

   ```bash
   pnpm db:up
   ```

   - Postgres → `localhost:5432` (db `contacts`)
   - MinIO S3 API → `localhost:9000`
   - MinIO Console → `localhost:9001` (`minioadmin` / `minioadmin`)

4. Apply database migrations and seed data:

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

## Development

Start all apps in dev mode (Turbo TUI):

```bash
pnpm dev
```

The `predev` hook automatically brings up Docker services and reinstalls dependencies.

The API server listens on the `PORT` defined in `.env` (default `3000`).

### Useful scripts

| Command                  | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `pnpm dev`               | Run all apps in watch mode                          |
| `pnpm build`             | Build all apps via Turbo                            |
| `pnpm typecheck`         | Run TypeScript typecheck across the monorepo        |
| `pnpm lint` / `lint:fix` | Lint with Biome                                     |
| `pnpm format` / `format:fix` | Format with Biome                               |
| `pnpm test:integration`  | Run integration tests                               |
| `pnpm db:up`             | Start Postgres + MinIO containers                   |
| `pnpm db:reset`          | Tear down containers and wipe Postgres data         |
| `pnpm db:studio`         | Open Drizzle Studio                                 |
| `pnpm db:generate`       | Generate migrations from schema changes             |
| `pnpm db:migrate`        | Apply pending migrations                            |
| `pnpm db:push`           | Push schema directly (dev only)                     |
| `pnpm db:seed`           | Seed the database with sample data                  |
| `pnpm clean`             | Remove build outputs, caches, and `node_modules`    |

## Build

The API is bundled with [tsup](https://tsup.egoist.dev/) into `apps/api/dist/index.mjs`. Workspace packages (e.g. `@contact-app/core`) are bundled in via `noExternal`.

Build all apps:

```bash
pnpm build
```

Build only the API:

```bash
pnpm --filter @contact-app/api build
```

Run the compiled API:

```bash
pnpm --filter @contact-app/api start
```

### Docker

A multi-stage `Dockerfile` lives at `apps/api/Dockerfile`. Build and run the image from the repo root:

```bash
docker build -f apps/api/Dockerfile -t contact-app-api .
docker run --rm -p 3000:3000 --env-file .env contact-app-api
```

## Environment variables

See `.env.example`. Required keys:

- `PORT`, `NODE_ENV`, `LOG_LEVEL`
- `DB_URL` — Postgres connection string
- `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`

## Project layout

```
contact-app/
├── apps/
│   ├── api/        # Hono + tRPC server
│   └── web/        # Frontend (placeholder)
├── packages/
│   ├── core/       # Domain, DB (Drizzle), S3, config, logger
│   └── ui/         # Shared UI (placeholder)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```
