const Connection = require("./connection.model");

exports.sendConnection = async (req, res) => {
  var {
    fromUserId,
    toId,
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
    var existingConnection = await Connection.findOne({ fromUserId });

    if (existingConnection) {
      return res
        .status(200)
        .json({ status: false, message: "Already sended connection request." });
    }

    var newConnection = new Connection({
      fromUserId: fromUserId || "",
      toId: toId || "",
      firstName: firstName || "",
      lastName: lastName || "",
      userName: userName || "",
      profilePic: profilePic || [],
      mono: mono || "",
      countryCode: countryCode || "",
      address: address || "",
      lattitude: lattitude || "",
      longtitude: longtitude || "",
      countryName: countryName || "",
      fcmToken: fcmToken || "",
    });

    var connectionSaved = await newConnection.save();

    for (let i = 0; i < connectionSaved.length; i++) {
      const element = connectionSaved[i];
      if (element.fromUserId == connectionSaved.fromUserId && element.toId == connectionSaved.toId ) {
        return res
        .status(200)
        .json({ status: true, message: "Already send request." });
      } else {
        if (connectionSaved) {
          return res
            .status(200)
            .json({ status: true, message: "Send connection request." });
        } else {
          return res.status(200).json({ status: false, message: "Failed." });
        }
      }
      
    }

    
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getUserWiseConnection = async (req, res) => {
  try {
    var allConnection = await Connection.find({ fromUserId: req.query.fromUserId });

    if (allConnection.length > 0) {
      res.status(200).json({
        status: true,
        message: "Success.",
        connection: allConnection,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Connection not found.",
        connection: [],
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};


exports.addFriend = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ status: false, message: "Please enter UserId" });
    }

    const existingUser = await Connection.findById(userId);
    if (!existingUser) {
      return res.status(400).json({ status: false, message: "Wrong Id received." });
    }

    await Connection.findByIdAndUpdate(userId, { isrequest: true });

    const updatedUser = await Connection.findById(userId);

    return res.status(200).json({ status: true, message: "Friend added." });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

exports.removeRequest = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ status: false, message: "Please enter UserId" });
    }

    const existingUser = await Connection.findById(userId);
    if (!existingUser) {
      return res.status(400).json({ status: false, message: "Wrong Id received." });
    }
    var removeRequest = await Connection.deleteOne({ _id: userId });


    return res.status(200).json({ status: true, message: "Success" });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

exports.friendList = async (req, res) => {
  try {
    const { fromUserId } = req.query;
    const filteredConnections = await Connection.find({ fromUserId, isrequest: true });

    if (filteredConnections.length > 0) {
      res.status(200).json({
        status: true,
        message: "Success.",
        connections: filteredConnections,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "No connections found.",
        connections: [],
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
