const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

/**
 * Validate that the named params are valid Mongo ObjectIds.
 * Usage: router.get("/:chatId", validateObjectIds(["chatId"]), handler)
 */
function validateObjectIds(paramNames, source = "params") {
  return (req, res, next) => {
    for (const name of paramNames) {
      const value = req[source] && req[source][name];
      if (!value) {
        return next(
          ApiError.badRequest("MISSING_ID", `${name} is missing`, { field: name })
        );
      }
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return next(
          ApiError.badRequest("INVALID_ID", `Invalid ${name}`, { field: name })
        );
      }
    }
    return next();
  };
}

/**
 * Validate the request body against a Yup schema.
 */
function validateBody(schema) {
  return async (req, res, next) => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return next();
    } catch (err) {
      return next(
        ApiError.badRequest("VALIDATION_ERROR", err.message, {
          errors: err.errors,
        })
      );
    }
  };
}

module.exports = { validateObjectIds, validateBody };
