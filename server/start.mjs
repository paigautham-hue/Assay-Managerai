#!/usr/bin/env node
/**
 * Bootstrap entry point for production.
 *
 * Strategy:
 * 1. If LD_LIBRARY_PATH is already set with our lib dir, we've already re-exec'd — skip to step 3.
 * 2. Otherwise, set LD_LIBRARY_PATH to include bundled libssl.so.3/libcrypto.so.3,
 *    then re-exec this same script via spawnSync so the new process inherits the env var
 *    BEFORE any native .so.node binaries are dlopen'd.
 * 3. Set PRISMA_QUERY_ENGINE_LIBRARY to the debian-openssl-3.0.x engine (which needs libssl.so.3).
 * 4. Dynamically import the main server bundle.
 */
import path from 'path';
import fs from 'fs';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REEXEC_MARKER = '_ASSAY_LDPATH_SET';

// ── Step 1: Re-exec if LD_LIBRARY_PATH not yet configured ──────────────────
if (!process.env[REEXEC_MARKER]) {
  // Determine the directory containing bundled .so files
  // In production: /usr/src/app/dist/  (same dir as this script)
  const libDir = __dirname;

  // Check if bundled libssl exists here
  const bundledSsl = path.join(libDir, 'libssl.so.3');
  const hasBundled = fs.existsSync(bundledSsl);

  if (hasBundled) {
    const currentLdPath = process.env.LD_LIBRARY_PATH || '';
    const newLdPath = currentLdPath ? `${libDir}:${currentLdPath}` : libDir;

    console.log(`[Prisma] Bundled libssl.so.3 found at ${bundledSsl}`);
    console.log(`[Prisma] Re-executing with LD_LIBRARY_PATH=${newLdPath}`);

    const result = spawnSync(process.execPath, [__filename], {
      env: {
        ...process.env,
        LD_LIBRARY_PATH: newLdPath,
        [REEXEC_MARKER]: '1',
      },
      stdio: 'inherit',
    });

    process.exit(result.status ?? 1);
  } else {
    console.log(`[Prisma] No bundled libssl.so.3 at ${bundledSsl}, proceeding without LD_LIBRARY_PATH override`);
    // Fall through to engine selection below
  }
}

// ── Step 2: Select the best Prisma engine binary ───────────────────────────
// Now that LD_LIBRARY_PATH is set (if bundled libs exist), select the engine.
// Prefer debian-openssl-3.0.x since we bundled libssl.so.3.

const ENGINE_VARIANTS = [
  'libquery_engine-debian-openssl-3.0.x.so.node',
  'libquery_engine-linux-musl-openssl-3.0.x.so.node',
  'libquery_engine-linux-musl.so.node',
  'libquery_engine-debian-openssl-1.1.x.so.node',
];

const SEARCH_ROOTS = [
  '/usr/src/app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client',
  '/usr/src/app/node_modules/.prisma/client',
  path.resolve(process.cwd(), 'node_modules', '.prisma', 'client'),
  path.resolve(process.cwd(), 'node_modules', '.pnpm', '@prisma+client@5.22.0_prisma@5.22.0', 'node_modules', '.prisma', 'client'),
  path.resolve(__dirname, '..', 'node_modules', '.prisma', 'client'),
];

function findEngineByName(name) {
  for (const root of SEARCH_ROOTS) {
    const candidate = path.join(root, name);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function findBestEngine() {
  for (const variant of ENGINE_VARIANTS) {
    const found = findEngineByName(variant);
    if (found) {
      console.log(`[Prisma] Selected engine: ${found}`);
      return found;
    }
  }
  return null;
}

// Override PRISMA_QUERY_ENGINE_LIBRARY unconditionally with the best available engine
const enginePath = findBestEngine();
if (enginePath) {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
  console.log(`[Prisma] PRISMA_QUERY_ENGINE_LIBRARY = ${enginePath}`);
} else {
  delete process.env.PRISMA_QUERY_ENGINE_LIBRARY;
  console.log('[Prisma] WARNING: No engine binary found, using Prisma default detection');
}

// ── Step 3: Start the server ───────────────────────────────────────────────
await import('./index.js');
