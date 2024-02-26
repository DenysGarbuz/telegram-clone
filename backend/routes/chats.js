const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const Chat = require("../models/Chat");
const { User } = require("../models/User");
const Member = require("../models/Member");
const validateId = require("../utils/validateId");
const Roles = require("../roles");
const Message = require("../models/Message");
const Types = require("../types");
const { saveChatImage } = require("../setup/s3client");
const multer = require("multer");
const upload = multer();
const _ = require("lodash");

router.get("/", [auth], async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate({
    path: "chats",
    populate: {
      path: "messages",
      populate: {
        path: "member",
        populate: {
          path: "userId",
        },
      },
    },
  });
  if (!user) {
    return res.status(404).json({ error: "USER does not exists" });
  }

  return res.json(user.chats);
});

router.get("/url/:inviteUrl", [auth], async (req, res) => {
  const userId = req.user._id;
  const inviteUrl = req.params.inviteUrl;

  if (!inviteUrl) {
    return res.status(400).json("INVITE URL is missing");
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "USER does not exists" });
  }

  const chat = await Chat.findOne({ inviteCode: inviteUrl });
  if (!chat) {
    return res.status(404).json({ error: "CHAT does not exists" });
  }

  if (userId !== chat.userId.toString()) {
    const member = chat.members.find((member) => member.userId === userId);
    if (chat.access === "private") {
      if (!member) {
        return res.status(400).json({ error: "USER is not an MEMBER of CHAT" });
      }
    }
  }

  return res.json(chat);
});

router.get("/:id", [auth], async (req, res) => {
  const userId = req.user._id;
  const chatId = req.params.id;

  const error = validateId("chatId", chatId);
  if (error) {
    return res.status(400).json(error);
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "USER does not exists" });
  }

  const chat = await Chat.findById(chatId).populate({
    path: "members",
    populate: {
      path: "userId",
      model: "User",
    },
  });
  if (!chat) {
    return res.status(404).json({ error: "CHAT does not exists" });
  }

  if (userId !== chat.userId.toString()) {
    if (chat.access === "private") {
      const member = chat.members.find((member) => member.userId === userId);
      if (!member) {
        return res.status(400).json({ error: "USER is not an MEMBER of CHAT" });
      }
    }
  }

  return res.json(chat);
});

router.post("/", [auth, upload.single("image")], async (req, res) => {
  const name = req.body.name;
  const type = req.body.type;
  const image = req.file;
  const userId = req.user._id;

  // console.log(image);
  // console.log(type);
  // console.log(name);

  if (!type) {
    return res.status(400).json({ error: "Chat TYPE is missing" });
  }

  if (!Object.values(Types).includes(type)) {
    return res.status(400).json({ error: "Chat TYPE incorrect" });
  }

  if (!name) {
    return res.status(400).json({ error: "Chat NAME is missing" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "USER does not exists" });
  }

  let imageUrl = null;

  let chat = new Chat();
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
});

router.post("/join/:chatId", [auth], async (req, res) => {
  const userId = req.user._id;
  const chatId = req.params.chatId;

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

  const userAlreadyMember = chat.members.find(
    (member) => member.userId.toString() === userId
  );
  if (userAlreadyMember) {
    return res.json(chat);
    //return res.status(400).json({ error: "USER already MEMBER of the chat" });
  }

  //if user was member earlier
  let member = await Member.findOne({ chatId: chat._id, userId });
  if (!member) {
    member = new Member({ userId, chatId: chat._id });
    await member.save();
  }

  console.log(member);

  user.members.push(member._id);
  user.chats.push(chat._id);
  chat.members.push(member._id);

  await user.save();
  await chat.save();

  return res.json(chat);
});

router.post("/leave/:chatId", [auth], async (req, res) => {
  const userId = req.user._id;
  const chatId = req.params.chatId;
  console.log(chatId);

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

  const member = chat.members.find(
    (member) => member.userId.toString() === userId
  );

  if (!member) {
    return res.status(400).json({ error: "USER not MEMEBER of the chat" });
  }

  await Promise.all([
    User.findByIdAndUpdate(userId, {
      $pull: { members: member._id, chats: chat._id },
    }),
    Chat.findByIdAndUpdate(chat._id, {
      $pull: { members: member._id },
    }),
    //Member.findByIdAndDelete(member._id),
  ]);

  return res.json(chat);
});

router.delete("/", [auth], async (req, res) => {
  const chatId = req.query.chatId;
  const userId = req.user._id;

  const error = validateId("chatId", chatId);
  if (error) {
    return res.status(400).json(error);
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "USER does not exists" });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ error: "CHAT does not exists" });
  }

  if (userId !== chat.userId.toString()) {
    const member = chat.members.find((member) => member.userId === userId);

    if (!member) {
      return res.status(400).json({ error: "USER is not an MEMBER of CHAT" });
    }

    const isAdmin = member.role === Roles.ADMIN;

    if (!isAdmin) {
      return res.status(400).json({ error: "ACCESS denied" });
    }
  }
  //cascade cleaning
  const members = await Member.find({ chatId });
  await Promise.all(
    members.map(async (member) => {
      await User.findByIdAndUpdate(member.userId, {
        $pull: { members: member._id },
      });
    })
  );
  await Member.deleteMany({ chatId });
  await Message.deleteMany({ chatId });
  await User.updateMany({ chats: chatId }, { $pull: { chats: chatId } });

  await Chat.findByIdAndRemove(chat._id);

  return res.json(chat);
});

module.exports = router;
