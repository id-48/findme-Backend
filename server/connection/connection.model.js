const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema(
    {
        fromUserId: { type: String, default: "" },
        toId: { type: String, default: "" },
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },
        userName: { type: String, default: "" },
        profilePic: { type: Array, default: [] },
        mono: { type: String, default: "" },
        countryCode: { type: String, default: "" },
        address: { type: String, default: "" },
        lattitude: { type: String, default: "" },
        longtitude: { type: String, default: "" },
        countryName: { type: String, default: "" },
        fcmToken: { type: String, default: "" },
       
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("Connection", ConnectionSchema);