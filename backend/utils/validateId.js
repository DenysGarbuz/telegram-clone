const { isArray, isEmpty } = require("lodash");
const mongoose = require("mongoose");

module.exports = function (name, ...list) {
  
  if (!list[0]) {
    return { error: `${name} ID is missing` };
  }

  if (isArray(list[0])) {
    list = list[0];
  }

  for (id of list) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { error: `Invalid ${name} ID` };
    }
  }

  return null;
};
