// Engine resolution happens in prisma-engine-resolve.ts which must be imported
// at the server entry point BEFORE this file.
// Import from the generated client directly to avoid the re-export type issue
import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: InstanceType<typeof PrismaClient> | undefined;
}

function buildPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || '';
  // TiDB Cloud requires SSL
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
