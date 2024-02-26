const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    member: {
      type: mongoose.Types.ObjectId,
      ref: "Member",
    },
    content: {
      type: String,
    },
    fileUrls: [
      {
        type: String,
      }
    ],
    chatId: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
    },
    text: {
      type: String,
    },
    messageReplyTo: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
