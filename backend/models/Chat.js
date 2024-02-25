const mongoose = require("mongoose");
const Types = require("../types");

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Member",
      },
    ],
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
      },
    ],
    type: {
      type: String,
      enum: Object.values(Types),
      required: true,
    },
    access: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },
    imageUrl: {
      type: String,
    },
    inviteCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
