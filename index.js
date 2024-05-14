const express = require("express");
const ChatTopic = require("./server/chatTopic/chatTopic.model");
const mongoose = require("mongoose");
const app = express();
const config = require("./config");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

//Socket.io Server
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
module.exports = io;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//To store data images, videos
app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static(path.join(__dirname, "storage")));

//Parser
app.use(bodyParser.json());

// User route
const User = require("./server/user/user.route");
app.use("/users", User);

// Event route
const Event = require("./server/event/event.route");
app.use("/events", Event);

// Places route
const Places = require("./server/place/place.route");
app.use("/places", Places);

// Connection route
const Connection = require("./server/connection/connection.route");
app.use("/connection", Connection);

// Chat route
const Chat = require("./server/chat/chat.route");
app.use("/chat", Chat);

// ChatToppic route
const ChatToppic = require("./server/chatTopic/chatTopic.route");
app.use("/chatTopic", ChatToppic);

//mongodb connection
mongoose.connect(config.MONGOOSE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("MONGO: successfully connected to db");
});

// ==================== Socket.io Start ===============================

io.on("connect", async (socket) => {
  console.log("Socket Connect Successfully!!");

  //ChatRoom Socket
  const { chatRoom } = socket.handshake.query;
  console.log("------chatRoom------66", chatRoom);

  //socket join into room
  socket.join(chatRoom);

  console.log("chatRoom ============== 71", chatRoom);

  //Chat Socket event
  socket.on("chat", async (data) => {
    console.log("data in chat socket", data);

    if (data.messageType == 3) {
      const chatTopic = await ChatTopic.findById(data.topicId).populate(
        "senderId reciverId"
      );

      let receiverId, senderId, type;

      if (chatTopic.reciverId._id.toString() === data.senderId.toString()) {
        senderId = chatTopic.reciverId;
        receiverId = chatTopic.senderId;
        type = "reciver";
      } else if (chatTopic.reciverId._id.toString() === data.senderId.toString()) {
        senderId = chatTopic.senderId;
        receiverId = chatTopic.reciverId;
        type = "sender";
      }

      console.log("---------chatTopic-----", chatTopic);
      
      if (chatTopic) {
        const chat = new Chat();

        chat.senderId = data.senderId;
        chat.messageType = 3;
        chat.message = data.message;
        chat.image = null;
        chat.audio = null;
        chat.video = null;
        chat.type = data.type;
        chat.topicId = chatTopic._id;
        chat.date = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });

        await chat.save();

        chatTopic.chat = chat._id;
        await chatTopic.save();

        console.log("--------2.emit chat event------");

        io.in(chatRoom).emit("chat", chat);

        // //notification related
        // if (receiverId && !receiverId.isBlock) {
        //   const payload = {
        //     to: receiverId.fcm_token,
        //     notification: {
        //       body: chat.message,
        //       title: senderId.name,
        //     },
        //     data:
        //       type === "user"
        //         ? {
        //             topic: chatTopic._id,
        //             message: chat.message,
        //             date: chat.date,
        //             chatDate: chat.date,
        //             _id: senderId._id,
        //             name: senderId.name,
        //             username: senderId.username,
        //             image: senderId.image,
        //             country: senderId.country,
        //             time: "Just Now",
        //             type: "MESSAGE",
        //           }
        //         : {
        //             topic: chatTopic._id,
        //             message: chat.message,
        //             date: chat.date,
        //             chatDate: chat.date,
        //             _id: senderId._id,
        //             name: senderId.name,
        //             image: senderId.image,
        //             country: senderId.country,
        //             time: "Just Now",
        //             type: "MESSAGE",
        //           },
        //   };
        //   await fcm.send(payload, function (err, response) {
        //     if (err) {
        //       console.log("Something has gone wrong!!", err);
        //     } else {
        //       console.log("Notification sent successfully:", response);
        //     }
        //   });
        // }
      }
    } else {
      console.log("------3.emit chat event------");

      io.in(chatRoom).emit("chat", data);
    }
  });

  socket.on("readMessage", async (data) => {
    const chat = await Chat.findById(data.chatId);

    console.log("-----chatId------", chat);

    if (chat) {
      chat.isRead = true;
      await chat.save();
    }
  });

  // ======================== Socket Disconnect ====================

  socket.on("disconnect", async () => {
    
  });

});

// ==================== Socket.io End ===============================

// start the server
server.listen(config.PORT, () => {
  console.log("Magic happens on port " + config.PORT);
});
 
