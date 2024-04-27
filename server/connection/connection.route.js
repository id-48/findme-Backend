const express = require("express");
const ConnectionController = require("./connection.controller");
const router = express.Router();

router.post("/addConnection", ConnectionController.addConnection);

router.get("/getUserWiseConnection", ConnectionController.getUserWiseConnection);

module.exports = router;