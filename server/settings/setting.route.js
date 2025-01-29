const express = require("express");
const SettingController = require("./setting.controller");
const router = express.Router();
const verifyToken = require('../../checkAccess'); 


router.post("/updateSetting" , verifyToken, SettingController.updateSetting);

module.exports = router;