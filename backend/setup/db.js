module.exports = function () {
  const mongoose = require("mongoose");
  const config = require("config");

  mongoose.connect(config.get("db")).then(() => {
    console.log("mongodb connected");
  });

 
};
