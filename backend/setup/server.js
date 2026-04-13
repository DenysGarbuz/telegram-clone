module.exports = function server(app) {
  const cors = require("cors");
  const express = require("express");
  const cookieParser = require("cookie-parser");
  const morgan = require("morgan");
  const helmet = require("helmet");
  const rateLimit = require("express-rate-limit");
  const env = require("../config/env");
  const logger = require("../utils/logger");

  const usersRouter = require("../routes/users");
  const authRouter = require("../routes/auth");
  const chatsRouter = require("../routes/chats");
  const folderRouter = require("../routes/folders");
  const messagesRouter = require("../routes/messages");
  const membersRouter = require("../routes/members");
  const { errorHandler } = require("../middleware/errorHandler");

  // FRONTEND_URL may be a comma-separated list of allowed origins.
  const allowedOrigins = env.frontendUrl
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const corsOptions = {
    origin(origin, cb) {
      // Non-browser clients (curl, Socket.IO server-side) have no origin.
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      logger.warn({ origin }, "blocked CORS request from unlisted origin");
      return cb(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  };

  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: { code: "RATE_LIMITED", message: "Too many requests" },
    },
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: { code: "RATE_LIMITED", message: "Too many auth attempts" },
    },
  });

  app.use(helmet());
  app.use(morgan("tiny"));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use("/api", globalLimiter);

  app.get("/api/health", (req, res) => res.json({ ok: true }));

  app.use("/api/users", authLimiter, usersRouter);
  app.use("/api/auth", authLimiter, authRouter);
  app.use("/api/groups", folderRouter);
  app.use("/api/chats", chatsRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/members", membersRouter);

  // 404 for unmatched /api/* requests
  app.use("/api", (req, res) => {
    res
      .status(404)
      .json({ error: { code: "NOT_FOUND", message: "Route not found" } });
  });

  app.use(errorHandler);
};
