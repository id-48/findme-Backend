const User = require("./user.model");
const Connection = require("../connection/connection.model");
const Event = require("../event/event.model");
const Place = require("../place/place.model");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const config = require("../../config");
const geolib = require("geolib");
const mongoose = require("mongoose");


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
    var existingUser = req.user;

    if (existingUser) {
      existingUser.name = name != "" ? name : existingUser.name;
      existingUser.profilePic =
        profilePic != [] ? profilePic : existingUser.profilePic;
      existingUser.bio = bio != "" ? bio : existingUser.bio;
      existingUser.mono = mono != "" ? mono : existingUser.mono;
      existingUser.email = email != "" ? email : existingUser.email;
      existingUser.countryName =
        countryName != "" ? countryName : existingUser.countryName;
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
    var existingUser = req.user;

    if (existingUser) {
      var deletedUser = req.user;

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
      status: "approved",
      $or: [{ senderId: currentUserId }, { reciverId: currentUserId }],
    });

    ///Giving SenderId List of Data

    const pendingRequests = await Connection.find({
      reciverId: currentUserId,
      status: "pending",
    });

    const senderIds = pendingRequests.map((request) => request.senderId);

    const senders = await User.find({ _id: { $in: senderIds } });

    const sendingRequestIds = senders.map((sender) => sender._id);

    ///Sending Request After Removeing Data
    const sendercurrentRequests = await Connection.find({
      senderId: currentUserId,
      status: "pending",
    });

    const reciverIds = sendercurrentRequests.map(
      (request) => request.reciverId
    );

    const recivers = await User.find({ _id: { $in: reciverIds } });

    const reciversRequestIds = recivers.map((reciver) =>
      reciver._id.toString().replace(/ObjectId\('|'\)/g, "")
    );

    paginatedUsers = paginatedUsers.filter(
      (user) => !reciversRequestIds.includes(String(user._id))
    );

    ///Make Friend After Removeing Data
    const connectedUserIds = approvedConnections.flatMap((connection) => [
      connection.senderId,
      connection.reciverId,
    ]);

    paginatedUsers = paginatedUsers.filter(
      (user) => !connectedUserIds.includes(String(user._id))
    );

    const response = {
      status: true,
      message: "Success.",
      totalUser: connectedUserIds.length,
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
    const { lastActivate, userStatus } = req.body;

    const user = await User.findById(req.user);

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

exports.getPeopleMayKnow = async (req, res) => {
  const {
    radius,
    latitude,
    longitude,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const { suggestedUsers, totalSuggestedUsers } = await getMutualConnections(req.user);

    let nearbyUsers = [];
    if (latitude && longitude && radius) {
      nearbyUsers = await locationWiseUserData(latitude, longitude, radius);

      // Remove duplicates by checking if the user is already in suggestedUsers
      const suggestedUserIds = new Set(
        suggestedUsers.map((user) => user._id.toString())
      );
      nearbyUsers = nearbyUsers.filter(
        (user) => !suggestedUserIds.has(user._id.toString())
      );
    }

    // Combine the lists and remove duplicates
    const finalData = [...suggestedUsers, ...nearbyUsers];
    const uniqueFinalData = Array.from(
      new Set(finalData.map((user) => user._id.toString()))
    ).map((id) => finalData.find((user) => user._id.toString() === id));

    // Remove the specific user from the final list
    const filteredData = uniqueFinalData.filter(
      (user) => user._id.toString() !== req.user
    );

    ///Giving SenderId List of Data
    const pendingRequests = await Connection.find({
      senderId: req.user,
      status: "pending",
    });
    const senderIds = pendingRequests.map((request) => request.reciverId);
    const senders = await User.find({ _id: { $in: senderIds } });
    const sendingRequestIds = senders.map((sender) => sender._id.toString());

    ///Giving reciveRequestedIds List of Data
    const pendingRequests1 = await Connection.find({
      reciverId: req.user,
      status: "pending",
    });
    const reciverIds = pendingRequests1.map((request) => request.senderId);
    const recivers = await User.find({ _id: { $in: reciverIds } });
    const reciversRequestIds = recivers.map((reciver) =>
      reciver._id.toString()
    );

    // Combine sendingRequestIds and reciversRequestIds into a set
    const idsToRemove = new Set([...sendingRequestIds, ...reciversRequestIds]);

    // Filter filteredData to remove users with IDs in idsToRemove
    const filteredPaginatedData = filteredData.filter(
      (user) => !idsToRemove.has(user._id.toString())
    );

    // Find connections
    const connections = await Connection.find({
      $or: [{ senderId: req.user }, { reciverId: req.user }],
      status: "approved",
    });

    // Extract the IDs of the connections
    const connectionIds = new Set(connections.map((conn) => {
      return conn.senderId.toString() === req.user ? conn.reciverId.toString() : conn.senderId.toString();
    }));

    // Further filter the paginatedData to remove users with IDs in connectionIds
    const finalFilteredData = filteredPaginatedData.filter(
      (user) => !connectionIds.has(user._id.toString())
    );

    // Pagination logic
    const totalResults = finalFilteredData.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = finalFilteredData.slice(startIndex, endIndex);

    res.status(200).json({
      status: true,
      message:
        paginatedData.length > 0
          ? "People you may know."
          : "No suggestions available.",
      totalSuggestedUsers: totalResults,
      suggestedUsers: paginatedData,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalResults / limit),
      sendingRequest: sendingRequestIds,
      reciveRequestedIds: reciversRequestIds,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

const getMutualConnections = async (userId) => {
  // Fetch the user's friends
  const connections = await Connection.find({
    $or: [{ senderId: userId }, { reciverId: userId }],
    status: "approved",
  });

  const friendIds = connections.map((connection) => {
    return connection.senderId === userId
      ? connection.reciverId
      : connection.senderId;
  });

  // Fetch friends of friends
  const friendsOfFriendsConnections = await Connection.find({
    $or: [{ senderId: { $in: friendIds } }, { reciverId: { $in: friendIds } }],
    status: "approved",
  });

  const friendsOfFriendsIds = friendsOfFriendsConnections.map((connection) => {
    return connection.senderId === userId ||
      friendIds.includes(connection.senderId)
      ? connection.reciverId
      : connection.senderId;
  });

  // Exclude the user's friends and the user itself
  const excludeIds = friendIds.concat(userId);

  // Find users who are friends of friends but not in the user's friend list
  const suggestedUsers = await User.find({
    _id: { $in: friendsOfFriendsIds, $nin: excludeIds },
  }).sort({ lastActivate: -1 }); // Suggest based on recent activity

  // Total count of suggested users
  const totalSuggestedUsers = suggestedUsers.length;

  return { suggestedUsers, totalSuggestedUsers };
};

const locationWiseUserData = async (latitude, longitude, radius) => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  const allUsers = await User.find();

  const nearbyUsers = allUsers.filter((user) => {
    if (user.lattitude && user.longtitude) {
      const userLat = parseFloat(user.lattitude);
      const userLon = parseFloat(user.longtitude);
      const distance = geolib.getDistance(
        { latitude: lat, longitude: lon },
        { latitude: userLat, longitude: userLon }
      );
      return distance <= radius * 1000; // radius in kilometers
    }
    return false;
  });

  return nearbyUsers;
};

exports.searchUser = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const { currentUserId } = req.query;

    if (!searchQuery) {
      return res.status(400).json({
        status: false,
        message: "Search query is required.",
      });
    }

    const eventCriteria = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const placeCriteria = {
      $or: [
        { placeName: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
        { placeDescription: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const userCriteria = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { bio: { $regex: searchQuery, $options: "i" } },
        { countryName: { $regex: searchQuery, $options: "i" } },
        { address: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const [events, places, usersFromSearch] = await Promise.all([
      Event.find(eventCriteria).select("mono"),
      Place.find(placeCriteria).select("mono"),
      User.find(userCriteria),
    ]);

    const monoNumbers = new Set();
    events.forEach((event) => monoNumbers.add(event.mono));
    places.forEach((place) => monoNumbers.add(place.mono));

    const usersFromMono = await User.find({
      mono: { $in: Array.from(monoNumbers) },
    });

    const uniqueUsers = [
      ...new Map(
        [...usersFromSearch, ...usersFromMono].map((user) => [
          user._id.toString(),
          user,
        ])
      ).values(),
    ];

    /// Giving SenderId List of Data
    const pendingRequests = await Connection.find({
      senderId: currentUserId,
      status: "pending",
    });

    const senderIds = pendingRequests.map((request) => request.reciverId);
    const senders = await User.find({ _id: { $in: senderIds } });
    const sendingRequestIds = senders.map((sender) => sender._id);

    /// Giving reciveRequestedIds List of Data
    const pendingRequests1 = await Connection.find({
      reciverId: currentUserId,
      status: "pending",
    });

    const reciverIds = pendingRequests1.map((request) => request.senderId);
    const recivers = await User.find({ _id: { $in: reciverIds } });
    const reciversRequestIds = recivers.map((reciver) => reciver._id);

    // Find connections
    const connections = await Connection.find({
      $or: [{ senderId: currentUserId }, { reciverId: currentUserId }],
      status: "approved",
    });

    // Get the IDs of connected users
    const connectedUserIds = new Set(
      connections.map((conn) =>
        conn.senderId.toString() === currentUserId
          ? conn.reciverId.toString()
          : conn.senderId.toString()
      )
    );

    // Pagination logic
    const limit = parseInt(req.query.limit) || 10;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const startIndex = (pageNo - 1) * limit;
    const endIndex = startIndex + limit;

    // Filter paginatedUsers to remove users with IDs in connectedUserIds
    const filteredUsers = uniqueUsers.filter(
      (user) => !connectedUserIds.has(user._id.toString())
    );

    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.status(200).json({
      status: true,
      message: "Success.",
      totalUser: paginatedUsers.length,
      users: paginatedUsers,
      sendingRequestedIds: sendingRequestIds,
      reciveRequestedIds: reciversRequestIds,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

exports.filterUser = async (req, res) => {
  try {
    var { address, gender, startDate, endDate, limit, pageNo } =
      req.query;

    if (startDate && !endDate) {
      endDate = startDate;
    }

    const userFilter = {};
    if (address) {
      userFilter.address = {$regex: `${address}`,$options: "i"};
    }
    if (gender) {
      userFilter.gender = gender;
    }

    let eventMonos = [];
    if (startDate) {
      let eventQuery = {
        eventDate: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      const events = await Event.find(eventQuery);
      eventMonos = events.map((event) => event.mono);
    }

    if (eventMonos.length > 0) {
      userFilter.mono = { $in: eventMonos };
    }

    const filteredUsers = await User.find(userFilter).sort({ createdAt: -1 });
    const totalFilteredUsers = await User.countDocuments(userFilter);

    const currentUserId = new mongoose.Types.ObjectId(req.user);

    // Remove the specific user from the filtered users list
    const filteredUsersWithoutSpecifiedUser = filteredUsers.filter(
      (user) => user._id.toString() !== req.user
    );

    ///Giving SenderId List of Data
    const pendingRequests = await Connection.find({
      senderId: currentUserId,
      status: "pending",
    });
    const senderIds = pendingRequests.map((request) => request.reciverId);
    const senders = await User.find({ _id: { $in: senderIds } });
    const sendingRequestIds = senders.map((sender) => sender._id);

    ///Giving reciveRequestedIds List of Data
    const pendingRequests1 = await Connection.find({
      reciverId: currentUserId,
      status: "pending",
    });
    const reciverIds = pendingRequests1.map((request) => request.senderId);
    const recivers = await User.find({ _id: { $in: reciverIds } });
    const reciversRequestIds = recivers.map((reciver) => reciver._id);

    // Find connections
    const connections = await Connection.find({
      $or: [{ senderId: currentUserId }, { reciverId: req.user }],
      status: "approved",
    });

    // Extract user IDs from connections
    const connectionIds = connections.map((connection) =>
      connection.senderId.toString() === req.user
        ? connection.reciverId.toString()
        : connection.senderId.toString()
    );

    // Apply pagination after filtering the specific user
    let paginatedUsers = filteredUsersWithoutSpecifiedUser.slice(
      (parseInt(pageNo) - 1) * parseInt(limit),
      parseInt(pageNo) * parseInt(limit)
    );

    // Filter paginatedUsers to remove users with IDs in connectionIds
    paginatedUsers = paginatedUsers.filter(
      (user) => !connectionIds.includes(user._id.toString())
    );

    res.status(200).json({
      status: true,
      message:
        paginatedUsers.length > 0
          ? "Success."
          : "No users found with given filters.",
      totalUser: paginatedUsers.length,
      users: paginatedUsers,
      sendingRequestedIds: sendingRequestIds,
      reciveRequestedIds: reciversRequestIds,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
