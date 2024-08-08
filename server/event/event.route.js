const express = require("express");
const EventController = require("./event.controller");
const router = express.Router();
const verifyToken = require('../../checkAccess'); 
const multer = require("multer");
const storage = require("../../util/multer");

const upload = multer({
    storage,    
});

router.post("/addEvent", upload.fields([{ name: "eventImages" }]), verifyToken, EventController.addEvent);

router.post("/updateEvent", upload.fields([{ name: "eventImages" }]), verifyToken, EventController.updateEvent);

router.get("/getAllEvent", verifyToken, EventController.getAllEvent);

router.get("/getUserWiseEvent", verifyToken, EventController.getUserWiseEvent);

router.get("/deleteEvent", verifyToken, EventController.deleteEvent);

module.exports = router;