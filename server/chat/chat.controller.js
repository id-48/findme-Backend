const { getIO } = require("../../chatSocket"); 
const Chat = require("../chat/chat.model");

// Get all users who chat with each other
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate('senderId receiverId');
    res.status(200).json({ status: true, chats });

    // Emit event to update clients with new chat list
    getIO().emit('allChats', chats);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message || 'Server Error' });
  }
};

// Send user message
// exports.sendMessage = async (req, res) => {
//   const { senderId, receiverId, message } = req.body;

//   try {
//     const newChat = new Chat({ senderId, receiverId, message });
//     await newChat.save();
//     res.status(200).json({ status: true, message: 'Message sent successfully.' });

//     // Emit event to update specific user with new message
//     getIO().to(receiverId).emit('newMessage', newChat);
//   } catch (error) {
//     res.status(500).json({ status: false, error: error.message || 'Server Error' });
//   }
// };

// // Get one-to-one user messages list
// exports.getMessages = async (req, res) => {
//   const { senderId, receiverId } = req.query;

//   try {
//     const messages = await Chat.find({
//       $or: [
//         { senderId: senderId, receiverId: receiverId },
//         { senderId: receiverId, receiverId: senderId }
//       ]
//     }).sort({ createdAt: 1 });

//     res.status(200).json({ status: true, messages });

//     // Emit event to update specific user with messages list
//     getIO().to(senderId).emit('messagesList', messages);
//   } catch (error) {
//     res.status(500).json({ status: false, error: error.message || 'Server Error' });
//   }
// };


exports.sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
  
    try {
      const newChat = new Chat({ senderId, receiverId, message });
      await newChat.save();
      res.status(200).json({ status: true, message: 'Message sent successfully.' });
  
      // Emit event to update specific user with new message
      getIO().to(receiverId).emit('newMessage', newChat);
  
      // Join a room for one-to-one messaging
      const roomName = `${senderId}-${receiverId}`;
      getIO().emit('joinRoom', roomName);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message || 'Server Error' });
    }
  };
  
  // Get one-to-one user messages list
  exports.getMessages = async (req, res) => {
    const { senderId, receiverId } = req.query;
  
    try {
      // Join the common room for one-to-one messaging
      const roomName = `${senderId}-${receiverId}`;
      getIO().emit('joinRoom', roomName);
  
      const messages = await Chat.find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }).sort({ createdAt: 1 });
  
      res.status(200).json({ status: true, messages });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message || 'Server Error' });
    }
  };