import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Fix Prisma engine binary resolution for OpenSSL 3.x containers.
// Production containers have OpenSSL 3.x but Prisma auto-detects 1.1.x.
// This MUST run BEFORE PrismaClient is imported.
const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);

const ENGINE_NAME = 'libquery_engine-debian-openssl-3.0.x.so.node';

function findEngineLibrary(): string | null {
  // 1. Check explicit candidates — including the pnpm-hoisted path
  const candidates = [
    // pnpm hoisted path (this is where it actually lives on the production server)
    `/usr/src/app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client/${ENGINE_NAME}`,
    // Standard flat paths
    `/usr/src/app/node_modules/.prisma/client/${ENGINE_NAME}`,
    // Local dev paths
    path.resolve(__dirname2, '..', '..', 'node_modules', '.prisma', 'client', ENGINE_NAME),
    path.resolve(process.cwd(), 'node_modules', '.prisma', 'client', ENGINE_NAME),
    // pnpm local dev hoisted path
    path.resolve(process.cwd(), 'node_modules', '.pnpm', '@prisma+client@5.22.0_prisma@5.22.0', 'node_modules', '.prisma', 'client', ENGINE_NAME),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // 2. Fallback: use `find` to locate the binary wherever pnpm put it
  try {
    const searchRoot = fs.existsSync('/usr/src/app/node_modules')
      ? '/usr/src/app/node_modules'
      : path.resolve(process.cwd(), 'node_modules');
    const found = execSync(
      `find ${searchRoot} -name "${ENGINE_NAME}" 2>/dev/null`,
      { encoding: 'utf8', timeout: 5000 }
    ).trim().split('\n')[0];
    if (found && fs.existsSync(found)) {
      return found;
    }
  } catch {
    // find command failed — ignore
  }

  return null;
}

const currentLib = process.env.PRISMA_QUERY_ENGINE_LIBRARY;

if (!currentLib || !fs.existsSync(currentLib)) {
  const enginePath = findEngineLibrary();
  if (enginePath) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
  } else if (currentLib) {
    // Bad path set, fall back to native detection
    delete process.env.PRISMA_QUERY_ENGINE_LIBRARY;
  }
}

import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// TiDB Cloud requires SSL. The DATABASE_URL may include ssl={"rejectUnauthorized":true}
// but Prisma v5 doesn't parse that param. We must pass the datasource override.
function buildPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || '';
  // Strip the ?ssl=... query param if present, and add sslaccept=strict
  const cleanUrl = dbUrl.replace(/\?ssl=.*$/, '');
  const sslUrl = cleanUrl.includes('?')
    ? `${cleanUrl}&sslaccept=strict`
    : `${cleanUrl}?sslaccept=strict`;

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: sslUrl,
      },
    },
  });
}

const prisma = globalThis.__prisma ?? buildPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;
