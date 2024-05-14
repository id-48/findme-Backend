const express = require("express");
const route = express.Router();
const verifyToken = require('../../checkAccess'); 

const ChatTopicController = require("./chatTopic.controller");

//create chat topic
route.post(
  "/createRoom",
  verifyToken,
  ChatTopicController.store
);


module.exports = route;
