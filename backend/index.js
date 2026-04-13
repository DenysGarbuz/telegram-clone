const env = require("./config/env");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

require("./setup/server")(app);
require("./setup/db")();
require("./setup/socket")(server);

server.listen(env.port, () => {
  console.log(`server started on port ${env.port}`);
});
