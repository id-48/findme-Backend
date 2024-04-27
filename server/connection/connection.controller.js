const Connection = require("./connection.model");

exports.addConnection = async (req, res) => {
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

    if (connectionSaved) {
      return res
        .status(200)
        .json({ status: true, message: "Send connection request." });
    } else {
      return res.status(200).json({ status: false, message: "Failed." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getUserWiseConnection = async (req, res) => {
  try {
    var allConnection = await Connection.find({ toId: req.query.toId });

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
    await Connection.findByIdAndUpdate(req.query.userId, { isrequest: true });

    const updatedUser = await Connection.findById(req.query.userId);

    return res.status(200).json({ status: true, message: "Friend added.", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
