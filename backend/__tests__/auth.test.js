const request = require("supertest");
const { startMongo, stopMongo, clearDb } = require("./setup/mongo");
const { buildApp } = require("./setup/app");

let app;

beforeAll(async () => {
  await startMongo();
  ({ app } = buildApp());
});

afterAll(async () => {
  await stopMongo();
});

afterEach(async () => {
  await clearDb();
});

describe("auth flow", () => {
  const creds = { email: "alice@example.com", password: "secretpass1" };

  async function register() {
    return request(app).post("/api/users").send(creds);
  }

  async function login() {
    return request(app).post("/api/auth").send(creds);
  }

  it("registers a new user and sets auth cookies", async () => {
    const res = await register();
    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.join(";")).toMatch(/accessToken=/);
    expect(cookies.join(";")).toMatch(/refreshToken=/);
  });

  it("rejects registration for an existing email", async () => {
    await register();
    const res = await register();
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("User already exists");
  });

  it("rejects invalid registration payload", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "bad", password: "x" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("logs in with correct credentials", async () => {
    await register();
    const res = await login();
    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.join(";")).toMatch(/accessToken=/);
  });

  it("rejects login with wrong password", async () => {
    await register();
    const res = await request(app)
      .post("/api/auth")
      .send({ email: creds.email, password: "wrongpassword" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Password is not valid");
  });

  it("refreshes an access token given a valid refresh cookie", async () => {
    const reg = await register();
    const refreshCookie = (reg.headers["set-cookie"] || []).find((c) =>
      c.startsWith("refreshToken=")
    );
    expect(refreshCookie).toBeTruthy();

    const res = await request(app)
      .get("/api/auth/refresh")
      .set("Cookie", refreshCookie);
    expect(res.status).toBe(200);
    expect(typeof res.body.accessToken).toBe("string");
  });
});
