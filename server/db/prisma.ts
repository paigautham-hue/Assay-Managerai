import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Force Prisma to use the correct OpenSSL engine binary.
// Production containers often have OpenSSL 3.x but Prisma detects 1.1.x.
// Setting PRISMA_QUERY_ENGINE_LIBRARY forces the correct binary.
if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const candidates = [
    // Production path (deployed app at /usr/src/app)
    '/usr/src/app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node',
    // Local dev path relative to this file
    path.resolve(__dirname, '..', '..', 'node_modules', '.prisma', 'client', 'libquery_engine-debian-openssl-3.0.x.so.node'),
    // CWD-based path
    path.resolve(process.cwd(), 'node_modules', '.prisma', 'client', 'libquery_engine-debian-openssl-3.0.x.so.node'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = candidate;
        break;
      }
    } catch {
      // ignore
    }
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
