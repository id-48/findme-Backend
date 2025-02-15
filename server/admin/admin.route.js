const express = require("express");
const AdminController = require("./admin.controller");
const verifyToken = require('../../checkAccess'); 
const router = express.Router();

router.post("/registerAdmin", AdminController.registerAdmin);

router.post("/updateAdmin", verifyToken, AdminController.updateAdmin);

router.post("/loginAdmin", AdminController.loginAdmin);

router.post("/getAllAdmin", verifyToken, AdminController.getAllAdmin);

router.post("/deleteAdmin", verifyToken, AdminController.deleteAdmin);

module.exports = router;