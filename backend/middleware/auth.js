const jwt = require("jsonwebtoken");
const env = require("../config/env");

module.exports = function (req, res, next) {
  const bearerToken = req.headers["authorization"];
  if (!bearerToken || !bearerToken.startsWith("Bearer")) {
    return res.status(401).json({ error: "Bearer token is missing" });
  }

  const accessToken = bearerToken.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ error: "Jwt token is missing" });
  }

  try {
    const decoded = jwt.verify(accessToken, env.jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token has expired" });
    }
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
