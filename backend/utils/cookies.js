const env = require("../config/env");

/**
 * Shared cookie options for auth cookies. `SameSite=None` + `Secure`
 * lets the browser send the cookie on cross-site XHR from the frontend
 * origin; in local dev over http we set secure=false so the cookie is
 * still stored.
 */
const authCookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: env.cookieSecure,
};

module.exports = { authCookieOptions };
