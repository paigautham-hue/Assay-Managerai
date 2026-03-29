import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix Prisma engine binary resolution for OpenSSL 3.x containers.
// Production containers have OpenSSL 3.x but Prisma auto-detects 1.1.x.
// This MUST run BEFORE PrismaClient is imported.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currentLib = process.env.PRISMA_QUERY_ENGINE_LIBRARY;

if (!currentLib || !fs.existsSync(currentLib)) {
  // Either not set at all, or set to a path that doesn't exist (e.g. prod path in dev)
  const candidates = [
    // Production container path
    '/usr/src/app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node',
    // Local dev paths
    path.resolve(__dirname, '..', '..', 'node_modules', '.prisma', 'client', 'libquery_engine-debian-openssl-3.0.x.so.node'),
    path.resolve(process.cwd(), 'node_modules', '.prisma', 'client', 'libquery_engine-debian-openssl-3.0.x.so.node'),
  ];
  let found = false;
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = candidate;
      found = true;
      break;
    }
  }
  if (!found && currentLib) {
    // Fall back to native detection if we had a bad path
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
