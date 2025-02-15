const Event = require("./event.model");
const fs = require("fs");

exports.addEvent = async (req, res) => {
  var {
    title,
    location,
    eventImages,
    lattitude,
    longtitude,
    eventDate,
    time,
    description,
    mono,
  } = req.body;
  try {
    var newEvent = new Event({
      title: title || "",
      location: location || "",
      eventImages: eventImages || [],
      lattitude: lattitude || "",
      longtitude: longtitude || "",
      eventDate: eventDate || "",
      time: time || "",
      description: description || "",
      mono: mono || ""
    });

    if (req.files.eventImages) {
      newEvent.eventImages = req.files.eventImages[0].path;
    }


    var eventSaved = await newEvent.save();

    if (eventSaved) {
      return res.status(200).json({ status: true, message: "Event registered."});
    } else {
      return res.status(200).json({ status: false, message: "Failed." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

exports.updateEvent = async (req, res) => {
  var {
    eventId,
    title,
    location,
    eventImages,
    lattitude,
    longtitude,
    eventDate,
    time,
    description,
    mono,
  } = req.body;

  try {
    var existingEvent = await Event.findOne({ _id: eventId });

    if (existingEvent) {

      existingEvent.title = title != "" ? title : existingEvent.title;
      existingEvent.location = location != "" ? location : existingEvent.location;
      existingEvent.eventImages = eventImages != [] ? eventImages : existingUser.eventImages;
      existingEvent.lattitude = lattitude != "" ? lattitude : existingEvent.lattitude;
      existingEvent.longtitude = longtitude != "" ? longtitude : existingEvent.longtitude;
      existingEvent.eventDate = eventDate != "" ? eventDate : existingEvent.eventDate;
      existingEvent.time = time != "" ? time : existingEvent.time;
      existingEvent.description = description != "" ? description : existingEvent.description;
      existingEvent.mono = mono != "" ? mono : existingEvent.mono;

      
      if (req.files.eventImages != undefined) {
        const elem = existingEvent.eventImages;
        if (fs.existsSync(elem)) {
          fs.unlinkSync(elem);
        }
        existingEvent.eventImages = req.files.eventImages[0].path;
      }

      updateSaved = await existingEvent.save();

      if (updateSaved)
        res.status(200).json({ status: true, message: "Success." });
      else {
        res.status(200).json({ status: false, message: "Failed." });
      }
    } else {
      res
        .status(200)
        .json({ status: true, message: "Event is not registered." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getAllEvent = async (req, res) => {
  try {
    var existingEvent = await Event.find()
      .limit(req.query.limit)
      .skip((req.query.pageNo - 1) * req.query.limit)
      .sort({ createdAt: -1 });
    var existingEventLength = await Event.find();

    if (existingEvent.length > 0) {
      res.status(200).json({
        status: true,
        message: "Success.",
        totalEvent: existingEventLength.length,
        event: existingEvent,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Success.",
        totalEvent: existingEventLength.length,
        event: [],
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    var existingEvent = await Event.findOne({ _id: req.query.eventId });

    if (existingEvent) {
      var deletedEvent = await Event.deleteOne({ _id: req.query.eventId });

      if (fs.existsSync(existingEvent.eventImages[0])) {
        fs.unlinkSync(existingEvent.eventImages[0]);
      }
    
      return res.status(200).json({ status: true, message: "Success!!" });
    } else {
      return res.status(200).json({ status: false, message: "Wrong Id received." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.getUserWiseEvent = async (req, res) => {
  try {
    var allEvents = await Event.find({ mono: req.query.mono });

    if (allEvents.length > 0) {
      res.status(200).json({
        status: true,
        message: "Success.",
        events: allEvents,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Events not found for the given mobile number.",
        events: [],
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
