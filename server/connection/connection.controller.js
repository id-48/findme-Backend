const Connection = require("./connection.model");
const User = require("../user/user.model");
const { sendNotification  } = require('../../util/notificationManager');

exports.sendFriendRequest = async (req, res) => {
    var {
      senderId,
      reciverId,
      status,
    } = req.body;
    try {
      var existingConnection = await Connection.findOne({reciverId: reciverId, senderId: senderId});

      if (existingConnection) {
        return res
          .status(200)
          .json({ status: false, message: "Already sended connection request." });
      }

      var newConnection = new Connection({
        senderId: senderId || "",
        reciverId: reciverId || "",
        status: status || "",
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

exports.receiveFriendRequest = async (req, res) => {
  const { userId } = req.query;

  try {
    const pendingRequests = await Connection.find({ reciverId: userId, status: 'pending' });

    if (!pendingRequests || pendingRequests.length === 0) {
      return res.status(200).json({ status: false, message: 'No pending friend requests found.' });
    }

    const senderIds = pendingRequests.map(request => request.senderId);

    const senders = await User.find({ _id: { $in: senderIds } });

    if (!senders || senders.length === 0) {
      return res.status(200).json({ status: false, message: 'No sender details found.' });
    }

    return res.status(200).json({ status: true, message: 'Pending friend requests found.', senders });
    
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || 'Server Error' });
  }
};

exports.makeFriend = async (req, res) => {
  const { senderId, reciverId, status } = req.body;

  try {
    let message = '';
    let updatedConnection;

    const connection = await Connection.findOne({ senderId, reciverId});

    if (!connection) {
      return res.status(404).json({ status: false, message: 'Friend request not found.' });
    }

    connection.status = status;
    updatedConnection = await connection.save();

    if (status === 'approved') {
      message = 'Friend request approved.';
      sendNotification(reciverId, message);
    } else if (status === 'rejected') {
      message = 'Friend request rejected.';
      sendNotification(reciverId, message);
      await Connection.deleteOne({ senderId, reciverId });
    } else {
      return res.status(400).json({ status: false, message: 'Invalid status.' });
    }

    return res.status(200).json({ status: true, message, updatedConnection });
    
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || 'Server Error' });
  }
};


exports.friendList = async (req, res) => {
  const { userId } = req.query;

  try {
    const connections = await Connection.find({
      $or: [{ senderId: userId }, { reciverId: userId }],
      status: 'approved'
    });

    if (!connections || connections.length === 0) {
      return res.status(200).json({ status: false, message: 'No friend connections found.' });
    }

    const friendIds = connections.map(connection => {
      return connection.senderId === userId ? connection.reciverId : connection.senderId;
    });

    const friends = await User.find({ _id: { $in: friendIds } });

    if (!friends || friends.length === 0) {
      return res.status(200).json({ status: false, message: 'No friends found.' });
    }

    return res.status(200).json({ status: true, message: 'Friend list found.', friends });
    
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || 'Server Error' });
  }
};
