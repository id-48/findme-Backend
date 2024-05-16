const express = require("express");
const AdminController = require("./admin.controller");
const router = express.Router();

router.post("/loginAdmin", AdminController.loginAdmin);

router.post("/registerAdmin", AdminController.registerAdmin);

module.exports = router;