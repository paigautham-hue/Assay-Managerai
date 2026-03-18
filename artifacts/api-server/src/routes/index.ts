import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import assessRouter from "./assess.js";
import reportRouter from "./report.js";
import sessionRouter from "./session.js";
import sessionsRouter from "./sessions.js";
import reportsRouter from "./reports.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assessRouter);
router.use(reportRouter);
router.use(sessionRouter);
router.use(sessionsRouter);
router.use(reportsRouter);

export default router;
