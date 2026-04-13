const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { saveMultipleFiles } = require("./s3client");
const env = require("../config/env");
const logger = require("../utils/logger");

function isValidId(id) {
  return id && mongoose.Types.ObjectId.isValid(id);
}

module.exports = function (server) {
  const { Server } = require("socket.io");
  const Message = require("../models/Message");
  const Member = require("../models/Member");
  const Chat = require("../models/Chat");

  const allowedOrigins = env.frontendUrl
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  // JWT auth middleware: runs once per socket connection
  io.use((socket, next) => {
    const accessToken = socket.handshake.query.token;
    if (!accessToken) {
      return next(new Error("UNAUTHENTICATED"));
    }
    try {
      const decoded = jwt.verify(accessToken, env.jwtPrivateKey);
      socket.user = decoded;
      return next();
    } catch (err) {
      logger.warn({ err: err.message }, "socket auth failed");
      return next(new Error("UNAUTHENTICATED"));
    }
  });

  /**
   * Returns the caller's Member doc for `chatId` iff the user is a member
   * or the chat is public. Returns null otherwise.
   */
  async function memberForUserAndChat(userId, chatId) {
    if (!isValidId(chatId)) return null;
    const chat = await Chat.findById(chatId).select("access userId");
    if (!chat) return null;
    const member = await Member.findOne({ userId, chatId });
    if (member) return member;
    if (chat.access === "public") {
      // Public-chat observers can read but don't have a member doc — return a
      // sentinel so the caller knows the room is joinable but not writable.
      return { _id: null, isAdmin: false, rights: {} };
    }
    return null;
  }

  io.on("connection", (socket) => {
    socket.on("joining", async (chatId) => {
      const userId = socket.user && socket.user._id;
      const member = await memberForUserAndChat(userId, chatId);
      if (!member) {
        socket.emit("error", {
          code: "FORBIDDEN_ROOM",
          message: "Not allowed to join this chat",
        });
        return;
      }
      socket.rooms.forEach((room) => {
        if (room !== socket.id) socket.leave(room);
      });
      socket.join(chatId);
      socket.emit("joined", chatId);
    });

    socket.on("leaving", (chatId) => {
      if (isValidId(chatId)) socket.leave(chatId);
    });

    socket.on(
      "message:add",
      async ({ text, chatId, memberId, messageReplyToId, fakeId, files }) => {
        const userId = socket.user && socket.user._id;
        if (!isValidId(chatId) || !isValidId(memberId)) return;

        // Enforce that the sender really is the member they claim.
        const callerMember = await Member.findOne({ userId, chatId });
        if (!callerMember || callerMember._id.toString() !== memberId) return;

        const chat = await Chat.findById(chatId);
        if (!chat) return;

        let fileUrls = null;
        if (files && files.length > 0) {
          fileUrls = await saveMultipleFiles(chat._id, files);
        }

        const message = new Message({
          text,
          chatId,
          fileUrls,
          member: memberId,
          messageReplyTo: isValidId(messageReplyToId)
            ? messageReplyToId
            : undefined,
        });

        chat.messages.push(message._id);
        await Member.findByIdAndUpdate(memberId, {
          $push: { messages: message._id },
        });
        await chat.save();
        await message.save();

        const messageToAllMembers = await Message.findById(message._id)
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

        io.to(chatId).emit("message:add", {
          newMessage: messageToAllMembers,
          fakeId,
        });
      }
    );

    socket.on("message:delete", async ({ chatId, messageIds }) => {
      const userId = socket.user && socket.user._id;
      if (!isValidId(chatId) || !Array.isArray(messageIds)) return;
      if (!messageIds.every(isValidId)) return;

      const member = await Member.findOne({ userId, chatId });
      if (!member) return;

      const chat = await Chat.findById(chatId);
      if (!chat) return;

      let deletedMessages = [];

      if (member.isAdmin && member.rights.canDeleteMessages) {
        await Message.deleteMany({ _id: { $in: messageIds }, chatId });
        deletedMessages = messageIds;
      } else {
        const messages = await Message.find({
          _id: { $in: messageIds },
          member: member._id,
        });
        const messagesToDelete = messages
          .filter((m) => m.member.toString() === member._id.toString())
          .map((m) => m._id);

        await Message.deleteMany({
          _id: { $in: messagesToDelete },
          chatId,
          member: member._id,
        });

        deletedMessages = messagesToDelete;
      }

      io.to(chatId).emit("message:delete", deletedMessages);
    });

    socket.on("message:edit", async ({ messageId, chatId, text }) => {
      const userId = socket.user && socket.user._id;
      if (!isValidId(chatId) || !isValidId(messageId)) return;

      const member = await Member.findOne({ userId, chatId });
      if (!member) return;

      // Can only edit own messages (no server-side admin override today).
      const existing = await Message.findOne({ _id: messageId, chatId });
      if (!existing) return;
      if (existing.member.toString() !== member._id.toString()) return;

      const messageToAllMembers = await Message.findOneAndUpdate(
        { chatId, _id: messageId },
        { $set: { text } },
        { new: true }
      )
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

      io.to(chatId).emit("message:edit", messageToAllMembers);
    });
  });
};
