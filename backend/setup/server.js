module.exports = function server(app) {
  const cors = require("cors");
  const express = require("express");
  const cookieParser = require("cookie-parser");
  const morgan = require("morgan");
  const env = require("../config/env");

  const usersRouter = require("../routes/users");
  const authRouter = require("../routes/auth");
  const chatsRouter = require("../routes/chats");
  const folderRouter = require("../routes/folders");
  const messagesRouter = require("../routes/messages");
  const membersRouter = require("../routes/members");

  const corsOptions = {
    origin: env.frontendUrl,
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
