const Notification = require("./notification.model");

exports.getNotification = async (req, res) => {
  try {
    var notification = await Notification.find({userId: req.query.userId})
      .limit(req.query.limit)
      .skip((req.query.pageNo - 1) * req.query.limit)
      .sort({ createdAt: -1 });
    var notificationLength = await Notification.find();

    if (notification.length > 0) {
      res.status(200).json({
        status: true,
        message: "Success.",
        totalNotification: notificationLength.length,
        notification: notification,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Success.",
        totalUser: notificationLength.length,
        User: [],
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(400).json({ status: false, message: "User ID is required" });
    }

    const result = await Notification.updateMany(
      { userId: req.query.userId, isRead: false },
      { $set: { isRead: true } }
    );

    if (result) { 
      res.status(200).json({
        status: true,
        message: "Notifications marked as read successfully.",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "No unread notifications found for this user.",
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

exports.notificationCount = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(400).json({ status: false, message: "User ID is required" });
    }

    const unreadCount = await Notification.countDocuments({
      userId: req.query.userId,
      isRead: false
    });

    res.status(200).json({
      status: true,
      message: "Unread notifications count retrieved successfully.",
      unreadCount: unreadCount
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};