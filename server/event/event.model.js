const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
    {
        title: { type: String, default: "" },
        location: { type: String, default: "" },
        lattitude: { type: String, default: "" },
        longtitude: { type: String, default: "" },
        eventDate: { type: String, default: "" },
        time: { type: String, default: "" },
        description: { type: String, default: "" },
        mono: { type: String, default: "" }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("Event", EventSchema);