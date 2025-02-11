const express = require("express");
const NotificaitonController = require("./notification.controller");
const verifyToken = require('../../checkAccess'); 
const router = express.Router();


router.get("/getNotification", verifyToken, NotificaitonController.getNotification);

router.get("/markAsRead", verifyToken, NotificaitonController.markAsRead);

router.get("/notificationCount", verifyToken, NotificaitonController.notificationCount);


module.exports = router;