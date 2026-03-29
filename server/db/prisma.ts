import { PrismaClient } from '../generated/prisma/index.js';

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
