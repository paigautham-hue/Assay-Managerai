import path from "path";
import { fileURLToPath } from "url";
import { build as esbuild } from "esbuild";
import { rm, writeFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENGINE_BINARY =
  "libquery_engine-debian-openssl-3.0.x.so.node";

// The wrapper that becomes dist/index.cjs (the file the deployment runs).
// It is intentionally plain CJS — no bundler involved — so the error handling
// code is always readable and reliable regardless of what esbuild does.
function makeWrapper(engineBinary: string): string {
  return `'use strict';
const path = require('path');

// Point Prisma to the git-tracked engine binary before any module loads.
if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(
    __dirname, '..', 'src', 'generated', 'prisma', '${engineBinary}'
  );
}

// Capture all errors and print them clearly so they appear in deployment logs.
process.on('uncaughtException', function(err) {
  process.stderr.write('[CRASH uncaughtException] ' + (err && err.stack || err) + '\\n');
  process.exit(1);
});
process.on('unhandledRejection', function(reason) {
  process.stderr.write('[CRASH unhandledRejection] ' + String(reason) + '\\n');
  process.exit(1);
});

try {
  require('./server.cjs');
} catch (err) {
  process.stderr.write('[CRASH require] ' + (err && err.stack || err) + '\\n');
  process.exit(1);
}
`;
}

async function buildAll() {
  const distDir = path.resolve(__dirname, "dist");
  await rm(distDir, { recursive: true, force: true });

  console.log("building server bundle → dist/server.cjs ...");

  // Build the real application bundle as server.cjs.
  // All npm packages are inlined (external: []) so the binary is fully
  // self-contained and does NOT require node_modules at runtime.
  await esbuild({
    entryPoints: [path.resolve(__dirname, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: path.resolve(distDir, "server.cjs"),
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: [],
    logLevel: "info",
  });

  // Write dist/index.cjs as a plain, readable wrapper.
  // The deployment runs `node artifacts/api-server/dist/index.cjs`.
  console.log("writing wrapper  → dist/index.cjs ...");
  await writeFile(
    path.resolve(distDir, "index.cjs"),
    makeWrapper(ENGINE_BINARY),
    "utf-8",
  );

  console.log("build complete");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
