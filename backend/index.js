const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

require("./setup/server")(app);
require("./setup/db")();
require("./setup/socket")(server);

server.listen(3003, () => {
  console.log("server started ");
});
