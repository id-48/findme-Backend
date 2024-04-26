const express = require("express");
const PlaceController = require("./place.controller");
const router = express.Router();

router.post("/addPlace", PlaceController.addPlace);

router.post("/updatePlace", PlaceController.updatePlace);

router.get("/getAllPlace", PlaceController.getAllPlace);

router.get("/getUserWisePlace", PlaceController.getUserWisePlace);

router.get("/deletePlace", PlaceController.deletePlace);

module.exports = router;