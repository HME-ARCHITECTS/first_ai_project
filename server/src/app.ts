import express from "express";
import cors from "cors";
import { poiRouter } from "./routes/poi";
import { sessionRouter } from "./routes/session";

const app = express();

// ─── CORS: Only allow the React frontend origin ─────────────────────
const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// ─── Health Check ───────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ─────────────────────────────────────────────────────────
app.use("/api/sessions", sessionRouter);
app.use("/api/pois", poiRouter);

export { app };
