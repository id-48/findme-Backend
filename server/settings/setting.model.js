const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema(
    {
        email: { type: Boolean, default: false },
        push:{ type: Boolean, default: false },
        chat: { type: Boolean, default: false },
    
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("Setting", SettingSchema);