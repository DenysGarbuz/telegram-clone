const mongoose = require("mongoose");
const { object, string } = require("yup");
const validateSchema = require("../utils/validateSchema");
const jwt = require("jsonwebtoken");
const config = require("config");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      minLength: 1,
      maxLength: 15,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 1024,
    },
    imageUrl: {
      type: String,
      default: null
    },
    refreshId: {
      type: String,
      default: uuidv4,
    },
    contacts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    folders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Folder",
      },
    ],
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Member",
      },
    ],
    chats: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Chat",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    config.get("jwtPrivateKey"),
    { expiresIn: "15m" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ refreshId: this.refreshId }, config.get("jwtPrivateKey"), {
    expiresIn: "3h",
  });
};

const User = mongoose.model("User", userSchema);

async function validateUser(user) {
  const schema = object({
    email: string().email().min(5).max(255).required(),
    password: string().min(5).max(255).required(),
  });

  return validateSchema(schema, user);
}

module.exports = {
  User,
  validate: validateUser,
};
