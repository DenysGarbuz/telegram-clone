module.exports = function () {
  const mongoose = require("mongoose");
  const env = require("../config/env");
  const logger = require("../utils/logger");

  mongoose
    .connect(env.mongodbUrl)
    .then(() => logger.info("mongodb connected"))
    .catch((err) => {
      logger.error({ err }, "mongodb connection failed");
      process.exit(1);
    });
};
