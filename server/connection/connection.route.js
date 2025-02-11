const express = require("express");
const ConnectionController = require("./connection.controller");
const verifyToken = require('../../checkAccess'); 
const router = express.Router();

router.post("/sendFriendRequest", verifyToken, ConnectionController.sendFriendRequest);

router.get("/receiveFriendRequest", verifyToken, ConnectionController.receiveFriendRequest);

router.post("/makeFriend", verifyToken, ConnectionController.makeFriend);

router.get("/friendList", verifyToken, ConnectionController.friendList);

module.exports = router;