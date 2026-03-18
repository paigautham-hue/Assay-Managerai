import { Router, type IRouter } from "express";
import healthRouter from "./health";
import assessRouter from "./assess";
import reportRouter from "./report";
import sessionRouter from "./session";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assessRouter);
router.use(reportRouter);
router.use(sessionRouter);

export default router;
