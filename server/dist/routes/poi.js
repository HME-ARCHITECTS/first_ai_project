"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poiRouter = void 0;
const express_1 = require("express");
const shared_1 = require("shared");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
exports.poiRouter = router;
// In-memory store (will be replaced per spec in future iterations)
const pois = [];
// POST /api/pois — Add a Point of Interest
router.post("/", (req, res) => {
    try {
        const poi = shared_1.AddPoiRequestSchema.parse(req.body);
        pois.push(poi);
        res.status(201).json(poi);
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
// GET /api/pois — List all POIs
router.get("/", (_req, res) => {
    res.json(pois);
});
//# sourceMappingURL=poi.js.map