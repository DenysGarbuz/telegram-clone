const mongoose = require("mongoose");
const Roles = require("../roles");
const Rights = require("../rights");

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    chatId: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
    },
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    rights: {
      type: Object,
      default: Rights,
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
