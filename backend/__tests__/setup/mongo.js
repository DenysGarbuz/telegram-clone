const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

async function startMongo() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}

async function stopMongo() {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}

async function clearDb() {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((c) => c.deleteMany({}))
  );
}

module.exports = { startMongo, stopMongo, clearDb };
