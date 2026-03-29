import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import assessRouter from "./assess.js";
import reportRouter from "./report.js";
import sessionsRouter from "./sessions.js";
import reportsRouter from "./reports.js";
import authRouter from "./auth.js";
import sentimentRouter from "./sentiment.js";
import personalityRouter from "./personality.js";
import analyticsRouter from "./analytics.js";
import coachingRouter from "./coaching.js";
import calibrationRouter from "./calibration.js";
import audioRouter from "./audio.js";
import invitesRouter from "./invites.js";
import publicInviteRouter from "./publicInvite.js";
import geminiRouter from "./gemini.js";
import feedbackRouter from "./feedback.js";
import candidatesRouter from "./candidates.js";
import candidateDocumentsRouter from "./candidateDocuments.js";
import candidateIntelligenceRouter from "./candidateIntelligence.js";
import candidateNotesRouter from "./candidateNotes.js";
import referencesRouter from "./references.js";
import { authenticate } from "../middleware/auth.js";

const router: IRouter = Router();

router.use(authRouter);

// req.path inside this router is relative (e.g. "/healthz", "/auth/login") —
// do NOT include the "/api" prefix here.
const publicPaths = ['/auth/', '/healthz', '/public/'];
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
router.use(sessionsRouter);
router.use(reportsRouter);
router.use(sentimentRouter);
router.use(personalityRouter);
router.use(analyticsRouter);
router.use(coachingRouter);
router.use(calibrationRouter);
router.use(audioRouter);
router.use(invitesRouter);
router.use(publicInviteRouter);
router.use(geminiRouter);
router.use(feedbackRouter);
router.use(candidatesRouter);
router.use(candidateDocumentsRouter);
router.use(candidateIntelligenceRouter);
router.use(candidateNotesRouter);
router.use(referencesRouter);

export default router;
