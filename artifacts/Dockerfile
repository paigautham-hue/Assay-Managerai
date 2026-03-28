# ── Stage 1: Build ────────────────────────────────────────────────────────────
# This Dockerfile is designed to be built from the REPOSITORY ROOT, not from
# artifacts/. Use: docker build -f artifacts/Dockerfile .
FROM node:22-slim AS build

WORKDIR /app

# Install system deps for Prisma + pnpm
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace config first for layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/assay-app/package.json ./artifacts/assay-app/

# Install dependencies (--frozen-lockfile if lock exists, else install fresh)
RUN pnpm install --no-frozen-lockfile 2>/dev/null || pnpm install

# Copy all source
COPY . .

# Generate Prisma client
RUN cd artifacts/api-server && pnpm prisma:generate

# Build frontend (BASE_PATH=/ for self-hosted deployment)
RUN cd artifacts/assay-app && BASE_PATH=/ pnpm build

# Build backend (esbuild bundles all deps into a single CJS file)
RUN cd artifacts/api-server && pnpm build

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
# The esbuild output is self-contained (all deps inlined), so we only need
# Node.js, the built bundle, the Prisma engine binary, and the frontend assets.
FROM node:22-slim AS runtime

WORKDIR /app

# OpenSSL for Prisma engine
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy built backend (self-contained CJS bundle — no node_modules needed)
COPY --from=build /app/artifacts/api-server/dist ./artifacts/api-server/dist

# Copy Prisma engine + schema (needed for runtime queries and migrations)
COPY --from=build /app/artifacts/api-server/src/generated ./artifacts/api-server/src/generated
COPY --from=build /app/artifacts/api-server/prisma ./artifacts/api-server/prisma

# Copy built frontend static assets
COPY --from=build /app/artifacts/assay-app/dist/public ./artifacts/assay-app/dist/public

# Prisma CLI is needed for db push on startup — install it standalone
RUN npm install -g prisma@5

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Run migrations then start server
CMD ["sh", "-c", "prisma db push --schema=./artifacts/api-server/prisma/schema.prisma --skip-generate && node artifacts/api-server/dist/index.cjs"]
