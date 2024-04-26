const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema(
    {
        placeName: { type: String, default: "" },
        category: { type: String, default: "" },
        location: { type: String, default: "" },
        lattitued: { type: String, default: "" },
        longtitude: { type: String, default: "" },
        locatedWithin: { type: String, default: "" },
        placeDescription: { type: String, default: "" },
        mono: { type: String, default: "" }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("Place", PlaceSchema);