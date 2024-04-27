const express = require("express");
const ConnectionController = require("./connection.controller");
const verifyToken = require('../../checkAccess'); 
const router = express.Router();

router.post("/addConnection", verifyToken, ConnectionController.addConnection);

router.get("/getUserWiseConnection",verifyToken, ConnectionController.getUserWiseConnection);

module.exports = router;