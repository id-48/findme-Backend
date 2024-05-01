const express = require("express");
const ChatController = require("../chat/chat.controller");
const verifyToken = require('../../checkAccess'); 
const router = express.Router();


router.get("/allChats", verifyToken, ChatController.getAllChats);

router.post("/sendMessage", verifyToken, ChatController.sendMessage);

router.get("/getMessages", verifyToken, ChatController.getMessages);

module.exports = router;
