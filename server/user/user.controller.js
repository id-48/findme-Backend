const User = require("./user.model");
const Place = require("../place/place.model");
const fs = require("fs");
const Connection = require("../connection/connection.model");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const geolib = require("geolib");

exports.addUser = async (req, res) => {
  var {
    name,
    profilePic,
    bio,
    email,
    age,
    mono,
    countryName,
    address,
    countryCode,
    lastVisitedPlace,
    lattitude,
    longtitude,
    lastActivate,
    gender,
    languages,
    fcmToken,
  } = req.body;
  try {
    var existingUser = await User.findOne({ mono });

    if (existingUser) {
      return res
        .status(200)
        .json({ status: true, message: "User already exists." });
    }

    var newUser = new User({
      name: name || "",
      profilePic: profilePic || [],
      bio: bio || "",
      email: email || "",
      age: age || "",
      mono: mono || "",
      countryName: countryName || "",
      address: address || "",
      countryCode: countryCode || "",
      lastVisitedPlace: lastVisitedPlace || [],
      lattitude: lattitude || "",
      longtitude: longtitude || "",
      lastActivate: lastActivate || "",
      gender: gender || "",
      languages: languages || [],
      fcmToken: fcmToken || "",
    });

    if (req.files.profilePic) {
      newUser.profilePic = req.files.profilePic[0].path;
    }

    var userSaved = await newUser.save();

    if (userSaved) {
      const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET);

      return res
        .status(200)
        .json({ status: true, message: "User registered.", token: token });
    } else {
      return res.status(200).json({ status: false, message: "Failed." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  var {
    userId,
    name,
    profilePic,
    bio,
    email,
    age,
    mono,
    countryName,
    address,
    countryCode,
    lastVisitedPlace,
    lattitude,
    longtitude,
    lastActivate,
    gender,
    languages,
    fcmToken,
  } = req.body;

  try {
    var existingUser = await User.findOne({ _id: userId });

    if (existingUser) {
      existingUser.name = name != "" ? name : existingUser.name;
      existingUser.profilePic =
        profilePic != [] ? profilePic : existingUser.profilePic;
      existingUser.bio = bio != "" ? bio : existingUser.bio;
      existingUser.mono = mono != "" ? mono : existingUser.mono;
      existingUser.email = email != "" ? email : existingUser.email;
      existingUser.countryName = countryName != "" ? countryName : existingUser.countryName;
      existingUser.address = address != "" ? address : existingUser.address;
      existingUser.age = age != "" ? age : existingUser.age;
      existingUser.countryCode =
        countryCode != "" ? countryCode : existingUser.countryCode;
      existingUser.lastVisitedPlace =
        lastVisitedPlace != []
          ? lastVisitedPlace
          : existingUser.lastVisitedPlace;
      existingUser.lattitude =
        lattitude != "" ? lattitude : existingUser.lattitude;
      existingUser.longtitude =
        longtitude != "" ? longtitude : existingUser.longtitude;
      existingUser.lastActivate =
        lastActivate != "" ? lastActivate : existingUser.lastActivate;
      existingUser.gender = gender != "" ? gender : existingUser.gender;
      existingUser.languages =
        languages != [] ? languages : existingUser.languages;
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
      return res
        .status(200)
        .json({ status: false, message: "Wrong Id received." });
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
      const token = jwt.sign({ id: existingUser._id }, config.JWT_SECRET);
      return res
        .status(200)
        .json({ status: true, message: "User found", token: token });
    } else {
      return res.status(200).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
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
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getLocationWiseUser = async (req, res) => {
  try {
    const {
      radius,
      latitude,
      longitude,
      mono,
      limit,
      pageNo,
      ageMin,
      ageMax,
      gender,
    } = req.query;

    if (!radius || !latitude || !longitude) {
      return res
        .status(400)
        .json({ status: false, message: "Required parameters missing." });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const allUsers = await User.find();

    const allMobileNumbers = allUsers.map((user) => user.mono);

    const places = await Place.find({ mono: { $in: allMobileNumbers } });

    const placeNames = [...new Set(places.map((place) => place.placeName))];

    const nearbyUsers = allUsers.filter((user) => {
      const userLat = parseFloat(user.lattitude);
      const userLon = parseFloat(user.longtitude);
      const distance = geolib.getDistance(
        { latitude: lat, longitude: lon },
        { latitude: userLat, longitude: userLon }
      );
      return distance <= radius * 1000;
    });

    let filteredUsers = nearbyUsers;
    if (ageMin && ageMax) {
      filteredUsers = filteredUsers.filter(
        (user) => user.age >= ageMin && user.age <= ageMax
      );
    }

    if (gender && gender !== "Both") {
      filteredUsers = filteredUsers.filter((user) => user.gender === gender);
    }

    let paginatedUsers;

    if (!pageNo && !limit) {
      paginatedUsers = filteredUsers;
    } else {
      const startIdx = pageNo ? (pageNo - 1) * limit : 0;
      const endIdx = pageNo ? pageNo * limit : filteredUsers.length;
      paginatedUsers = filteredUsers.slice(startIdx, endIdx);
    }

    let currentUserId;
    if (mono) {
      const currentUser = await User.findOne({ mono });
      currentUserId = currentUser ? currentUser._id : null;
    } else {
      currentUserId = null;
    }

    if (currentUserId) {
      paginatedUsers = paginatedUsers.filter(
        (user) => String(user._id) !== String(currentUserId)
      );
    }

    const approvedConnections = await Connection.find({
      status: 'approved',
      $or: [{ senderId: currentUserId }, { reciverId: currentUserId }],
    });

    const connectedUserIds = approvedConnections.flatMap((connection) => [
      connection.senderId,
      connection.reciverId,
    ]);

    paginatedUsers = paginatedUsers.filter(
      (user) => !connectedUserIds.includes(String(user._id))
    );

    paginatedUsers.forEach((user) => {
      user.lastVisitedPlace = placeNames;
    });

    const pendingRequests = await Connection.find({
      reciverId: currentUserId,
      status: 'pending',
    });

    const senderIds = pendingRequests.map((request) => request.senderId);

    const senders = await User.find({ _id: { $in: senderIds } });

    const sendingRequestIds = senders.map((sender) => sender._id);

    const response = {
      status: true,
      message: "Success.",
      totalUser: paginatedUsers.length,
      currentUserId: currentUserId,
      user: paginatedUsers,
      sendingRequest: sendingRequestIds,
    };

    const response1 = {
      status: true,
      message: "Success.",
      currentUserId: currentUserId,
      user: paginatedUsers,
      sendingRequest: [],
    };

    res.status(200).json(!pageNo && !limit ? response1 : response);
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};


exports.sendUserActivity = async (req, res) => {
  try {
    const { userId, lastActivate, userStatus } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "userId is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    user.lastActivate = lastActivate;
    user.userStatus = userStatus;

    await user.save();

    res.status(200).json({
      status: true,
      message: "User activity updated successfully",
      user: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
