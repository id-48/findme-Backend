const express = require("express");
const ChatController = require("../chat/chat.controller");
const verifyToken = require('../../checkAccess'); 
const route = express.Router();


//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

//get old chat
route.get("/getOldChat", verifyToken, ChatController.getOldChat);

//create chat [with image,video,audio]
route.post(
  "/createChat",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  ChatController.store
);

//delete Chat
route.delete(
  "/deleteChat",
  verifyToken,
  ChatController.deleteChat
);

module.exports = route;
