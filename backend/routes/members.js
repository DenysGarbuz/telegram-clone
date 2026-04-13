const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const Member = require("../models/Member");
const Rights = require("../rights");
const Chat = require("../models/Chat");
const ApiError = require("../utils/ApiError");
const { asyncHandler } = require("../middleware/errorHandler");

router.post(
  "/rights/delete",
  [auth],
  asyncHandler(async (req, res) => {
    const { memberId, chatId } = req.query;
    const userId = req.user._id;

    if (!chatId) throw ApiError.badRequest("MISSING_CHAT_ID", "chatId missing");
    if (!memberId)
      throw ApiError.badRequest("MISSING_MEMBER_ID", "memberId missing");

    const member = await Member.findOne({ chatId, _id: memberId });
    if (!member) throw ApiError.notFound("MEMBER_NOT_FOUND", "Member does not exist");

    const chat = await Chat.findById(chatId);
    if (!chat) throw ApiError.notFound("CHAT_NOT_FOUND", "Chat does not exist");

    const admin = await Member.findOne({ userId, chatId });
    const isOwner = admin.userId.toString() === chat.userId.toString();
    if (!isOwner && (!admin.isAdmin || !admin.rights.canAddNewAdmins)) {
      throw ApiError.forbidden("FORBIDDEN", "You don't have permissions");
    }

    if (member.userId.toString() === chat.userId.toString()) {
      throw ApiError.badRequest("OWNER_IMMUTABLE", "Cannot manipulate chat owner");
    }

    if (member._id.toString() === admin._id.toString()) {
      throw ApiError.badRequest("SELF_IMMUTABLE", "Cannot change rights for yourself");
    }

    member.isAdmin = false;
    member.rights = Rights;
    await member.save();

    return res.sendStatus(200);
  })
);

router.post(
  "/rights",
  [auth],
  asyncHandler(async (req, res) => {
    const { memberId, chatId } = req.query;
    const rights = req.body;
    const userId = req.user._id;

    if (!rights) throw ApiError.badRequest("MISSING_RIGHTS", "Rights missing");
    if (!chatId) throw ApiError.badRequest("MISSING_CHAT_ID", "chatId missing");
    if (!memberId)
      throw ApiError.badRequest("MISSING_MEMBER_ID", "memberId missing");

    const member = await Member.findOne({ chatId, _id: memberId });
    if (!member) throw ApiError.notFound("MEMBER_NOT_FOUND", "Member does not exist");

    const chat = await Chat.findById(chatId);
    if (!chat) throw ApiError.notFound("CHAT_NOT_FOUND", "Chat does not exist");

    const admin = await Member.findOne({ userId, chatId });
    const isOwner = admin.userId.toString() === chat.userId.toString();
    if (!isOwner && (!admin.isAdmin || !admin.rights.canAddNewAdmins)) {
      throw ApiError.forbidden("FORBIDDEN", "You don't have permissions");
    }

    if (member.userId.toString() === chat.userId.toString()) {
      throw ApiError.badRequest("OWNER_IMMUTABLE", "Cannot manipulate chat owner");
    }

    if (member._id.toString() === admin._id.toString()) {
      throw ApiError.badRequest("SELF_IMMUTABLE", "Cannot change rights for yourself");
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

    if (!member.isAdmin) member.isAdmin = true;
    member.rights = newRights;
    await member.save();

    return res.sendStatus(200);
  })
);

module.exports = router;
