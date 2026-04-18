FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g corepack@latest && corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm --filter @contact-app/api build
RUN pnpm deploy --legacy --filter=@contact-app/api --prod --ignore-scripts /prod/api

FROM base AS runner
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 3000
CMD ["pnpm", "start"]
