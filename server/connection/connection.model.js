// const mongoose = require("mongoose");

// const ConnectionSchema = new mongoose.Schema(
//   {
//     from: {
//       type: {
//         fromId: { type: String, default: "" },
//         firstName: { type: String, default: "" },
//         lastName: { type: String, default: "" },
//         userName: { type: String, default: "" },
//         profilePic: { type: Array, default: [] },
//         mono: { type: String, default: "" },
//         countryCode: { type: String, default: "" },
//         address: { type: String, default: "" },
//         latitude: { type: String, default: "" },
//         longitude: { type: String, default: "" },
//         countryName: { type: String, default: "" },
//         fcmToken: { type: String, default: "" },
//       },
//       default: {},
//     },
//     to: {
//       type: {
//         toId: { type: String, default: "" },
//         firstName: { type: String, default: "" },
//         lastName: { type: String, default: "" },
//         userName: { type: String, default: "" },
//         profilePic: { type: Array, default: [] },
//         mono: { type: String, default: "" },
//         countryCode: { type: String, default: "" },
//         address: { type: String, default: "" },
//         latitude: { type: String, default: "" },
//         longitude: { type: String, default: "" },
//         countryName: { type: String, default: "" },
//         fcmToken: { type: String, default: "" },
//       },
//       default: {},
//     },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );

// module.exports = mongoose.model("Connection", ConnectionSchema);



const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema(
  {
    senderId: { type: String, default: "" },
    reciverId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Connection", ConnectionSchema);
