const ChatTopic = require("./chatTopic.model");
const User = require("../user/user.model");

//Create Chat topic
exports.store = async (req, res) => {
  try {
    if (!req.body.senderId || !req.body.reciverId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!!" });

    const reciver = await User.findById(req.body.reciverId);
    if (!reciver) {
      return res
        .status(200)
        .json({ status: "false", message: "Reciver does not Exist!!" });
    }

    const sender = await User.findById(req.body.senderId);
    if (!sender)
      return res
        .status(200)
        .json({ status: false, message: "Sender does not Exist!!" });

    const chatTopic = await ChatTopic.findOne({
      $and: [{ reciverId: reciver._id }, { senderId: sender._id }],
    });

    if (chatTopic) {
      return res
        .status(200)
        .json({ status: true, message: "Success!!", chatTopic });
    }

    const newChatTopic = new ChatTopic();

    newChatTopic.reciverId = reciver._id;
    newChatTopic.senderId = sender._id;

    await newChatTopic.save();

    return res.status(200).json({
      status: true,
      message: "Success!!",
      chatTopic: newChatTopic,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

