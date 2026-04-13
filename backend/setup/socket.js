const validateId = require("../utils/validateId");
const jwt = require("jsonwebtoken");
const { saveMultipleFiles } = require("./s3client");
const env = require("../config/env");
const logger = require("../utils/logger");

module.exports = function (server) {
  const { Server } = require("socket.io");
  const Message = require("../models/Message");
  const Member = require("../models/Member");
  const Chat = require("../models/Chat");

  const io = new Server(server, {
    cors: {
      origin: env.frontendUrl,
    },
  });

  io.use(async (socket, next) => {
    const accessToken = socket.handshake.query.token;
    try {
      const decoded = jwt.verify(accessToken, env.jwtPrivateKey);
      socket.user = decoded;
      next();
    } catch (error) {
      logger.warn({ err: error.message }, "socket auth failed");
      socket.disconnect();
    }
  });

  io.on("connection", (socket) => {
    socket.on("joining", (chatId) => {
      socket.rooms.forEach((room) => socket.leave(room));
      socket.join(chatId);
      socket.emit("joined", chatId);
    });

    socket.on("leaving", (chatId) => {
      socket.leave(chatId);
    });

    socket.on(
      "message:add",
      async ({ text, chatId, memberId, messageReplyToId, fakeId, files }) => {
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
          messageReplyTo: messageReplyToId,
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

        io.to(chatId).emit("message:add", {
          newMessage: messageToAllMembers,
          fakeId,
        });
      }
    );

    socket.on("message:delete", async ({ chatId, messageIds }) => {
      const userId = socket.user._id;

      let error = validateId("chatId", chatId);
      if (error) {
        return;
      }

      error = validateId("messageId", messageIds);
      if (error) {
        return;
      }

      const member = await Member.findOne({ userId, chatId });
      if (!member) {
        return res.status(404).json({ error: "MEMBER does not exists" });
      }

      const chat = await Chat.findById(chatId).populate("members");
      if (!chat) {
        return res.status(404).json({ error: "CHAT does not exists" });
      }

      let deletedMessages = [];

      if (member.isAdmin && member.rights.canDeleteMessages) {
        await Message.deleteMany({
          _id: { $in: messageIds },
          chatId,
        });

        deletedMessages = messageIds;
      } else {
        const messages = await Message.find({
          _id: { $in: messageIds },
          member: member._id,
        });
        const messagesToDelete = [];
        for (const message of messages) {
          if (message.member.toString() === member._id.toString()) {
            messagesToDelete.push(message._id);
          }
        }

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
      const messageToAllMembers = await Message.findOneAndUpdate(
        { chatId, _id: messageId },
        { $set: { text } },
        { new: true }
      )
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

      io.to(chatId).emit("message:edit", messageToAllMembers);
    });
  });
};
