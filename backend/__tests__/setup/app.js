// Builds an Express app identical to production minus the DB connection
// and socket.IO (tests pull those in separately).
const express = require("express");
const http = require("http");

function buildApp() {
  const app = express();
  require("../../setup/server")(app);
  return { app, server: http.createServer(app) };
}

module.exports = { buildApp };
