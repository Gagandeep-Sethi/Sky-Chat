const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendListSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  blocked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const FriendList = mongoose.model("FriendList", FriendListSchema);

module.exports = FriendList;
