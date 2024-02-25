module.exports = function server(app) {
  const config = require("config");
  const cors = require("cors");
  const express = require("express");
  const cookieParser = require("cookie-parser");
  const morgan = require("morgan");

  if (!config.has("jwtPrivateKey")) {
    console.error("jwt private key is missing");
    process.exit(1);
  }

  if (!config.has("frontendUrl")) {
    console.error("frontend url is missing");
    process.exit(1);
  }

  const usersRouter = require("../routes/users");
  const authRouter = require("../routes/auth");
  const chatsRouter = require("../routes/chats");
  const folderRouter = require("../routes/folders");
  const messagesRouter = require("../routes/messages");
  const membersRouter = require("../routes/members");
  const credentials = require("../middleware/credentials");

  const corsOptions = {
    origin: config.get("frontendUrl"),
    credentials: true,
  };

  app.use(morgan("tiny"));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());

  app.use("/api/users", usersRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/groups", folderRouter);
  app.use("/api/chats", chatsRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/members", membersRouter);
};
