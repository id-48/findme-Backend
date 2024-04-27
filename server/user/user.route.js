const express = require("express");
const UserController = require("./user.controller");
const router = express.Router();
const verifyToken = require('../../checkAccess'); 
const multer = require("multer");
const storage = require("../../util/multer");

const upload = multer({
    storage,    
});

router.use(verifyToken());


router.post("/addUser", upload.fields([{ name: "profilePic" }]),UserController.addUser);

router.post("/updateUser" , upload.fields([{ name: "profilePic" }]), UserController.updateUser);

router.get("/getAllUser", UserController.getAllUser);

router.get("/getUser", UserController.getUser);

router.get("/deleteUser", UserController.deleteUser);

router.post("/checkUser", UserController.userCheck);

module.exports = router;