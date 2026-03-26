import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../app";
import { validTokens } from "../../middleware/authMiddleware";
import { surveyStore } from "../surveys";

const TEST_TOKEN = "test-survey-token-abc";
const AUTH = `Bearer ${TEST_TOKEN}`;

const validSurvey = {
  id: "c1d2e3f4-a5b6-7890-cdef-ab1234567890",
  installerId: "INST-12345",
  status: "draft",
  createdAt: "2026-03-25T10:00:00Z",
  updatedAt: "2026-03-25T10:00:00Z",
  storeInfo: {
    storeId: "AB-123",
    storeName: "Main St Drive-Thru",
    storeAddress: "123 Main St, City, ST 00000",
    storeType: "Drive-Thru",
    contactName: "John Smith",
    contactPhone: "+1 555-123-4567",
  },
  hardware: {
    cameraCount: 4,
    cameraModel: "VisionAI Cam Pro",
    mountType: "Ceiling",
    processingUnitModel: "VisionAI Edge 200",
    processingUnitSerial: "SN-12345-ABCDE",
    firmwareVersion: "v2.4.1",
  },
  network: {
    connectionType: "Ethernet",
    ipAssignment: "DHCP",
    internetSpeed: "50 Mbps",
    powerSource: "PoE",
    upsAvailable: true,
  },
  camerasPlacements: [
    {
      cameraId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      cameraName: "Front Camera",
      mountHeight: 10,
      angle: "Overhead",
      fieldOfView: "Wide",
      poiCount: 3,
      notes: "Above order board",
    },
  ],
};

beforeAll(() => {
  validTokens.set(TEST_TOKEN, {
    installerId: "INST-12345",
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  });
});

beforeEach(() => {
  surveyStore.clear();
});

describe("Survey API Routes", () => {
  it("SA-1: submit valid survey returns 201", async () => {
    const res = await request(app)
      .post("/api/surveys")
      .set("Authorization", AUTH)
      .send(validSurvey);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("submitted");
    expect(res.body.submittedAt).toBeDefined();
  });

  it("SA-2: submit incomplete survey returns 400 with fieldErrors", async () => {
    const { storeInfo: _, ...incomplete } = validSurvey;
    const res = await request(app)
      .post("/api/surveys")
      .set("Authorization", AUTH)
      .send(incomplete);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("VALIDATION_ERROR");
    expect(res.body.fieldErrors).toBeDefined();
    expect(Array.isArray(res.body.fieldErrors)).toBe(true);
  });

  it("SA-3: submit without auth returns 401", async () => {
    const res = await request(app)
      .post("/api/surveys")
      .send(validSurvey);

    expect(res.status).toBe(401);
  });

  it("SA-4: save draft returns 200", async () => {
    const res = await request(app)
      .put(`/api/surveys/${validSurvey.id}`)
      .set("Authorization", AUTH)
      .send({ storeInfo: validSurvey.storeInfo });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("draft");
    expect(res.body.id).toBe(validSurvey.id);
  });

  it("SA-5: get survey by ID returns 200", async () => {
    // First create it
    await request(app)
      .post("/api/surveys")
      .set("Authorization", AUTH)
      .send(validSurvey);

    const res = await request(app)
      .get(`/api/surveys/${validSurvey.id}`)
      .set("Authorization", AUTH);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(validSurvey.id);
  });

  it("SA-6: get nonexistent survey returns 404", async () => {
    const res = await request(app)
      .get("/api/surveys/00000000-0000-0000-0000-000000000000")
      .set("Authorization", AUTH);

    expect(res.status).toBe(404);
  });

  it("SA-7: list surveys returns array", async () => {
    await request(app)
      .post("/api/surveys")
      .set("Authorization", AUTH)
      .send(validSurvey);

    const res = await request(app)
      .get("/api/surveys")
      .set("Authorization", AUTH);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});
