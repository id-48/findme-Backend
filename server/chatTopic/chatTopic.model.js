const mongoose = require("mongoose");

const chatTopicSchema = new mongoose.Schema(
  {
    reciverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
chatTopicSchema.index({ reciverId: 1 });
chatTopicSchema.index({ senderId: 1 });
chatTopicSchema.index({ chat: 1 });
module.exports = mongoose.model("ChatTopic", chatTopicSchema);
