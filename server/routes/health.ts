import { Router, type IRouter } from "express";
import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Temporary debug endpoint - tests DB write capability
router.get("/debug-register", async (_req, res) => {
  try {
    // Test 1: DB connection
    await prisma.$queryRaw`SELECT 1 as test`;
    // Test 2: Count users
    const count = await prisma.user.count();
    // Test 3: Try a dry-run create (we'll catch the error)
    const hash = await bcrypt.hash('test', 1);
    const testEmail = `debug-${Date.now()}@test.local`;
    const user = await prisma.user.create({
      data: { email: testEmail, name: 'Debug Test', passwordHash: hash, role: 'viewer' }
    });
    await prisma.user.delete({ where: { id: user.id } });
    res.json({ status: 'ok', userCount: count, createTest: 'passed', userId: user.id });
  } catch (err: any) {
    res.status(500).json({ 
      status: 'error', 
      message: err.message, 
      code: err.code,
      meta: err.meta,
      stack: err.stack?.split('\n').slice(0, 5)
    });
  }
});

export default router;
