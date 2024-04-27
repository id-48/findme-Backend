const express = require("express");
const EventController = require("./event.controller");
const verifyToken = require('../../checkAccess'); 
const router = express.Router();

router.post("/addEvent", verifyToken, EventController.addEvent);

router.post("/updateEvent", verifyToken, EventController.updateEvent);

router.get("/getAllEvent", verifyToken, EventController.getAllEvent);

router.get("/getUserWiseEvent", verifyToken, EventController.getUserWiseEvent);

router.get("/deleteEvent", verifyToken, EventController.deleteEvent);

module.exports = router;