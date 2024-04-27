const express = require("express");
const ConnectionController = require("./connection.controller");
const verifyToken = require('../../checkAccess'); 
const router = express.Router();

router.post("/sendConnection", verifyToken, ConnectionController.sendConnection);

router.get("/getUserWiseConnection",verifyToken, ConnectionController.getUserWiseConnection);

router.get("/addFriend",verifyToken, ConnectionController.addFriend);

router.get("/friendlist",verifyToken, ConnectionController.friendlist);

module.exports = router;