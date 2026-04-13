module.exports = function () {
  const mongoose = require("mongoose");
  const env = require("../config/env");

  mongoose.connect(env.mongodbUrl).then(() => {
    console.log("mongodb connected");
  });
};
