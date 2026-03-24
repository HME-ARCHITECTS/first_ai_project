"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRouter = void 0;
const express_1 = require("express");
const shared_1 = require("shared");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
exports.sessionRouter = router;
// In-memory store (will be replaced per spec in future iterations)
const sessions = [];
// POST /api/sessions — Create a new store session
router.post("/", (req, res) => {
    try {
        const session = shared_1.CreateSessionRequestSchema.parse(req.body);
        sessions.push(session);
        res.status(201).json(session);
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            res.status(400).json({
                error: "VALIDATION_ERROR",
                message: err.errors.map((e) => e.message).join(", "),
                statusCode: 400,
            });
            return;
        }
        res.status(500).json({
            error: "INTERNAL_ERROR",
            message: "An unexpected error occurred",
            statusCode: 500,
        });
    }
});
// GET /api/sessions — List all sessions
router.get("/", (_req, res) => {
    res.json(sessions);
});
//# sourceMappingURL=session.js.map