import { z } from "zod";

// ─── Store Session Schema ───────────────────────────────────────────
export const StoreSessionSchema = z.object({
  storeId: z
    .string()
    .regex(/^[A-Z]{2}-\d{3}$/, "storeId must follow pattern [AA]-[000]"),
  installerId: z
    .string()
    .min(5, "installerId must be at least 5 characters"),
  cameraSlot: z
    .number()
    .int()
    .min(1, "cameraSlot must be between 1 and 16")
    .max(16, "cameraSlot must be between 1 and 16"),
  environment: z.literal("Drive-Thru"),
  timestamp: z.string().datetime(),
});

export type StoreSession = z.infer<typeof StoreSessionSchema>;

// ─── Point of Interest Schema ───────────────────────────────────────
export const PointOfInterestSchema = z.object({
  id: z.string().uuid(),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  timestamp: z.string().datetime(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

export type PointOfInterest = z.infer<typeof PointOfInterestSchema>;

// ─── API Request/Response Schemas ───────────────────────────────────
export const CreateSessionRequestSchema = StoreSessionSchema;
export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;

export const AddPoiRequestSchema = PointOfInterestSchema;
export type AddPoiRequest = z.infer<typeof AddPoiRequestSchema>;

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
