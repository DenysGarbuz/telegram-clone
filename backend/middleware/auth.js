const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //onsole.log(req.headers);
  const bearerToken = req.headers["authorization"];
  //console.log(req.headers)
  if (!bearerToken || !bearerToken.startsWith("Bearer")) {
    return res.status(401).json({ error: "Bearer token is missing" });
  }
  //console.log("2")
  const accessToken = bearerToken.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ error: "Jwt token is missing" });
  }
  //console.log("3")
  try {
    const decoded = jwt.verify(accessToken, config.get("jwtPrivateKey"));
    // console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    // console.log("4")
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token has expired" });
    } else {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  }
};
