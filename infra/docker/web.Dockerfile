# syntax=docker/dockerfile:1
FROM oven/bun:1 AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

FROM base AS pruner
WORKDIR /app

RUN bun install -g turbo@2.7.6

COPY . .

# Create sparse monorepo with only dependencies needed for @autonomi/web
RUN turbo prune @autonomi/web --docker

FROM base AS installer
WORKDIR /app

RUN bun install -g turbo@2.7.6

# Copy pruned package.json files and lockfile (out/json contains dependency manifests)
COPY --from=pruner /app/out/json/ .

RUN bun install --frozen-lockfile

FROM installer AS builder
WORKDIR /app

# Copy pruned source code (out/full contains workspace files)
COPY --from=pruner /app/out/full/ .

RUN turbo build --filter=@autonomi/web...

FROM base AS runner
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js standalone output includes server.js and traced dependencies
COPY --from=builder --chown=bun:bun /app/apps/web/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=bun:bun /app/apps/web/public ./apps/web/public

WORKDIR /app/apps/web

USER bun

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

STOPSIGNAL SIGTERM

CMD ["bun", "run", "server.js"]
