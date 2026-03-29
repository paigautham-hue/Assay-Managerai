/**
 * Prisma Engine Binary Resolver
 * 
 * This module MUST be imported BEFORE @prisma/client to set the
 * PRISMA_QUERY_ENGINE_LIBRARY env var before PrismaClient loads.
 * 
 * ES module imports are hoisted, so this file must be imported
 * at the very top of the server entry point (server/_core/index.ts).
 */
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const ENGINE_NAME = 'libquery_engine-debian-openssl-3.0.x.so.node';

function findEngineLibrary(): string | null {
  const candidates = [
    // pnpm hoisted path (production /usr/src/app)
    `/usr/src/app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client/${ENGINE_NAME}`,
    `/usr/src/app/node_modules/.prisma/client/${ENGINE_NAME}`,
    `/usr/src/app/node_modules/.pnpm/@prisma+engines@5.22.0/node_modules/@prisma/engines/${ENGINE_NAME}`,
    `/usr/src/app/node_modules/.pnpm/prisma@5.22.0/node_modules/prisma/${ENGINE_NAME}`,
    // Local dev paths
    path.resolve(process.cwd(), 'node_modules', '.prisma', 'client', ENGINE_NAME),
    path.resolve(process.cwd(), 'node_modules', '.pnpm', '@prisma+client@5.22.0_prisma@5.22.0', 'node_modules', '.prisma', 'client', ENGINE_NAME),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch {
      // ignore
    }
  }

  // Fallback: use `find`
  try {
    const searchRoots = ['/usr/src/app/node_modules', path.resolve(process.cwd(), 'node_modules')];
    for (const searchRoot of searchRoots) {
      if (!fs.existsSync(searchRoot)) continue;
      const found = execSync(
        `find ${searchRoot} -name "${ENGINE_NAME}" 2>/dev/null | head -1`,
        { encoding: 'utf8', timeout: 10000 }
      ).trim();
      if (found && fs.existsSync(found)) {
        return found;
      }
    }
  } catch {
    // ignore
  }

  return null;
}

// Set the env var NOW, before any @prisma/client import
const currentLib = process.env.PRISMA_QUERY_ENGINE_LIBRARY;
if (!currentLib || !fs.existsSync(currentLib)) {
  const enginePath = findEngineLibrary();
  if (enginePath) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
    console.log(`[Prisma] Engine resolved: ${enginePath}`);
  } else {
    delete process.env.PRISMA_QUERY_ENGINE_LIBRARY;
    console.log('[Prisma] No OpenSSL 3.0.x engine found, using default detection');
  }
}

export const PRISMA_ENGINE_RESOLVED = true;
