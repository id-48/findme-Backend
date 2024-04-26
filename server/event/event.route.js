const express = require("express");
const EventController = require("./user.controller");
const router = express.Router();

router.post("/addUser", EventController.addUser);

router.post("/updateUser", EventController.updateUser);

router.get("/getAllUser", EventController.getAllUser);

router.get("/getUser", EventController.getUser);

router.get("/deleteUser", EventController.deleteUser);

router.get("/checkUser", EventController.userCheck);

module.exports = router;