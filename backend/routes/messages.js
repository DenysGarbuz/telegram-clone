const express = require("express");

const auth = require("../middleware/auth");
const validateId = require("../utils/validateId");
const { User } = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Member = require("../models/Member");
const router = express.Router();

const MESSAGES_AMOUNT = 22;

router.get("/:chatId", [auth], async (req, res) => {
  const userId = req.user._id;
  const chatId = req.params.chatId;
  const cursor = req.query.cursor;

  console.log(cursor);

  const error = validateId("chatId", chatId);
  if (error) {
    return res.status(400).json(error);
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "USER does not exists" });
  }

  const chat = await Chat.findById(chatId).populate("members");
  if (!chat) {
    return res.status(404).json({ error: "CHAT does not exists" });
  }

  if (chat.access === "private") {
    if (userId !== chat.userId.toString()) {
      const isMember = chat.members.find(
        (member) => member.userId.toString() === userId.toString()
      );

      if (!isMember) {
        return res.status(400).json({ error: "USER is not an MEMBER of CHAT" });
      }
    }
  }

  const messages = await Message.find({ chatId })
    .sort({ createdAt: -1 })
    .skip(cursor * MESSAGES_AMOUNT)
    .limit(MESSAGES_AMOUNT)
    .populate({
      path: "member",
      select: "_id userId",
      populate: {
        path: "userId",
        select: "imageUrl email name",
      },
    })
    .populate({
      path: "messageReplyTo",
      populate: {
        path: "member",
        select: "_id userId",
        populate: {
          path: "userId",
          select: "imageUrl email name",
        },
      },
    });

  let nextCursor = null;

  if (messages.length === MESSAGES_AMOUNT) {
    nextCursor = parseInt(cursor) + 1;
  }

  return res.json({ messages, nextCursor });
});


module.exports = router;
