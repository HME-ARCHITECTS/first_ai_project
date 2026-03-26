import { z } from "zod";

// ─── Login Credentials Schema ───────────────────────────────────────
export const LoginCredentialsSchema = z.object({
  installerId: z.string().min(5, "Must be at least 5 characters"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

// ─── Auth Token Schema ──────────────────────────────────────────────
export const AuthTokenSchema = z.object({
  token: z.string().min(1),
  installerId: z.string(),
  deviceId: z.string(),
  expiresAt: z.string().datetime(),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;

// ─── Camera Schema ──────────────────────────────────────────────────
export const CameraSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Camera name is required"),
  slot: z.number().int().min(1).max(16),
  status: z.enum(["online", "offline", "error"]),
  streamUrl: z.string().url(),
});

export type Camera = z.infer<typeof CameraSchema>;

export const CameraListSchema = z.array(CameraSchema);

// ─── Point of Interest Schema ───────────────────────────────────────
export const PointOfInterestSchema = z.object({
  id: z.string().uuid(),
  cameraId: z.string().uuid(),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  timestamp: z.string().datetime(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

export type PointOfInterest = z.infer<typeof PointOfInterestSchema>;

// ─── Image Capture Schema ───────────────────────────────────────────
export const ImageCaptureSchema = z.object({
  id: z.string().uuid(),
  cameraId: z.string().uuid(),
  timestamp: z.string().datetime(),
  dataUrl: z.string().min(1, "Image data is required"),
  poiIds: z.array(z.string().uuid()),
});

export type ImageCapture = z.infer<typeof ImageCaptureSchema>;

// ─── API Error Schema ───────────────────────────────────────────────
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// ─── Survey: Step 1 — Store Information ─────────────────────────────
export const SurveyStoreInfoSchema = z.object({
  storeId: z.string().regex(/^[A-Z]{2}-\d{3}$/, "Store ID must follow pattern AA-000"),
  storeName: z.string().min(2, "Store name is required"),
  storeAddress: z.string().min(5, "Full address is required"),
  storeType: z.enum(["Drive-Thru", "Dine-In", "Dual-Lane", "Walk-Up"]),
  contactName: z.string().min(2, "Contact name is required"),
  contactPhone: z.string().regex(/^\+?[\d\s\-()]{7,15}$/, "Valid phone number is required"),
});

export type SurveyStoreInfo = z.infer<typeof SurveyStoreInfoSchema>;

// ─── Survey: Step 2 — Hardware Inventory ────────────────────────────
export const SurveyHardwareSchema = z.object({
  cameraCount: z.number().int().min(1, "At least 1 camera required").max(16),
  cameraModel: z.string().min(1, "Camera model is required"),
  mountType: z.enum(["Ceiling", "Wall", "Pole", "Gooseneck"]),
  processingUnitModel: z.string().min(1, "Processing unit model is required"),
  processingUnitSerial: z.string().min(5, "Serial number is required"),
  firmwareVersion: z.string().min(1, "Firmware version is required"),
});

export type SurveyHardware = z.infer<typeof SurveyHardwareSchema>;

// ─── Survey: Step 3 — Network & Power ──────────────────────────────
export const SurveyNetworkSchema = z.object({
  connectionType: z.enum(["Ethernet", "Wi-Fi", "Cellular"]),
  networkSsid: z.string().optional(),
  ipAssignment: z.enum(["DHCP", "Static"]),
  staticIp: z.string().optional(),
  internetSpeed: z.string().min(1, "Internet speed is required (e.g. '50 Mbps')"),
  powerSource: z.enum(["PoE", "AC-Adapter", "UPS-Backed"]),
  upsAvailable: z.boolean(),
});

export type SurveyNetwork = z.infer<typeof SurveyNetworkSchema>;

// ─── Survey: Step 4 — Camera Placement ─────────────────────────────
export const SurveyCameraPlacementSchema = z.object({
  cameraId: z.string().uuid(),
  cameraName: z.string().min(1, "Camera name is required"),
  mountHeight: z.number().min(1, "Mount height must be at least 1 ft").max(30, "Mount height cannot exceed 30 ft"),
  angle: z.enum(["Overhead", "Side-View", "Angled-Down"]),
  fieldOfView: z.enum(["Narrow", "Standard", "Wide"]),
  poiCount: z.number().int().min(0),
  notes: z.string().optional(),
});

export type SurveyCameraPlacement = z.infer<typeof SurveyCameraPlacementSchema>;

export const SurveyCameraPlacementsSchema = z.array(SurveyCameraPlacementSchema)
  .min(1, "At least one camera placement is required");

// ─── Survey: Full Site Survey (Composite) ───────────────────────────
export const SiteSurveySchema = z.object({
  id: z.string().uuid(),
  installerId: z.string().min(5),
  status: z.enum(["draft", "submitted", "approved", "rejected"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  submittedAt: z.string().datetime().optional(),
  storeInfo: SurveyStoreInfoSchema,
  hardware: SurveyHardwareSchema,
  network: SurveyNetworkSchema,
  camerasPlacements: SurveyCameraPlacementsSchema,
});

export type SiteSurvey = z.infer<typeof SiteSurveySchema>;
