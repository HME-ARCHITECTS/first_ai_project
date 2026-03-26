import { describe, it, expect } from "vitest";
import {
  SurveyStoreInfoSchema,
  SurveyHardwareSchema,
  SurveyNetworkSchema,
  SurveyCameraPlacementSchema,
  SurveyCameraPlacementsSchema,
  SiteSurveySchema,
} from "../schemas";

const validStoreInfo = {
  storeId: "AB-123",
  storeName: "Main St Drive-Thru",
  storeAddress: "123 Main St, City, ST 00000",
  storeType: "Drive-Thru" as const,
  contactName: "John Smith",
  contactPhone: "+1 555-123-4567",
};

const validHardware = {
  cameraCount: 4,
  cameraModel: "VisionAI Cam Pro",
  mountType: "Ceiling" as const,
  processingUnitModel: "VisionAI Edge 200",
  processingUnitSerial: "SN-12345-ABCDE",
  firmwareVersion: "v2.4.1",
};

const validNetwork = {
  connectionType: "Ethernet" as const,
  ipAssignment: "DHCP" as const,
  internetSpeed: "50 Mbps",
  powerSource: "PoE" as const,
  upsAvailable: true,
};

const validCameraPlacement = {
  cameraId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  cameraName: "Front Camera",
  mountHeight: 10,
  angle: "Overhead" as const,
  fieldOfView: "Wide" as const,
  poiCount: 3,
  notes: "Above order board",
};

const validSiteSurvey = {
  id: "b1c2d3e4-f5a6-7890-bcde-fa1234567890",
  installerId: "INST-12345",
  status: "draft" as const,
  createdAt: "2026-03-25T10:00:00Z",
  updatedAt: "2026-03-25T10:00:00Z",
  storeInfo: validStoreInfo,
  hardware: validHardware,
  network: validNetwork,
  camerasPlacements: [validCameraPlacement],
};

describe("Survey Schemas", () => {
  // ── Store Info ──────────────────────────────────────────────────
  it("SS-1: valid SurveyStoreInfo passes", () => {
    const result = SurveyStoreInfoSchema.safeParse(validStoreInfo);
    expect(result.success).toBe(true);
  });

  it("SS-2: invalid storeId pattern rejects", () => {
    const result = SurveyStoreInfoSchema.safeParse({ ...validStoreInfo, storeId: "abc" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("pattern AA-000");
    }
  });

  it("SS-3: empty storeName rejects", () => {
    const result = SurveyStoreInfoSchema.safeParse({ ...validStoreInfo, storeName: "a" });
    expect(result.success).toBe(false);
  });

  it("SS-4: invalid contactPhone rejects", () => {
    const result = SurveyStoreInfoSchema.safeParse({ ...validStoreInfo, contactPhone: "abc" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("phone number");
    }
  });

  // ── Hardware ────────────────────────────────────────────────────
  it("SS-5: valid SurveyHardware passes", () => {
    const result = SurveyHardwareSchema.safeParse(validHardware);
    expect(result.success).toBe(true);
  });

  it("SS-6: camera count 0 rejects", () => {
    const result = SurveyHardwareSchema.safeParse({ ...validHardware, cameraCount: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("At least 1");
    }
  });

  it("SS-7: camera count 17 rejects", () => {
    const result = SurveyHardwareSchema.safeParse({ ...validHardware, cameraCount: 17 });
    expect(result.success).toBe(false);
  });

  it("SS-8: empty processingUnitSerial rejects", () => {
    const result = SurveyHardwareSchema.safeParse({ ...validHardware, processingUnitSerial: "abc" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Serial number");
    }
  });

  // ── Network ─────────────────────────────────────────────────────
  it("SS-9: valid SurveyNetwork passes", () => {
    const result = SurveyNetworkSchema.safeParse(validNetwork);
    expect(result.success).toBe(true);
  });

  it("SS-10: empty internetSpeed rejects", () => {
    const result = SurveyNetworkSchema.safeParse({ ...validNetwork, internetSpeed: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Internet speed");
    }
  });

  // ── Camera Placement ────────────────────────────────────────────
  it("SS-11: valid SurveyCameraPlacement passes", () => {
    const result = SurveyCameraPlacementSchema.safeParse(validCameraPlacement);
    expect(result.success).toBe(true);
  });

  it("SS-12: mount height 0 rejects", () => {
    const result = SurveyCameraPlacementSchema.safeParse({ ...validCameraPlacement, mountHeight: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least 1 ft");
    }
  });

  it("SS-13: mount height 31 rejects", () => {
    const result = SurveyCameraPlacementSchema.safeParse({ ...validCameraPlacement, mountHeight: 31 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("exceed 30 ft");
    }
  });

  it("SS-14: empty camerasPlacements array rejects", () => {
    const result = SurveyCameraPlacementsSchema.safeParse([]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("At least one camera placement");
    }
  });

  // ── Full Site Survey ────────────────────────────────────────────
  it("SS-15: valid full SiteSurvey passes", () => {
    const result = SiteSurveySchema.safeParse(validSiteSurvey);
    expect(result.success).toBe(true);
  });

  it("SS-16: SiteSurvey missing storeInfo rejects", () => {
    const { storeInfo: _, ...noStore } = validSiteSurvey;
    const result = SiteSurveySchema.safeParse(noStore);
    expect(result.success).toBe(false);
  });
});
