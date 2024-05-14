const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    senderId: String,
    messageType: { type: Number, enum: [0, 1, 2, 3] }, //0 : image, 1 : video, 2 : audio, 3 : chat, 4 : gift , 5 : videoCall,
    message: String,
    image: { type: String, default: null },
    video: { type: String, default: null },
    audio: { type: String, default: null },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatTopic" },
    date: String,
    isRead: { type: Boolean, default: false },
    type: Number, //for Sender or Reciver
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
