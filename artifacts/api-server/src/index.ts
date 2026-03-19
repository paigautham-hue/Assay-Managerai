import app from "./app";

process.on("uncaughtException", (err) => {
  console.error("[startup] Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[startup] Unhandled rejection:", reason);
  process.exit(1);
});

const rawPort = process.env["PORT"];
const port = rawPort ? Number(rawPort) : 8080;

if (Number.isNaN(port) || port <= 0) {
  console.error(`[startup] Invalid PORT value: "${rawPort}"`);
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}).on("error", (err) => {
  console.error("[startup] Failed to bind port:", err);
  process.exit(1);
});
