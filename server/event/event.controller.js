const Event = require("./event.model");

exports.addEvent = async (req, res) => {
  var {
    title,
    location,
    lattitude,
    longtitude,
    eventDate,
    time,
    description,
    mono,
  } = req.body;
  try {
    var existingEvent = await Event.findOne({title});

    if (existingEvent) {
      return res.status(200).json({ status: false, message: "Event already exists." });
    }

    var newEvent = new Event({
      title: title || "",
      location: location || "",
      lattitude: lattitude || "",
      longtitude: longtitude || "",
      eventDate: eventDate || "",
      countryCode: countryCode || "",
      time: time || "",
      description: description || "",
      mono: mono || ""
    });

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
      existingEvent.lattitude = lattitude != "" ? lattitude : existingEvent.lattitude;
      existingEvent.longtitude = longtitude != "" ? longtitude : existingEvent.longtitude;
      existingEvent.eventDate = eventDate != "" ? eventDate : existingEvent.eventDate;
      existingEvent.time = time != "" ? time : existingEvent.time;
      existingEvent.description = description != "" ? description : existingEvent.description;
      existingEvent.mono = mono != "" ? mono : existingEvent.mono;

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
    var existingEvent = await Event.findOne({ mono: req.query.mono });

    if (existingEvent) {
      res.status(200).json({
        status: true,
        message: "Success.",
        event: existingEvent,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Event not found.",
        event: [],
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};