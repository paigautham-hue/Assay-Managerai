import path from "path";
import { fileURLToPath } from "url";
import { build as esbuild } from "esbuild";
import { rm, readFile, cp, mkdir } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildAll() {
  const distDir = path.resolve(__dirname, "dist");
  await rm(distDir, { recursive: true, force: true });

  console.log("building server...");

  // Prisma's generated client contains a native .node binary that cannot be
  // bundled by esbuild. We mark it as external so the CJS output keeps a
  // require() call, then copy the generated directory to the location Node
  // will resolve it from at runtime (dist/../generated/prisma →
  // artifacts/api-server/generated/prisma).
  //
  // Everything else (npm packages) is bundled inline so the binary is fully
  // self-contained and does NOT require node_modules to be present at runtime.
  const prismaExternalPlugin = {
    name: "prisma-external",
    setup(build: import("esbuild").PluginBuild) {
      build.onResolve({ filter: /generated[/\\]prisma/ }, (args) => ({
        path: args.path,
        external: true,
      }));
    },
  };

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
    // Bundle ALL npm packages inline — deployment containers may not have
    // node_modules accessible, so the binary must be self-contained.
    // Only Node built-ins are automatically excluded by esbuild.
    external: [],
    plugins: [prismaExternalPlugin],
    logLevel: "info",
  });

  // Copy generated Prisma client so it can be required at runtime.
  // The CJS bundle lives at dist/index.cjs; require('../generated/prisma/...')
  // resolves to artifacts/api-server/generated/prisma/.
  const prismaSrc = path.resolve(__dirname, "src", "generated", "prisma");
  const prismaDest = path.resolve(__dirname, "generated", "prisma");
  console.log("copying prisma client to", prismaDest);
  await mkdir(prismaDest, { recursive: true });
  await cp(prismaSrc, prismaDest, { recursive: true });

  console.log("build complete");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
