const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        profilePic: { type: Array, default: [] },
        bio: { type: String, default:"" },
        mono: { type: String, default: "" },
        countryCode: { type: String, default: "" },
        lastVisitedPlace: { type: [String], default: [] },
        lattitude: { type: String, default: "" },
        longtitude: { type: String, default: "" },
        lastActivate: { type: String, default: "" },
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