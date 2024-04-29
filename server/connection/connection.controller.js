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
    fromUserId,
    toId,
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
    // Check if a connection request has already been sent
    const existingConnection = await Connection.findOne({ fromUserId, toId });

    if (existingConnection) {
      return res.status(200).json({ status: false, message: "Friend request already sent." });
    }

    // Create a new connection request
    const newConnection = new Connection({
      fromUserId: fromUserId || "",
      toId: toId || "",
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

// API to receive friend requests
exports.receiveFriendRequests = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a parameter

  try {
    // Find all pending friend requests where the receiver is the current user
    const friendRequests = await Connection.find({ toId: userId, status: "pending" });

    if (friendRequests || friendRequests.length === 0) {
      return res.status(200).json({ status: true, message: "No pending friend requests found." });
    }

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
      await connection.remove();
      return res.status(200).json({ status: true, message: "Friend request rejected." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};