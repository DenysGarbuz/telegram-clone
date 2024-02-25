const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const Channel = require("../models/Chat");
const { User } = require("../models/User");
const Member = require("../models/Member");
const validateId = require("../utils/validateId");
const Roles = require("../roles");
const Rights = require("../rights");
const Chat = require("../models/Chat");

router.post("/", [auth], async (req, res) => {
  const userId = req.user._id;
  const channelId = req.query.channelId;
});

router.post("/rights/delete", [auth], async (req, res) => {
  const memberId = req.query.memberId;
  const chatId = req.query.chatId;
  const userId = req.user._id;

  if (!chatId) {
    return res.status(400).json({ message: "chatId missing" });
  }
  if (!memberId) {
    return res.status(400).json({ message: "memberId missing" });
  }

  const member = await Member.findOne({ chatId, _id: memberId });
  if (!member) {
    return res.status(400).json({ message: "Member does not exists" });
  }
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(400).json({ message: "Chat does not exists" });
  }

  const admin = await Member.findOne({ userId, chatId });
  const isOwner = admin.userId.toString() === chat.userId.toString();
  if (!isOwner) {
    if (!admin.isAdmin || !admin.rights.canAddNewAdmins) {
      return res.status(400).json({ message: "You dont have premissions" });
    }
  }

  if (member.userId.toString() === chat.userId.toString()) {
    return res.status(400).json({ message: "Cant manipulate chat owner" });
  }

  if (member._id.toString() === admin._id.toString()) {
    return res
      .status(400)
      .json({ message: "Cannot change right for yourself" });
  }

  member.isAdmin = false;
  member.rights = Rights;
  console.log(member);
  await member.save();

  return res.sendStatus(200);
});

router.post("/rights", [auth], async (req, res) => {
  const memberId = req.query.memberId;
  const chatId = req.query.chatId;
  const rights = req.body;
  const userId = req.user._id;

  if (!rights) {
    return res.status(400).json({ message: "Rights missing" });
  }
  if (!chatId) {
    return res.status(400).json({ message: "chatId missing" });
  }
  if (!memberId) {
    return res.status(400).json({ message: "memberId missing" });
  }

  const member = await Member.findOne({ chatId, _id: memberId });
  if (!member) {
    return res.status(400).json({ message: "Member does not exists" });
  }
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(400).json({ message: "Chat does not exists" });
  }

  const admin = await Member.findOne({ userId, chatId });
  const isOwner = admin.userId.toString() === chat.userId.toString();
  if (!isOwner) {
    if (!admin.isAdmin || !admin.rights.canAddNewAdmins) {
      return res.status(400).json({ message: "You dont have premissions" });
    }
  }

  if (member.userId.toString() === chat.userId.toString()) {
    return res.status(400).json({ message: "Cant manipulate chat owner" });
  }

  if (member._id.toString() === admin._id.toString()) {
    return res
      .status(400)
      .json({ message: "Cannot change right for yourself" });
  }

  const oldRights = member.rights;

  const newRights = {
    canAddMembers:
      isOwner || admin.rights.canAddMembers
        ? rights.canAddMembers ?? oldRights.canAddMembers
        : oldRights.canAddMembers,
    canDeleteMessages:
      isOwner || admin.rights.canDeleteMessages
        ? rights.canDeleteMessages ?? oldRights.canDeleteMessages
        : oldRights.canDeleteMessages,
    canBanUsers:
      isOwner || admin.rights.canBanUsers
        ? rights.canBanUsers ?? oldRights.canBanUsers
        : oldRights.canBanUsers,
    canPinMessages:
      isOwner || admin.rights.canPinMessages
        ? rights.canPinMessages ?? oldRights.canPinMessages
        : oldRights.canPinMessages,
    canAddNewAdmins:
      isOwner || admin.rights.canAddNewAdmins
        ? rights.canAddNewAdmins ?? oldRights.canAddNewAdmins
        : oldRights.canAddNewAdmins,
  };
  console.log(rights);
  if (!member.isAdmin) {
    member.isAdmin = true;
  }
  member.rights = newRights;
  await member.save();

  return res.sendStatus(200);
});

module.exports = router;
