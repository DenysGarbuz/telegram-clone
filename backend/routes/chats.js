const express = require("express");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { object, string } = require("yup");

const auth = require("../middleware/auth");
const { validateObjectIds, validateBody } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/errorHandler");
const ApiError = require("../utils/ApiError");

const Chat = require("../models/Chat");
const { User } = require("../models/User");
const Member = require("../models/Member");
const Roles = require("../roles");
const Message = require("../models/Message");
const Types = require("../types");
const { saveChatImage } = require("../setup/s3client");

const router = express.Router();
const upload = multer();

const createChatSchema = object({
  name: string().trim().min(1).max(100).required(),
  type: string().oneOf(Object.values(Types)).required(),
});

router.get(
  "/",
  [auth],
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: "chats",
      populate: {
        path: "messages",
        populate: {
          path: "member",
          populate: { path: "userId" },
        },
      },
    });
    if (!user) throw ApiError.notFound("USER_NOT_FOUND", "User does not exist");

    return res.json(user.chats);
  })
);

router.get(
  "/url/:inviteUrl",
  [auth],
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { inviteUrl } = req.params;

    if (!inviteUrl)
      throw ApiError.badRequest("INVITE_MISSING", "INVITE URL is missing");

    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("USER_NOT_FOUND", "User does not exist");

    const chat = await Chat.findOne({ inviteCode: inviteUrl });
    if (!chat) throw ApiError.notFound("CHAT_NOT_FOUND", "Chat does not exist");

    if (userId !== chat.userId.toString() && chat.access === "private") {
      const member = chat.members.find((m) => m.userId === userId);
      if (!member)
        throw ApiError.forbidden("NOT_MEMBER", "User is not a member of chat");
    }

    return res.json(chat);
  })
);

router.get(
  "/:id",
  [auth, validateObjectIds(["id"])],
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const chatId = req.params.id;

    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("USER_NOT_FOUND", "User does not exist");

    const chat = await Chat.findById(chatId).populate({
      path: "members",
      populate: { path: "userId", model: "User" },
    });
    if (!chat) throw ApiError.notFound("CHAT_NOT_FOUND", "Chat does not exist");

    if (userId !== chat.userId.toString() && chat.access === "private") {
      const member = chat.members.find((m) => m.userId === userId);
      if (!member)
        throw ApiError.forbidden("NOT_MEMBER", "User is not a member of chat");
    }

    return res.json(chat);
  })
);

router.post(
  "/",
  [auth, upload.single("image"), validateBody(createChatSchema)],
  asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    const image = req.file;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("USER_NOT_FOUND", "User does not exist");

    const chat = new Chat();
    let imageUrl = null;
    if (image) {
      imageUrl = await saveChatImage(
        chat._id,
        image.originalname,
        image.buffer,
        image.mimetype
      );
    }

    chat.set({
      name,
      userId,
      type,
      imageUrl,
      inviteCode: `+${uuidv4()}`,
    });

    const member = new Member({
      userId,
      chatId: chat._id,
      isAdmin: true,
    });

    chat.members.push(member._id);
    user.members.push(member._id);
    user.chats.push(chat._id);

    await chat.save();
    await member.save();
    await user.save();

    return res.json(chat);
  })
);

router.post(
  "/join/:chatId",
  [auth, validateObjectIds(["chatId"])],
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { chatId } = req.params;

    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("USER_NOT_FOUND", "User does not exist");

    const chat = await Chat.findById(chatId).populate("members");
    if (!chat) throw ApiError.notFound("CHAT_NOT_FOUND", "Chat does not exist");

    const userAlreadyMember = chat.members.find(
      (m) => m.userId.toString() === userId
    );
    if (userAlreadyMember) return res.json(chat);

    let member = await Member.findOne({ chatId: chat._id, userId });
    if (!member) {
      member = new Member({ userId, chatId: chat._id });
      await member.save();
    }

    user.members.push(member._id);
    user.chats.push(chat._id);
    chat.members.push(member._id);

    await user.save();
    await chat.save();

    return res.json(chat);
  })
);

router.post(
  "/leave/:chatId",
  [auth, validateObjectIds(["chatId"])],
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { chatId } = req.params;

    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("USER_NOT_FOUND", "User does not exist");

    const chat = await Chat.findById(chatId).populate("members");
    if (!chat) throw ApiError.notFound("CHAT_NOT_FOUND", "Chat does not exist");

    const member = chat.members.find((m) => m.userId.toString() === userId);
    if (!member)
      throw ApiError.badRequest("NOT_MEMBER", "User is not a member of chat");

    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $pull: { members: member._id, chats: chat._id },
      }),
      Chat.findByIdAndUpdate(chat._id, {
        $pull: { members: member._id },
      }),
    ]);

    return res.json(chat);
  })
);

router.delete(
  "/",
  [auth, validateObjectIds(["chatId"], "query")],
  asyncHandler(async (req, res) => {
    const { chatId } = req.query;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("USER_NOT_FOUND", "User does not exist");

    const chat = await Chat.findById(chatId);
    if (!chat) throw ApiError.notFound("CHAT_NOT_FOUND", "Chat does not exist");

    if (userId !== chat.userId.toString()) {
      const member = chat.members.find((m) => m.userId === userId);
      if (!member)
        throw ApiError.forbidden("NOT_MEMBER", "User is not a member of chat");

      const isAdmin = member.role === Roles.ADMIN;
      if (!isAdmin) throw ApiError.forbidden("FORBIDDEN", "Access denied");
    }

    // cascade cleanup
    const members = await Member.find({ chatId });
    await Promise.all(
      members.map((m) =>
        User.findByIdAndUpdate(m.userId, { $pull: { members: m._id } })
      )
    );
    await Member.deleteMany({ chatId });
    await Message.deleteMany({ chatId });
    await User.updateMany({ chats: chatId }, { $pull: { chats: chatId } });
    await Chat.findByIdAndRemove(chat._id);

    return res.json(chat);
  })
);

module.exports = router;
