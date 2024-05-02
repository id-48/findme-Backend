const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema(
  {
    senderId: { type: String, default: "" },
    reciverId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Connection", ConnectionSchema);
