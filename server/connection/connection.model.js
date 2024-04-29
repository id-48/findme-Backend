const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema(
  {
    fromUserId: { type: String, required: true },
    toId: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    userName: { type: String, default: "" },
    profilePic: { type: Array, default: [] },
    mono: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    address: { type: String, default: "" },
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" },
    countryName: { type: String, default: "" },
    fcmToken: { type: String, default: "" },
    status: { type: String, default: "pending" }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Connection", ConnectionSchema);