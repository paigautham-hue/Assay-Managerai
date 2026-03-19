import path from "path";
import { fileURLToPath } from "url";
import { build as esbuild } from "esbuild";
import { rm, readFile, cp, mkdir } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times without risking some
// packages that are not bundle compatible
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  const distDir = path.resolve(__dirname, "dist");
  await rm(distDir, { recursive: true, force: true });

  console.log("building server...");
  const pkgPath = path.resolve(__dirname, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter(
    (dep) =>
      !allowlist.includes(dep) &&
      !(pkg.dependencies?.[dep]?.startsWith("workspace:")),
  );

  // Prisma's generated client contains a native .node binary that cannot be
  // bundled by esbuild. We mark it as external so the CJS output keeps a
  // require() call, then copy the generated directory to the location Node
  // will resolve it from at runtime (dist/../generated/prisma →
  // artifacts/api-server/generated/prisma).
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
    external: externals,
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
