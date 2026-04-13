const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  // Mongoose CastError (bad ObjectId) → 400
  if (err && err.name === "CastError") {
    return res.status(400).json({
      error: { code: "INVALID_ID", message: `Invalid ${err.path}` },
    });
  }

  logger.error({ err, path: req.path, method: req.method }, "unhandled error");
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Internal server error" },
  });
}

// Wraps an async route handler so thrown errors / rejected promises
// propagate to the error middleware without repetitive try/catch.
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = { errorHandler, asyncHandler };
