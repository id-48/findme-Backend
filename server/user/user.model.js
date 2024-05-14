const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        profilePic: { type: Array, default: [] },
        bio: { type: String, default:"" },
        email: { type: String, default:"" },
        age: { type: String, default:"" },
        mono: { type: String, default: "" },
        countryCode: { type: String, default: "" },
        countryName: { type: String, default: "" },
        lastVisitedPlace: { type: [String], default: [] },
        lattitude: { type: String, default: "" },
        longtitude: { type: String, default: "" },
        lastActivate: { type: String, default: "" },
        userStatus: { type: String, enum: ["online", "offline"], default: "offline" },
        gender: { type: String, default: "" },
        languages: { type: [String], default: [] },
        fcmToken: { type: String, default: "" },
       
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("User", UsersSchema);