const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");

const { User, validate } = require("../models/User");
const credentials = require("../middleware/credentials");
const config = require("config");

router.get("/", [auth], async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId, "-password -refreshId");

  if (!user) {
    res.status(400).json({ error: "User not exists" });
  }
  res.json(user);
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
  } catch (error) {
    res.status(500).send("Internal server error");
    console.log(error);
  }
});

module.exports = router;
