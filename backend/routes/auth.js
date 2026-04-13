const express = require("express");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/User");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { authCookieOptions } = require("../utils/cookies");
const router = express.Router();

router.post("/", async (req, res) => {
  const error = await validate(req.body);

  if (error) {
    return res.status(401).json({ error: error.errors });
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res
      .status(401)
      .json({ error: "User with such email is not exists" });
  }

  const decrypted = await bcrypt.compare(req.body.password, user.password);

  if (!decrypted) {
    return res.status(401).json({ error: "Password is not valid" });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return res
    .cookie("accessToken", accessToken, authCookieOptions)
    .cookie("refreshToken", refreshToken, authCookieOptions)
    .sendStatus(200);
});

router.get("/refresh", async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, env.jwtPrivateKey);

    const user = await User.findOne(
      { refreshId: decoded.refreshId },
      "-password"
    );

    if (!user) {
      return res.status(401).json({ error: "User does not exits" });
    }

    const accessToken = user.generateAccessToken();

    return res
      .cookie("accessToken", accessToken, authCookieOptions)
      .json({ accessToken });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token has expired" });
    }
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
});

module.exports = router;
