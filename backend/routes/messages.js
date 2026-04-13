const express = require("express");

const auth = require("../middleware/auth");
const { validateObjectIds } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");
const ApiError = require("../utils/ApiError");

const { User } = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

const router = express.Router();

const MESSAGES_AMOUNT = 22;

router.get(
  "/:chatId",
  [auth, validateObjectIds(["chatId"])],
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { chatId } = req.params;
    const cursor = parseInt(req.query.cursor, 10) || 0;

    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("USER_NOT_FOUND", "User does not exist");

    const chat = await Chat.findById(chatId).populate("members");
    if (!chat) throw ApiError.notFound("CHAT_NOT_FOUND", "Chat does not exist");

    if (chat.access === "private" && userId !== chat.userId.toString()) {
      const isMember = chat.members.find(
        (m) => m.userId.toString() === userId.toString()
      );
      if (!isMember)
        throw ApiError.forbidden("NOT_MEMBER", "User is not a member of chat");
    }

    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .skip(cursor * MESSAGES_AMOUNT)
      .limit(MESSAGES_AMOUNT)
      .populate({
        path: "member",
        select: "_id userId",
        populate: { path: "userId", select: "imageUrl email name" },
      })
      .populate({
        path: "messageReplyTo",
        populate: {
          path: "member",
          select: "_id userId",
          populate: { path: "userId", select: "imageUrl email name" },
        },
      });

    const nextCursor = messages.length === MESSAGES_AMOUNT ? cursor + 1 : null;

    return res.json({ messages, nextCursor });
  })
);

module.exports = router;
