# contact-app

A TypeScript monorepo for a contacts application, powered by [pnpm](https://pnpm.io/) workspaces and [Turborepo](https://turbo.build/).

You can find some dev notes in the end of the file 😉

## Stack

- **API** (`apps/api`) — [Hono](https://hono.dev/) + [tRPC](https://trpc.io/) server for contacts CRUD and photo uploads
- **Web** (`apps/web`) — [React 19](https://react.dev/), [TanStack Start](https://tanstack.com/start), TanStack Router, TanStack Query, and Tailwind CSS 4
- **Core** (`packages/core`) — shared domain logic, schemas, Drizzle ORM, Postgres integration, S3 helpers, config, and logging
- **UI** (`packages/ui`) — shared UI primitives used by the web app
- **Infra** — PostgreSQL 14 and MinIO (S3-compatible) via Docker Compose

## Features

- Paginated/infinite-scrolling contact list
- Create, edit, and delete contacts
- Contact photo upload and preview backed by MinIO
- Shared TypeScript types and validation between API and frontend

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) `10.10.0` (see `packageManager` in [`package.json`](./package.json))
- [Docker](https://www.docker.com/) with Docker Compose

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create the API/core environment file from the template:

   ```bash
   cp .env.example .env
   ```

3. Create a web app env file at `apps/web/.env.local`:

   ```dotenv
   VITE_API_URL=http://localhost:3000
   ```

4. Start infrastructure (Postgres + MinIO):

   ```bash
   pnpm db:up
   ```

   - Postgres → `localhost:5432` (db `contacts`)
   - MinIO S3 API → `localhost:9000`
   - MinIO Console → `localhost:9001` (`minioadmin` / `minioadmin`)

5. Apply database migrations and seed data:

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

   `pnpm db:seed` uploads a shared set of `seed/...` images to MinIO and reuses those object keys across many seeded contacts.

## Development

Start all apps in dev mode (Turbo TUI):

```bash
pnpm dev
```

The `predev` hook automatically brings up Docker services and reinstalls dependencies.

Default local URLs:

- Web app → `http://localhost:5173`
- API → `http://localhost:3000`
- tRPC endpoint → `http://localhost:3000/trpc`
- Uploads → `http://localhost:3000/uploads/:key`

Run individual workspaces when needed:

```bash
pnpm --filter @contact-app/api dev
pnpm --filter web dev
pnpm --filter web test
```

### Useful scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run all apps in watch mode |
| `pnpm build` | Build all apps via Turbo |
| `pnpm typecheck` | Run TypeScript typecheck across the monorepo |
| `pnpm lint` / `pnpm lint:fix` | Lint with Biome |
| `pnpm format` / `pnpm format:fix` | Format with Biome |
| `pnpm test:integration` | Run integration tests |
| `pnpm db:up` | Start Postgres + MinIO containers |
| `pnpm db:reset` | Alias for `pnpm db:reset:db` |
| `pnpm db:reset:db` | Tear down containers, wipe Postgres, keep MinIO |
| `pnpm db:reset:all` | Tear down containers and wipe both Postgres + MinIO |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:generate` | Generate migrations from schema changes |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:push` | Push schema directly (dev only) |
| `pnpm db:seed` | Seed the database with sample data |
| `pnpm db:seed:images` | Re-upload shared seed images to MinIO |
| `pnpm clean` | Remove build outputs, caches, and `node_modules` |

## Build

Build everything:

```bash
pnpm build
```

Build only the API:

```bash
pnpm --filter @contact-app/api build
```

Build only the web app:

```bash
pnpm --filter web build
pnpm --filter web preview
```

The API is bundled with [tsup](https://tsup.egoist.dev/) into `apps/api/dist/index.mjs`. Workspace packages such as `@contact-app/core` are bundled in via `noExternal`.

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

Compose uses bind mounts for local persistence:

- Postgres data is stored in `./data/postgres`
- MinIO object data is stored in `./data/s3`

Normal restarts and `docker compose down` keep both folders. Use `pnpm db:reset:db` to rebuild the database without touching MinIO, and `pnpm db:seed:images` if you need to restore the shared `seed/...` objects without reseeding every contact. Use `pnpm db:reset:all` only when you want a full clean slate for both the database and S3.

## Environment variables

Root env values live in `.env` (see `.env.example`):

- `PORT`, `NODE_ENV`, `LOG_LEVEL`
- `DB_URL` — Postgres connection string
- `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`

Web app env values live in `apps/web/.env.local`:

- `VITE_API_URL` — base URL for the API, for example `http://localhost:3000`

## Project layout

```text
contact-app/
├── apps/
│   ├── api/        # Hono + tRPC server and upload routes
│   └── web/        # React/TanStack Start frontend
├── packages/
│   ├── core/       # Domain, DB (Drizzle), S3, config, logger
│   └── ui/         # Shared UI primitives
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```


## Dev Notes

While this is a relatively small project it doesn't require this kind of complexity. But if we assume that this is a complex project with many packages, this kind of code organization would make it last longer on the long run. As this setup contains years of proven experience. 

Why core package? Why modules folder in web app?
As you can see the code is organized in a way that it's not just easy to navigate and understand it but also it's decoupled from the frameworks which makes it easier to refactor, change stack for example from trpc to simple rest or graphql etc. As api app is just a thin layer it's very easy to change it.
Same in the web app most logic is not coupled to the TanStack Router or any other framework which makes it easier to change the stack.

As for the web components organization i'd say that it very depends on the project itself how they are organized in packages/ui i'd keep the design system and ui primitives that might be common across the apps. Apps itself should only have self contained componets that are only related to the current app.

#### Regarding UI/UX solutions
For the mobile view i tryied to degrade UX as less as possible so the main menu contains all the buttons in mobile and desktop views. Back button and theme switcher buttons in the mobile view are moved to the top because it keeps same UX. I could move back button next to "Contacts" heading and theme swithcer button to the primary menu but in this case i had to create or 2 rows or some dropdown menu and for example make add contacts button sticky but it would cover the 3 dots menu of the contact items and the drop down menu in the header wouldn't be as obvious. So i decided to keep header as is in mobile menu with slightly smaller title and move back and theme switcher buttons to the top, while header is sticky seems to be one more good solution.

As for the contact list while there's no hover in the mobile view i decide to always show the drop down menu but for the smaller screens all the items had to be moved into the drop down menu as the action buttons were taking to much space and contact details (name and phone number) did'nt fit. In some cases we could add line swipe actions but that might be not so clear for the users.

P.S. usually i don't make this big commits :D license file is intentionally added to the repo usually i don't do that just for ease of testting
