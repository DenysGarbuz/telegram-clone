const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const { User, validate } = require("../models/User");
const { authCookieOptions } = require("../utils/cookies");
const logger = require("../utils/logger");

router.get("/", [auth], async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId, "-password -refreshId");

  if (!user) {
    return res.status(400).json({ error: "User not exists" });
  }
  return res.json(user);
});

router.post("/", async (req, res) => {
  try {
    const error = await validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const isUserExist = await User.findOne({ email: req.body.email });
    if (isUserExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      email: req.body.email,
      password,
    });

    await user.save();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return res
      .cookie("accessToken", accessToken, authCookieOptions)
      .cookie("refreshToken", refreshToken, authCookieOptions)
      .sendStatus(200);
  } catch (error) {
    logger.error({ err: error }, "user registration failed");
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
