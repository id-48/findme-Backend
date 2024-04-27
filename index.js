const express = require("express");
const mongoose = require("mongoose");
const app = express();
const config = require("./config");
const path = require("path");
const bodyParser = require('body-parser');
const cors = require("cors");

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

// start the server
app.listen(config.PORT, () => {
    console.log("Magic happens on port " + config.PORT);
});
