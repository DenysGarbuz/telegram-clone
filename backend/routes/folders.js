const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const Channel = require("../models/Chat");
const Folder = require("../models/Folder");
const { User } = require("../models/User");
const Member = require("../models/Member");
const validateId = require("../utils/validateId");

router.get("/", [auth], async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "USER does not exists" });
  }

  const folders =await  Folder.find({ userId });

  return res.json(folders);
});

router.post("/", [auth], async (req, res) => {
  const userId = req.user._id;
  const channels = req.body.channels;
  const name = req.body.name;

  const error = validateId("CHANNEL", channels);
  if (error) {
    return res.status(400).json(error);
  }

  if (!name) {
    return res.status(400).json({ error: "Channel NAME is missing" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "USER does not exists" });
  }

  const isFolderExists = await Folder.findOne({ name });
  if (isFolderExists) {
    return res.status(400).json({ error: "FOLDER already exists" });
  }

  const folder = new Folder({
    userId,
    name,
    channels,
  });

  user.folders.push(folder._id);

  await folder.save();
  await user.save();

  return res.json(folder);
});

//remove
router.patch("/", [auth], async (req, res) => {
  const userId = req.user._id;
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: "Channel NAME is missing" });
  }

  const user = await User.findById(userId).populate("folders");
  if (!user) {
    return res.status(404).json({ error: "USER does not exists" });
  }

  const folder = user.folders.find((folder) => folder.name === name);

  if (!folder) {
    return res.status(404).json({ error: "FOLDER not found" });
  }

  await Folder.findByIdAndRemove(folder._id);

  return res.json(folder);
});

router.delete("/", [auth], async (req, res) => {
  const userId = req.user._id;
  const name = req.body.name;

  if (!name) {
    return res.status(400).json({ error: "Channel NAME is missing" });
  }

  const user = await User.findById(userId).populate("folders");
  if (!user) {
    return res.status(404).json({ error: "USER does not exists" });
  }

  const folder = user.folders.find((folder) => folder.name === name);

  if (!folder) {
    return res.status(404).json({ error: "FOLDER not found" });
  }

  const folderIndex = user.folders.indexOf(folder);
  user.folders.splice(folderIndex, 1);

  await Folder.findByIdAndRemove(folder._id);
  await user.save();

  return res.json(folder);
});

module.exports = router;
