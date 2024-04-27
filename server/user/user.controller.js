const User = require("./user.model");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('../../config'); 

// exports.addUser = async (req, res) => {
//   var {
//     firstName,
//     lastName,
//     userName,
//     profilePic,
//     mono,
//     countryCode,
//     address,
//     lattitude,
//     longtitude,
//     countryName,
//     fcmToken,
//   } = req.body;
//   try {
//     var existingUser = await User.findOne({ mono });

//     if (existingUser) {
//       return res.status(200).json({ status: false, message: "User already exists." });
//     }

//     var newUser = new User({
//       firstName: firstName || "",
//       lastName: lastName || "",
//       userName: userName || "",
//       profilePic: profilePic || [],
//       mono: mono || "",
//       countryCode: countryCode || "",
//       address: address || "",
//       lattitude: lattitude || "",
//       longtitude: longtitude || "",
//       countryName: countryName || "",
//       fcmToken: fcmToken || "",
//     });

//     if (req.files.profilePic) {
//       newUser.profilePic = req.files.profilePic[0].path;
//     }

//     var userSaved = await newUser.save();

//     if (userSaved) {
//       return res.status(200).json({ status: true, message: "User registered." });
//     } else {
//       return res.status(200).json({ status: false, message: "Failed." });
//     }
//   } catch (error) {
//     return res.status(500).json({ status: false, error: error.message || "Server Error" });
//   }
// };


exports.addUser = async (req, res) => {
  var {
    firstName,
    lastName,
    userName,
    profilePic,
    mono,
    countryCode,
    address,
    latitude,
    longitude,
    countryName,
    fcmToken,
  } = req.body;
  try {
    var existingUser = await User.findOne({ mono });

    if (existingUser) {
      return res.status(200).json({ status: false, message: "User already exists." });
    }

    var newUser = new User({
      firstName: firstName || "",
      lastName: lastName || "",
      userName: userName || "",
      profilePic: profilePic || [],
      mono: mono || "",
      countryCode: countryCode || "",
      address: address || "",
      latitude: latitude || "",
      longitude: longitude || "",
      countryName: countryName || "",
      fcmToken: fcmToken || "",
    });

    if (req.files.profilePic) {
      newUser.profilePic = req.files.profilePic[0].path;
    }

    var userSaved = await newUser.save();

    if (userSaved) {
      const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });

      return res.status(200).json({ status: true, message: "User registered.", token: token });
    } else {
      return res.status(200).json({ status: false, message: "Failed." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  var {
    userId,
    firstName,
    lastName,
    userName,
    profilePic,
    mono,
    countryCode,
    address,
    lattitude,
    longtitude,
    countryName,
    fcmToken,
  } = req.body;

  try {
    var existingUser = await User.findOne({ _id: userId });

    if (existingUser) {

      existingUser.firstName = firstName != "" ? firstName : existingUser.firstName;
      existingUser.lastName = lastName != "" ? lastName : existingUser.lastName;
      existingUser.userName = userName != "" ? userName : existingUser.userName;
      existingUser.profilePic = profilePic != "" ? profilePic : existingUser.profilePic;
      existingUser.mono = mono != "" ? mono : existingUser.mono;
      existingUser.countryCode = countryCode != "" ? countryCode : existingUser.countryCode;
      existingUser.address = address != "" ? address : existingUser.address;
      existingUser.lattitude = lattitude != "" ? lattitude : existingUser.lattitude;
      existingUser.longtitude = longtitude != "" ? longtitude : existingUser.longtitude;
      existingUser.countryName = countryName != "" ? countryName : existingUser.countryName;
      existingUser.fcmToken = fcmToken != "" ? fcmToken : existingUser.fcmToken;

      if (req.files.profilePic != undefined) {
        const elem = existingUser.profilePic;
        if (fs.existsSync(elem)) {
          fs.unlinkSync(elem);
        }
        existingUser.profilePic = req.files.profilePic[0].path;
      }

      updateSaved = await existingUser.save();

      if (updateSaved)
        res.status(200).json({ status: true, message: "Success." });
      else {
        res.status(200).json({ status: false, message: "Failed." });
      }
    } else {
      res
        .status(200)
        .json({ status: true, message: "User is not registered." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    var existingUser = await User.find()
      .limit(req.query.limit)
      .skip((req.query.pageNo - 1) * req.query.limit)
      .sort({ createdAt: -1 });
    var existingUserLength = await User.find();

    if (existingUser.length > 0) {
      res.status(200).json({
        status: true,
        message: "Success.",
        totalUser: existingUserLength.length,
        User: existingUser,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Success.",
        totalUser: existingUserLength.length,
        User: [],
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    var existingUser = await User.findOne({ _id: req.query.userId });

    if (existingUser) {
      var deletedUser = await User.deleteOne({ _id: req.query.userId });

      if (fs.existsSync(existingUser.profilePic[0])) {
        fs.unlinkSync(existingUser.profilePic[0]);
      }

      return res.status(200).json({ status: true, message: "Success!!" });
    } else {
      return res.status(200).json({ status: false, message: "Wrong Id received." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.userCheck = async (req, res) => {
  try {
    const { mono } = req.body;

    const existingUser = await User.findOne({ mono });

    if (existingUser) {
      return res.status(200).json({ status: true, message: "User found" });
    } else {
      return res.status(200).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

  
exports.getUser = async (req, res) => {
  try {
    var existingUser = await User.findOne({ mono: req.query.mono });

    if (existingUser) {
      res.status(200).json({
        status: true,
        message: "Success.",
        User: existingUser,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "User not found.",
        User: null,
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
