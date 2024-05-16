const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    adminName: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Admin", AdminSchema);
