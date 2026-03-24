"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorSchema = exports.AddPoiRequestSchema = exports.CreateSessionRequestSchema = exports.PointOfInterestSchema = exports.StoreSessionSchema = void 0;
const zod_1 = require("zod");
// ─── Store Session Schema ───────────────────────────────────────────
exports.StoreSessionSchema = zod_1.z.object({
    storeId: zod_1.z
        .string()
        .regex(/^[A-Z]{2}-\d{3}$/, "storeId must follow pattern [AA]-[000]"),
    installerId: zod_1.z
        .string()
        .min(5, "installerId must be at least 5 characters"),
    cameraSlot: zod_1.z
        .number()
        .int()
        .min(1, "cameraSlot must be between 1 and 16")
        .max(16, "cameraSlot must be between 1 and 16"),
    environment: zod_1.z.literal("Drive-Thru"),
    timestamp: zod_1.z.string().datetime(),
});
// ─── Point of Interest Schema ───────────────────────────────────────
exports.PointOfInterestSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    x: zod_1.z.number().min(0).max(1),
    y: zod_1.z.number().min(0).max(1),
    timestamp: zod_1.z.string().datetime(),
    location: zod_1.z.object({
        lat: zod_1.z.number().min(-90).max(90),
        lng: zod_1.z.number().min(-180).max(180),
    }),
});
// ─── API Request/Response Schemas ───────────────────────────────────
exports.CreateSessionRequestSchema = exports.StoreSessionSchema;
exports.AddPoiRequestSchema = exports.PointOfInterestSchema;
exports.ApiErrorSchema = zod_1.z.object({
    error: zod_1.z.string(),
    message: zod_1.z.string(),
    statusCode: zod_1.z.number(),
});
//# sourceMappingURL=schemas.js.map