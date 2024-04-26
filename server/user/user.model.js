const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
    {
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },
        userName: { type: String, default: "" },
        profilePic: { type: Array, default: [] },
        mono: { type: String, default: "" },
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

module.exports = mongoose.model("User", UsersSchema);