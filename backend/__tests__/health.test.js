const request = require("supertest");
const { startMongo, stopMongo } = require("./setup/mongo");
const { buildApp } = require("./setup/app");

let app;

beforeAll(async () => {
  await startMongo();
  ({ app } = buildApp());
});

afterAll(async () => {
  await stopMongo();
});

describe("GET /api/health", () => {
  it("returns ok:true", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});

describe("unknown /api route", () => {
  it("returns 404 with standard error shape", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: { code: "NOT_FOUND", message: "Route not found" },
    });
  });
});
