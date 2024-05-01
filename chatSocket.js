const socketIo = require("socket.io");

let io;

function initializeSocket(server) {
  io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    // Add more event handlers here as needed for different functionalities
    // For example:
    // socket.on("sendMessage", (data) => { ... });
    // socket.on("joinRoom", (roomName) => { ... });
    // socket.on("typing", (data) => { ... });
    // etc.
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized.");
  }
  return io;
}

module.exports = {
  initializeSocket,
  getIO,
  io, // Export io object directly if needed elsewhere
};
