const Connection = require("./connection.model");
const User = require("../user/user.model");
const {
  sendNotification,
  sendEmailNotification,
  addNotification
} = require("../../util/notificationManager");

exports.sendFriendRequest = async (req, res) => {
  var { senderId, reciverId, status } = req.body;
  try {
    var slug;
    var existingConnection = await Connection.findOne({
      reciverId: reciverId,
      senderId: senderId,
    });
    const senderUserName = await User.findById(senderId);
    const reciverEmail = await User.findById(reciverId);

    if (existingConnection) {
      return res
        .status(200)
        .json({ status: false, message: "Already sent connection request." });
    }

    var newConnection = new Connection({
      senderId: senderId || "",
      reciverId: reciverId || "",
      status: status || "",
    });

    var connectionSaved = await newConnection.save();

    if (connectionSaved) {
      slug = "Invitation";
      sendNotification(
        reciverId,
        senderUserName.name + " sent friend request.",
        slug  
      );
      sendEmailNotification(
        reciverEmail.email,
        "Sent friend request",
        senderUserName.name + " sent friend request."
      );

      await addNotification(senderUserName.profilePic[0], reciverEmail._id, senderUserName.name + " sent friend request.");

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

exports.receiveFriendRequest = async (req, res) => {
  const { userId } = req.query;

  try {
    const pendingRequests = await Connection.find({
      reciverId: userId,
      status: "pending",
    });

    if (!pendingRequests || pendingRequests.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "No pending friend requests found." });
    }

    const senderIds = pendingRequests.map((request) => request.senderId);

    const senders = await User.find({ _id: { $in: senderIds } });

    if (!senders || senders.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "No sender details found." });
    }

    return res
      .status(200)
      .json({
        status: true,
        message: "Pending friend requests found.",
        senders,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.makeFriend = async (req, res) => {
  const { senderId, reciverId, status } = req.body;

  try {
    let message = "";
    let updatedConnection;
    let slug;

    const connection = await Connection.findOne({ senderId, reciverId });
    const userName = await User.findById(reciverId);
    const senderEmail = await User.findById(senderId);

    if (!connection) {
      return res
        .status(404)
        .json({ status: false, message: "Friend request not found." });
    }

    connection.status = status;
    updatedConnection = await connection.save();

    if (status === "approved") {
      message =
        "Congratulations " + userName.name + " accepted your friend request.";
      slug = "Friend";

      sendNotification(senderId, message, slug);
      
      await addNotification(userName.profilePic[0], senderEmail._id, message);

      sendEmailNotification(
        senderEmail.email,
        "Your friend request accepted",
        message
      );
    } else if (status === "rejected"  || status === "unfollow" ) {
      if(status == "rejected"){
      message = userName.name + " rejected your friend request.";
      slug = "Home";
      sendNotification(senderId, message, slug);

      await addNotification(userName.profilePic[0], senderEmail._id, message);

      sendEmailNotification(
        senderEmail.email,
        "Your friend request rejected",
        message
      );
      }

      await Connection.deleteOne({ senderId, reciverId });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid status." });
    }

    return res.status(200).json({ status: true, message, updatedConnection });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.friendList = async (req, res) => {
  const { userId } = req.query;

  try {
    const connections = await Connection.find({
      $or: [{ senderId: userId }, { reciverId: userId }],
      status: "approved",
    });

    if (!connections || connections.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "No friend connections found." });
    }

    const friendIds = connections.map((connection) => {
      return connection.senderId === userId
        ? connection.reciverId
        : connection.senderId;
    });

    const friends = await User.find({ _id: { $in: friendIds } });

    if (!friends || friends.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "No friends found." });
    }

    return res
      .status(200)
      .json({ status: true, message: "Friend list found.", friends });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
