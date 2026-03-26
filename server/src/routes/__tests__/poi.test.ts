import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../app";

describe("POI Routes", () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ installerId: "INST-12345", password: "VisionAI-Install-2026" });
    token = res.body.token;
  });

  const validPoi = {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    cameraId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    x: 0.5,
    y: 0.5,
    timestamp: "2026-03-24T12:00:00Z",
    location: { lat: 33.749, lng: -84.388 },
  };

  it("P-1: POST valid POI returns 201", async () => {
    const res = await request(app)
      .post("/api/pois")
      .set("Authorization", `Bearer ${token}`)
      .send(validPoi);

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(validPoi.id);
  });

  it("P-2: POST invalid POI returns 400", async () => {
    const res = await request(app)
      .post("/api/pois")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validPoi, x: 2.0 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("VALIDATION_ERROR");
  });

  it("P-3: POST without auth returns 401", async () => {
    const res = await request(app).post("/api/pois").send(validPoi);

    expect(res.status).toBe(401);
  });

  it("P-4: GET returns POI array", async () => {
    const res = await request(app)
      .get("/api/pois")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("P-5: GET without auth returns 401", async () => {
    const res = await request(app).get("/api/pois");

    expect(res.status).toBe(401);
  });

  it("P-6: POST POI missing cameraId returns 400", async () => {
    const { cameraId: _, ...noCameraId } = validPoi;
    const res = await request(app)
      .post("/api/pois")
      .set("Authorization", `Bearer ${token}`)
      .send(noCameraId);

    expect(res.status).toBe(400);
  });

  it("P-7: POST POI with invalid UUID returns 400", async () => {
    const res = await request(app)
      .post("/api/pois")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validPoi, id: "not-valid" });

    expect(res.status).toBe(400);
  });
});
