# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-slim AS build

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files first for layer caching
COPY package.json ./
COPY api-server/package.json ./api-server/
COPY assay-app/package.json ./assay-app/

# Install all dependencies
RUN npm install --workspaces --include-workspace-root 2>/dev/null || \
    (cd api-server && npm install && cd ../assay-app && npm install)

# Copy source code
COPY . .

# Generate Prisma client
RUN cd api-server && npx prisma generate --schema=./prisma/schema.prisma

# Build frontend
RUN cd assay-app && BASE_PATH=/ npm run build

# Build backend
RUN cd api-server && npm run build

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:20-slim AS runtime

WORKDIR /app

# Install OpenSSL for Prisma runtime
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy built artifacts
COPY --from=build /app/api-server/dist ./artifacts/api-server/dist
COPY --from=build /app/api-server/src/generated ./artifacts/api-server/src/generated
COPY --from=build /app/api-server/prisma ./artifacts/api-server/prisma
COPY --from=build /app/assay-app/dist/public ./artifacts/assay-app/dist/public

# Copy package files for any runtime needs
COPY --from=build /app/api-server/package.json ./artifacts/api-server/
COPY --from=build /app/package.json ./

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Run database migrations and start server
CMD ["sh", "-c", "cd artifacts/api-server && npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss --skip-generate && cd /app && node artifacts/api-server/dist/index.cjs"]
