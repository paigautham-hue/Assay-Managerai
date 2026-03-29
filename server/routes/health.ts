import { Router, type IRouter } from "express";
import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Temporary debug endpoint - diagnose production environment
router.get("/debug-register", async (_req, res) => {
  const diagnostics: Record<string, any> = {};

  // 1. Check OpenSSL version on this server
  try {
    diagnostics.opensslVersion = execSync("openssl version 2>/dev/null || echo 'not found'", { encoding: "utf8" }).trim();
  } catch { diagnostics.opensslVersion = "check failed"; }

  // 2. Check what engine binaries exist
  try {
    const engineSearch = execSync(
      "find /usr/src/app/node_modules -name 'libquery_engine-*.so.node' 2>/dev/null || find node_modules -name 'libquery_engine-*.so.node' 2>/dev/null",
      { encoding: "utf8", timeout: 5000 }
    ).trim();
    diagnostics.engineBinaries = engineSearch ? engineSearch.split("\n") : ["NONE FOUND"];
  } catch { diagnostics.engineBinaries = ["search failed"]; }

  // 3. Check PRISMA_QUERY_ENGINE_LIBRARY env var
  diagnostics.envPrismaLib = process.env.PRISMA_QUERY_ENGINE_LIBRARY || "NOT SET";
  if (process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
    diagnostics.envPrismaLibExists = fs.existsSync(process.env.PRISMA_QUERY_ENGINE_LIBRARY);
  }

  // 4. Check the prisma schema location
  const schemaPaths = [
    "/usr/src/app/prisma/schema.prisma",
    path.resolve(process.cwd(), "prisma/schema.prisma"),
  ];
  for (const sp of schemaPaths) {
    if (fs.existsSync(sp)) {
      const content = fs.readFileSync(sp, "utf8");
      const btMatch = content.match(/binaryTargets\s*=\s*\[([^\]]+)\]/);
      diagnostics.schemaPath = sp;
      diagnostics.schemaBinaryTargets = btMatch ? btMatch[1] : "NOT FOUND in schema";
      break;
    }
  }

  // 5. Check node_modules/.prisma/client exists
  const prismaClientPaths = [
    "/usr/src/app/node_modules/.prisma/client",
    path.resolve(process.cwd(), "node_modules/.prisma/client"),
  ];
  for (const pcp of prismaClientPaths) {
    if (fs.existsSync(pcp)) {
      try {
        const files = fs.readdirSync(pcp).filter((f: string) => f.includes("libquery"));
        diagnostics.prismaClientPath = pcp;
        diagnostics.prismaClientEngines = files.length > 0 ? files : ["NO ENGINE FILES"];
        const stat = fs.lstatSync(pcp);
        diagnostics.prismaClientIsSymlink = stat.isSymbolicLink();
        if (stat.isSymbolicLink()) {
          diagnostics.prismaClientSymlinkTarget = fs.readlinkSync(pcp);
        }
      } catch (e: any) { diagnostics.prismaClientError = e.message; }
      break;
    }
  }

  // 6. Try actual DB operation
  try {
    await prisma.$queryRaw`SELECT 1 as test`;
    const count = await prisma.user.count();
    const hash = await bcrypt.hash("test", 1);
    const testEmail = `debug-${Date.now()}@test.local`;
    const user = await prisma.user.create({
      data: { email: testEmail, name: "Debug Test", passwordHash: hash, role: "viewer" },
    });
    await prisma.user.delete({ where: { id: user.id } });
    diagnostics.dbTest = "PASSED";
    diagnostics.userCount = count;
  } catch (err: any) {
    diagnostics.dbTest = "FAILED";
    diagnostics.dbError = err.message;
    diagnostics.dbErrorCode = err.code;
    diagnostics.dbStack = err.stack?.split("\n").slice(0, 5);
  }

  res.json(diagnostics);
});

export default router;
