const express = require("express");
const EventController = require("./event.controller");
const router = express.Router();

router.post("/addEvent", EventController.addEvent);

router.post("/updateEvent", EventController.updateEvent);

router.get("/getAllEvent", EventController.getAllEvent);

router.get("/getUserWiseEvent", EventController.getUserWiseEvent);

router.get("/deleteEvent", EventController.deleteEvent);

module.exports = router;