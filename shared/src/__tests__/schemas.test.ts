import { describe, it, expect } from "vitest";
import {
  LoginCredentialsSchema,
  AuthTokenSchema,
  CameraSchema,
  CameraListSchema,
  PointOfInterestSchema,
  ImageCaptureSchema,
  ApiErrorSchema,
} from "../schemas";

describe("LoginCredentialsSchema", () => {
  it("S-1: valid LoginCredentials passes", () => {
    const result = LoginCredentialsSchema.safeParse({
      installerId: "INST-12345",
      password: "VisionAI-Install-2026",
    });
    expect(result.success).toBe(true);
  });

  it("S-2: short installerId rejects", () => {
    const result = LoginCredentialsSchema.safeParse({
      installerId: "ABC",
      password: "pass",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain("at least 5");
    }
  });

  it("S-3: empty password rejects", () => {
    const result = LoginCredentialsSchema.safeParse({
      installerId: "INST-12345",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("AuthTokenSchema", () => {
  it("S-4: valid AuthToken passes", () => {
    const result = AuthTokenSchema.safeParse({
      token: "abc123token",
      installerId: "INST-12345",
      deviceId: "device-001",
      expiresAt: "2026-12-31T23:59:59Z",
    });
    expect(result.success).toBe(true);
  });
});

describe("CameraSchema", () => {
  const validCamera = {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Front Door Camera",
    slot: 1,
    status: "online" as const,
    streamUrl: "http://localhost:8080/stream/1",
  };

  it("S-5: valid Camera passes", () => {
    const result = CameraSchema.safeParse(validCamera);
    expect(result.success).toBe(true);
  });

  it("S-6: camera with invalid UUID rejects", () => {
    const result = CameraSchema.safeParse({ ...validCamera, id: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("S-7: camera slot 0 rejects", () => {
    const result = CameraSchema.safeParse({ ...validCamera, slot: 0 });
    expect(result.success).toBe(false);
  });

  it("S-8: camera slot 17 rejects", () => {
    const result = CameraSchema.safeParse({ ...validCamera, slot: 17 });
    expect(result.success).toBe(false);
  });

  it("S-16: camera with empty name rejects", () => {
    const result = CameraSchema.safeParse({ ...validCamera, name: "" });
    expect(result.success).toBe(false);
  });

  it("S-17: CameraListSchema validates array", () => {
    const result = CameraListSchema.safeParse([validCamera]);
    expect(result.success).toBe(true);
  });
});

describe("PointOfInterestSchema", () => {
  const validPoi = {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    cameraId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    x: 0.5,
    y: 0.5,
    timestamp: "2026-03-24T12:00:00Z",
    location: { lat: 33.749, lng: -84.388 },
  };

  it("S-9: valid POI passes", () => {
    const result = PointOfInterestSchema.safeParse(validPoi);
    expect(result.success).toBe(true);
  });

  it("S-10: POI x out of range rejects", () => {
    const result = PointOfInterestSchema.safeParse({ ...validPoi, x: 1.5 });
    expect(result.success).toBe(false);
  });

  it("S-11: POI negative x rejects", () => {
    const result = PointOfInterestSchema.safeParse({ ...validPoi, x: -0.1 });
    expect(result.success).toBe(false);
  });

  it("S-12: POI lat out of range rejects", () => {
    const result = PointOfInterestSchema.safeParse({
      ...validPoi,
      location: { lat: 91, lng: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("S-13: POI invalid UUID rejects", () => {
    const result = PointOfInterestSchema.safeParse({ ...validPoi, id: "bad" });
    expect(result.success).toBe(false);
  });
});

describe("ImageCaptureSchema", () => {
  it("S-14: valid ImageCapture passes", () => {
    const result = ImageCaptureSchema.safeParse({
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      cameraId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      timestamp: "2026-03-24T12:00:00Z",
      dataUrl: "data:image/png;base64,abc123",
      poiIds: ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"],
    });
    expect(result.success).toBe(true);
  });
});

describe("ApiErrorSchema", () => {
  it("S-15: valid ApiError passes", () => {
    const result = ApiErrorSchema.safeParse({
      error: "VALIDATION_ERROR",
      message: "Something went wrong",
      statusCode: 400,
    });
    expect(result.success).toBe(true);
  });
});
