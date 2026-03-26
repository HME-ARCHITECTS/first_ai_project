import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../app";

describe("GET /api/cameras", () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ installerId: "INST-12345", password: "VisionAI-Install-2026" });
    token = res.body.token;
  });

  it("C-1: returns camera array with valid token", async () => {
    const res = await request(app)
      .get("/api/cameras")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("C-2: rejects without auth", async () => {
    const res = await request(app).get("/api/cameras");
    expect(res.status).toBe(401);
  });

  it("C-3: refresh returns fresh camera list", async () => {
    const res = await request(app)
      .post("/api/cameras/refresh")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("C-4: refresh rejects without auth", async () => {
    const res = await request(app).post("/api/cameras/refresh");
    expect(res.status).toBe(401);
  });
});
