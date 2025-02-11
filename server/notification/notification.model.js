const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    profileImage: { type: String, default:"" },
    userId: { type: String, default: "" },
    description: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Notification", NotificationSchema);
