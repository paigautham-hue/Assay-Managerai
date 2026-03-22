import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { existsSync } from "fs";
import router from "./routes/index.js";

const app: Express = express();

const APP_URL = process.env.APP_URL || '';
const allowedOrigins = [APP_URL, 'http://localhost:5173', 'http://localhost:3000'].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin (no origin header), explicit allowlist, and Replit/Capacitor domains
    if (!origin || allowedOrigins.some(o => origin.startsWith(o)) || origin.endsWith('.replit.dev') || origin.endsWith('.repl.co') || origin.endsWith('.replit.app') || origin.startsWith('capacitor://') || origin.startsWith('ionic://') || origin.startsWith('assay://')) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

// In production the compiled CJS bundle serves the pre-built Vite frontend.
// process.env.NODE_ENV is baked to "production" by esbuild at build time.
if (process.env.NODE_ENV === "production") {
  // Resolved at runtime relative to the workspace root (CWD when running the server).
  const staticDir = path.join(process.cwd(), "artifacts", "assay-app", "dist", "public");

  if (existsSync(staticDir)) {
    app.use(express.static(staticDir));
    // SPA fallback — let React Router handle client-side routing.
    app.get("/{*splat}", (_req, res) => {
      res.sendFile(path.join(staticDir, "index.html"));
    });
  } else {
    console.warn(`[app] Production static dir not found: ${staticDir}`);
  }
}

export default app;
