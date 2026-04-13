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

async function registerAndGetToken() {
  const creds = { email: "bob@example.com", password: "secretpass1" };
  const res = await request(app).post("/api/users").send(creds);
  const cookies = res.headers["set-cookie"] || [];
  const accessCookie = cookies.find((c) => c.startsWith("accessToken="));
  const token = accessCookie.split(";")[0].split("=")[1];
  return token;
}

describe("chats", () => {
  it("rejects creation without a valid body", async () => {
    const token = await registerAndGetToken();
    const res = await request(app)
      .post("/api/chats")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("creates and lists a chat", async () => {
    const token = await registerAndGetToken();

    const create = await request(app)
      .post("/api/chats")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "general")
      .field("type", "GROUP");
    expect(create.status).toBe(200);
    expect(create.body.name).toBe("general");
    expect(create.body.type).toBe("GROUP");

    const list = await request(app)
      .get("/api/chats")
      .set("Authorization", `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].name).toBe("general");
  });

  it("rejects anonymous access", async () => {
    const res = await request(app).get("/api/chats");
    expect(res.status).toBe(401);
  });

  it("returns 400 for a malformed :id", async () => {
    const token = await registerAndGetToken();
    const res = await request(app)
      .get("/api/chats/not-an-id")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_ID");
  });
});
