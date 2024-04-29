const express = require("express");
const ConnectionController = require("./connection.controller");
const verifyToken = require('../../checkAccess'); 
const router = express.Router();

router.post("/sendConnection", verifyToken, ConnectionController.sendConnection);

router.get("/getUserWiseConnection",verifyToken, ConnectionController.getUserWiseConnection);

router.get("/addFriend",verifyToken, ConnectionController.addFriend);

router.get("/removeRequest",verifyToken, ConnectionController.removeRequest);

router.get("/friendList",verifyToken, ConnectionController.friendList);



// router.post("/sendFriendRequest", verifyToken, ConnectionController.sendFriendRequest);

// router.get("/receiveFriendRequests",verifyToken, ConnectionController.receiveFriendRequests);

// router.post("/respondToFriendRequest",verifyToken, ConnectionController.respondToFriendRequest);

// router.get("/getAllFriends",verifyToken, ConnectionController.getAllFriends);


module.exports = router;