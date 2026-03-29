#!/usr/bin/env node
/**
 * Bootstrap entry point for production.
 * Sets PRISMA_QUERY_ENGINE_LIBRARY before importing the main server bundle.
 * This avoids ESM import hoisting which would load @prisma/client before the env var is set.
 */
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const ENGINE_NAME = 'libquery_engine-debian-openssl-3.0.x.so.node';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findEngineLibrary() {
  const candidates = [
    `/usr/src/app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client/${ENGINE_NAME}`,
    `/usr/src/app/node_modules/.prisma/client/${ENGINE_NAME}`,
    `/usr/src/app/node_modules/.pnpm/@prisma+engines@5.22.0/node_modules/@prisma/engines/${ENGINE_NAME}`,
    `/usr/src/app/node_modules/.pnpm/prisma@5.22.0/node_modules/prisma/${ENGINE_NAME}`,
    path.resolve(process.cwd(), 'node_modules', '.prisma', 'client', ENGINE_NAME),
    path.resolve(process.cwd(), 'node_modules', '.pnpm', '@prisma+client@5.22.0_prisma@5.22.0', 'node_modules', '.prisma', 'client', ENGINE_NAME),
    path.resolve(__dirname, '..', 'node_modules', '.prisma', 'client', ENGINE_NAME),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch { /* ignore */ }
  }

  // Fallback: use find
  try {
    const searchRoots = ['/usr/src/app/node_modules', path.resolve(process.cwd(), 'node_modules')];
    for (const root of searchRoots) {
      if (!fs.existsSync(root)) continue;
      const found = execSync(`find ${root} -name "${ENGINE_NAME}" 2>/dev/null | head -1`, {
        encoding: 'utf8', timeout: 10000
      }).trim();
      if (found && fs.existsSync(found)) return found;
    }
  } catch { /* ignore */ }

  return null;
}

// Set env var BEFORE any @prisma/client import
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

// NOW dynamically import the main server - @prisma/client will see the env var
await import('./index.js');
