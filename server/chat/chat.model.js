const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
