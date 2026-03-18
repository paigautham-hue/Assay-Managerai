import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import assessRouter from "./assess.js";
import reportRouter from "./report.js";
import sessionRouter from "./session.js";
import sessionsRouter from "./sessions.js";
import reportsRouter from "./reports.js";
import authRouter from "./auth.js";
import sentimentRouter from "./sentiment.js";
import { authenticate } from "../middleware/auth.js";

const router: IRouter = Router();

router.use(authRouter);

const publicPaths = ['/api/auth/', '/api/health'];
function isPublicPath(path: string): boolean {
  return publicPaths.some(p => path.startsWith(p));
}

router.use((req, res, next) => {
  if (isPublicPath(req.path)) return next();
  return authenticate(req, res, next);
});

router.use(healthRouter);
router.use(assessRouter);
router.use(reportRouter);
router.use(sessionRouter);
router.use(sessionsRouter);
router.use(reportsRouter);
router.use(sentimentRouter);

export default router;
