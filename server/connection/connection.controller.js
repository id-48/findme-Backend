// const Connection = require("./connection.model");

// exports.sendConnection = async (req, res) => {
//   var {
//     fromUserId,
//     toId,
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
//     var existingConnection = await Connection.findOne();

//     // if (existingConnection) {
//     //   return res
//     //     .status(200)
//     //     .json({ status: false, message: "Already sended connection request." });
//     // }

//     var newConnection = new Connection({
//       fromUserId: fromUserId || "",
//       toId: toId || "",
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

//     var connectionSaved = await newConnection.save();

//     for (let i = 0; i < connectionSaved.length; i++) {
//       const element = connectionSaved[i];
//       if (element.fromUserId == existingConnection.fromUserId && element.toId == existingConnection.toId ) {
//         return res
//         .status(200)
//         .json({ status: true, message: "Already send request." });
//       } else {
//         if (connectionSaved) {
//           return res
//             .status(200)
//             .json({ status: true, message: "Send connection request." });
//         } else {
//           return res.status(200).json({ status: false, message: "Failed." });
//         }
//       }
      
//     }

    
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ status: false, error: error.message || "Server Error" });
//   }
// };

// exports.getUserWiseConnection = async (req, res) => {
//   try {
//     var allConnection = await Connection.find({ fromUserId: req.query.fromUserId });

//     if (allConnection.length > 0) {
//       res.status(200).json({
//         status: true,
//         message: "Success.",
//         connection: allConnection,
//       });
//     } else {
//       res.status(200).json({
//         status: false,
//         message: "Connection not found.",
//         connection: [],
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({ status: false, error: error.message || "Server Error" });
//   }
// };


// exports.addFriend = async (req, res) => {
//   try {
//     const userId = req.query.userId;

//     if (!userId) {
//       return res.status(400).json({ status: false, message: "Please enter UserId" });
//     }

//     const existingUser = await Connection.findById(userId);
//     if (!existingUser) {
//       return res.status(400).json({ status: false, message: "Wrong Id received." });
//     }

//     await Connection.findByIdAndUpdate(userId, { isrequest: true });

//     const updatedUser = await Connection.findById(userId);

//     return res.status(200).json({ status: true, message: "Friend added." });
//   } catch (error) {
//     return res.status(500).json({ status: false, error: error.message || "Server Error" });
//   }
// };

// exports.removeRequest = async (req, res) => {
//   try {
//     const userId = req.query.userId;

//     if (!userId) {
//       return res.status(400).json({ status: false, message: "Please enter UserId" });
//     }

//     const existingUser = await Connection.findById(userId);
//     if (!existingUser) {
//       return res.status(400).json({ status: false, message: "Wrong Id received." });
//     }
//     var removeRequest = await Connection.deleteOne({ _id: userId });


//     return res.status(200).json({ status: true, message: "Success" });
//   } catch (error) {
//     return res.status(500).json({ status: false, error: error.message || "Server Error" });
//   }
// };

// exports.friendList = async (req, res) => {
//   try {
//     const { fromUserId } = req.query;
//     const filteredConnections = await Connection.find({ fromUserId, toId, isrequest: true });

//     if (filteredConnections.length > 0) {
//       res.status(200).json({
//         status: true,
//         message: "Success.",
//         connections: filteredConnections,
//       });
//     } else {
//       res.status(200).json({
//         status: false,
//         message: "No connections found.",
//         connections: [],
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({ status: false, error: error.message || "Server Error" });
//   }
// };

const Connection = require("./connection.model");

