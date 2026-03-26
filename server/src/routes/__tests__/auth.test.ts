import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../app";

describe("POST /api/auth/login", () => {
  it("A-1: login with valid credentials returns token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ installerId: "INST-12345", password: "VisionAI-Install-2026" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("installerId", "INST-12345");
    expect(res.body).toHaveProperty("deviceId");
    expect(res.body).toHaveProperty("expiresAt");
  });

  it("A-2: login rejects invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ installerId: "INST-12345", password: "wrong-password" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("UNAUTHORIZED");
  });

  it("A-3: login rejects short installerId", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ installerId: "ABC", password: "VisionAI-Install-2026" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("VALIDATION_ERROR");
  });

  it("A-4: login rejects missing password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ installerId: "INST-12345" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/cameras", () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ installerId: "INST-12345", password: "VisionAI-Install-2026" });
    token = res.body.token;
  });

  it("A-5: returns array with valid token", async () => {
    const res = await request(app)
      .get("/api/cameras")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("A-6: rejects without token", async () => {
    const res = await request(app).get("/api/cameras");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("UNAUTHORIZED");
  });

  it("A-7: rejects with invalid token", async () => {
    const res = await request(app)
      .get("/api/cameras")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
  });
});
