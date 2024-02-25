const express = require("express");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const router = express.Router();

router.post("/", async (req, res) => {
  const error = await validate(req.body);

  if (error) {
    return res.status(401).json({ error: error.errors });
  }

  let user = await User.findOne({ email: req.body.email });

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
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: config.get("isSecure"),
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: config.get("isSecure"),
    })
    .sendStatus(200);
});

router.get("/refresh", async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.get("jwtPrivateKey"));

    const user = await User.findOne(
      { refreshId: decoded.refreshId },
      "-password"
    );

    if (!user) {
      return res.status(401).json({ error: "User does not exits" });
    }

    const accessToken = user.generateAccessToken();

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.get("isSecure"),
        sameSite: "None",
      })
      .json({ accessToken });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token has expired" });
    } else {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  }
});

module.exports = router;
