"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const poi_1 = require("./routes/poi");
const session_1 = require("./routes/session");
const app = (0, express_1.default)();
exports.app = app;
// ─── CORS: Only allow the React frontend origin ─────────────────────
const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
app.use((0, cors_1.default)({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express_1.default.json());
// ─── Health Check ───────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// ─── Routes ─────────────────────────────────────────────────────────
app.use("/api/sessions", session_1.sessionRouter);
app.use("/api/pois", poi_1.poiRouter);
//# sourceMappingURL=app.js.map