import path from "path";
import { fileURLToPath } from "url";
import { build as esbuild } from "esbuild";
import { rm } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Name of the Prisma query-engine binary that ships with the generated client.
// This file is committed to git alongside the generated client code so it is
// always present in both development and production (no build-time copy needed).
const ENGINE_BINARY =
  "libquery_engine-debian-openssl-3.0.x.so.node";

async function buildAll() {
  const distDir = path.resolve(__dirname, "dist");
  await rm(distDir, { recursive: true, force: true });

  console.log("building server...");

  // The Prisma query-engine binary lives in src/generated/prisma/ (git-tracked).
  // When esbuild bundles the Prisma client, __dirname inside the bundle becomes
  // the dist/ folder, so Prisma cannot find the binary on its own.
  //
  // Fix: inject a one-line banner at the absolute top of the CJS output —
  // before ANY module code runs — that sets PRISMA_QUERY_ENGINE_LIBRARY to the
  // correct absolute path derived from __dirname at runtime.
  //
  // All npm packages are bundled inline (external: []) so the binary is fully
  // self-contained and does NOT require node_modules to be present at runtime.
  const engineBannerLine = [
    `if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {`,
    `  process.env.PRISMA_QUERY_ENGINE_LIBRARY =`,
    `    require("path").join(__dirname, "..", "src", "generated", "prisma", "${ENGINE_BINARY}");`,
    `}`,
  ].join(" ");

  await esbuild({
    entryPoints: [path.resolve(__dirname, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: path.resolve(distDir, "index.cjs"),
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: [],
    banner: { js: engineBannerLine },
    logLevel: "info",
  });

  console.log("build complete");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
