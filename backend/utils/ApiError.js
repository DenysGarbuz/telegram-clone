/**
 * Thrown by route handlers to produce a standard error response.
 * The errorHandler middleware converts it to `{ error: { message, code, details? } }`.
 */
class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message || code);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(code, message, details) {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(code = "UNAUTHORIZED", message) {
    return new ApiError(401, code, message);
  }

  static forbidden(code = "FORBIDDEN", message) {
    return new ApiError(403, code, message);
  }

  static notFound(code, message) {
    return new ApiError(404, code, message);
  }

  static conflict(code, message) {
    return new ApiError(409, code, message);
  }
}

module.exports = ApiError;
