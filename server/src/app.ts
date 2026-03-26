import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { camerasRouter } from "./routes/cameras";
import { poiRouter } from "./routes/poi";
import { capturesRouter } from "./routes/captures";
import { surveysRouter } from "./routes/surveys";

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
app.use("/api/auth", authRouter);
app.use("/api/cameras", camerasRouter);
app.use("/api/pois", poiRouter);
app.use("/api/captures", capturesRouter);
app.use("/api/surveys", surveysRouter);

export { app };
