#!/usr/bin/env node
/**
 * Bootstrap entry point for production.
 * Sets PRISMA_QUERY_ENGINE_LIBRARY before importing the main server bundle.
 * This avoids ESM import hoisting which would load @prisma/client before the env var is set.
 *
 * Strategy: try each engine variant in order, verify it can actually be loaded,
 * then set the env var to the first working one.
 */
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Engine variants to try in order of preference
// musl is for Alpine Linux containers (no libssl needed, statically linked)
// debian variants need libssl.so.1.1 or libssl.so.3 installed
const ENGINE_VARIANTS = [
  'libquery_engine-linux-musl-openssl-3.0.x.so.node',
  'libquery_engine-linux-musl.so.node',
  'libquery_engine-debian-openssl-3.0.x.so.node',
  'libquery_engine-debian-openssl-1.1.x.so.node',
];

const SEARCH_ROOTS = [
  '/usr/src/app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client',
  '/usr/src/app/node_modules/.prisma/client',
  '/usr/src/app/node_modules/.pnpm/@prisma+engines@5.22.0/node_modules/@prisma/engines',
  '/usr/src/app/node_modules/.pnpm/prisma@5.22.0/node_modules/prisma',
  path.resolve(process.cwd(), 'node_modules', '.prisma', 'client'),
  path.resolve(process.cwd(), 'node_modules', '.pnpm', '@prisma+client@5.22.0_prisma@5.22.0', 'node_modules', '.prisma', 'client'),
  path.resolve(__dirname, '..', 'node_modules', '.prisma', 'client'),
];

function findWorkingEngine() {
  // First try known paths for each variant in preference order
  for (const engineName of ENGINE_VARIANTS) {
    for (const root of SEARCH_ROOTS) {
      const candidate = path.join(root, engineName);
      try {
        if (fs.existsSync(candidate)) {
          // Try to actually load it to verify it works
          try {
            require(candidate);
            console.log(`[Prisma] Working engine found: ${candidate}`);
            return candidate;
          } catch (loadErr) {
            console.log(`[Prisma] Engine exists but failed to load: ${candidate} - ${loadErr.message?.split('\n')[0]}`);
            // Continue to next candidate
          }
        }
      } catch { /* ignore */ }
    }
  }

  // Fallback: use find to search for any working engine
  try {
    const searchBase = fs.existsSync('/usr/src/app/node_modules') 
      ? '/usr/src/app/node_modules' 
      : path.resolve(process.cwd(), 'node_modules');
    
    for (const engineName of ENGINE_VARIANTS) {
      const found = execSync(
        `find ${searchBase} -name "${engineName}" 2>/dev/null | head -3`,
        { encoding: 'utf8', timeout: 10000 }
      ).trim().split('\n').filter(Boolean);
      
      for (const candidate of found) {
        if (!fs.existsSync(candidate)) continue;
        try {
          require(candidate);
          console.log(`[Prisma] Working engine found via find: ${candidate}`);
          return candidate;
        } catch (loadErr) {
          console.log(`[Prisma] Engine found but failed: ${candidate} - ${loadErr.message?.split('\n')[0]}`);
        }
      }
    }
  } catch { /* ignore */ }

  return null;
}

// Set env var BEFORE any @prisma/client import
const currentLib = process.env.PRISMA_QUERY_ENGINE_LIBRARY;
const currentLibWorks = currentLib && (() => {
  try { require(currentLib); return true; } catch { return false; }
})();

if (!currentLibWorks) {
  const enginePath = findWorkingEngine();
  if (enginePath) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
    console.log(`[Prisma] PRISMA_QUERY_ENGINE_LIBRARY set to: ${enginePath}`);
  } else {
    delete process.env.PRISMA_QUERY_ENGINE_LIBRARY;
    console.log('[Prisma] WARNING: No working engine found, using Prisma default detection');
  }
} else {
  console.log(`[Prisma] Using pre-set engine: ${currentLib}`);
}

// NOW dynamically import the main server - @prisma/client will see the env var
await import('./index.js');