exports.sendFriendRequest = async (req, res) => {
  const {
    from,
    to // Assuming status is also part of your request body
  } = req.body;

  try {
    // Check if a connection request has already been sent
    const existingConnection = await Connection.findOne({ 'from.mono': from.fromUserId, 'to.mono': to.toId });

    if (existingConnection) {
      return res.status(200).json({ status: false, message: "Friend request already sent." });
    }

    // Create a new connection request
    const newConnection = new Connection({
      from: {
        fromId: from.fromId || "",
        firstName: from.firstName || "",
        lastName: from.lastName || "",
        userName: from.userName || "",
        profilePic: from.profilePic || [],
        mono: from.mono || "",
        countryCode: from.countryCode || "",
        address: from.address || "",
        latitude: from.latitude || "",
        longitude: from.longitude || "",
        countryName: from.countryName || "",
        fcmToken: from.fcmToken || "",
      },
      to: {
        toId: to.toId || "",
        firstName: to.firstName || "",
        lastName: to.lastName || "",
        userName: to.userName || "",
        profilePic: to.profilePic || [],
        mono: to.mono || "",
        countryCode: to.countryCode || "",
        address: to.address || "",
        latitude: to.latitude || "",
        longitude: to.longitude || "",
        countryName: to.countryName || "",
        fcmToken: to.fcmToken || "",
      },
    });

    // Save the connection request
    const connectionSaved = await newConnection.save();

    if (connectionSaved) {
      return res.status(200).json({ status: true, message: "Friend request sent successfully." });
    } else {
      return res.status(200).json({ status: false, message: "Failed to send friend request." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// // API to receive friend requests
// exports.receiveFriendRequests = async (req, res) => {
//   const { toId } = req.query; // Assuming userId is passed as a parameter

//   try {
//     // Find all pending friend requests where the receiver is the current user
//     const friendRequests = await Connection.find({ toId: toId, status: "pending" });

//     if (!friendRequests) {
//       return res.status(200).json({ status: true, message: "No pending friend requests found." });
//     }

//     return res.status(200).json({ status: true, friendRequests});
//   } catch (error) {
//     return res.status(500).json({ status: false, error: error.message || "Server Error" });
//   }
// };

exports.receiveFriendRequests = async (req, res) => {
  const { toId } = req.query; // Assuming userId is part of the request parameters

  try {
    // Retrieve pending friend requests where the 'to' field matches the userId
    const friendRequests = await Connection.find({ "to.toId": toId, status: 'pending' });

    return res.status(200).json({ status: true, friendRequests });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};


// API to approve or reject friend request
exports.respondToFriendRequest = async (req, res) => {
  const { connectionId, approval } = req.body;

  try {
    // Find the connection request
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ status: false, message: "Friend request not found." });
    }

    if (approval) {
      // If approved, update the status to "approved" and add the connection in both users' friend lists
      connection.status = "approved";
      await connection.save();

      // Here you can add logic to update friend lists of both users
      // For example, update the friend list of the user who initiated the request (fromUserId)
      // and also update the friend list of the user who received the request (toId)
      
      return res.status(200).json({ status: true, message: "Friend request approved." });
    } else {
      // If rejected, delete the connection request
      connection.status = "rejected";
      await connection.remove();
      return res.status(200).json({ status: true, message: "Friend request rejected." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};


// API to get all friends of a user
exports.getAllFriends = async (req, res) => {
  const { userId } = req.query;

  try {
    // Find all connections where the status is "approved" and either fromUserId or toId matches the user's ID
    const userFriends = await Connection.find({
      $and: [
        { status: "approved" },
        { $or: [{ fromUserId: userId }, { toId: userId }] }
      ]
    });

    if (!userFriends || userFriends.length === 0) {
      return res.status(200).json({ status: true, message: "No friends found for this user." });
    }

    // Extract friend details (excluding the current user's details) and return
    const friendsList = userFriends.map(connection => {
      return {
        userId: connection.fromUserId !== userId ? connection.fromUserId : connection.toId,
        firstName: connection.firstName,
        lastName: connection.lastName,
        userName: connection.userName,
        profilePic: connection.profilePic,
        mono: connection.mono,
        countryCode: connection.countryCode,
        address: connection.address,
        latitude: connection.latitude,
        longitude: connection.longitude,
        countryName: connection.countryName,
        fcmToken: connection.fcmToken
      };
    });

    return res.status(200).json({ status: true, friendsList });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
