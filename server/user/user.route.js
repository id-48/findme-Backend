const express = require("express");
const UserController = require("./user.controller");
const router = express.Router();
const verifyToken = require('../../checkAccess'); 
const multer = require("multer");
const storage = require("../../util/multer");

const upload = multer({
    storage,    
});

router.post("/addUser", upload.fields([{ name: "profilePic" }]),UserController.addUser);

router.post("/updateUser", verifyToken , upload.fields([{ name: "profilePic" }]), UserController.updateUser);

router.get("/getAllUser", verifyToken, UserController.getAllUser);

router.get("/getUser", verifyToken, UserController.getUser);

router.get("/deleteUser", verifyToken , UserController.deleteUser);

router.post("/checkUser", verifyToken, UserController.userCheck);

module.exports = router;