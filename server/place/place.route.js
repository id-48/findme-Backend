const express = require("express");
const PlaceController = require("./place.controller");
const verifyToken = require('../../checkAccess'); 

const router = express.Router();

router.post("/addPlace", verifyToken, PlaceController.addPlace);

router.post("/updatePlace", verifyToken, PlaceController.updatePlace);

router.get("/getAllPlace", verifyToken, PlaceController.getAllPlace);

router.get("/getUserWisePlace", verifyToken, PlaceController.getUserWisePlace);

router.get("/deletePlace", verifyToken, PlaceController.deletePlace);

module.exports = router;