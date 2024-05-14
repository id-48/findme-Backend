const Place = require("./place.model");
const User = require("../user/user.model");

exports.addPlace = async (req, res) => {
  var {
    placeName,
    category,
    location,
    lattitued,
    longtitude,
    locatedWithin,
    placeDescription,
    mono,
  } = req.body;

  try {
    var newPlace = new Place({
      placeName: placeName || "",
      category: category || "",
      location: location || "",
      lattitued: lattitued || "",
      longtitude: longtitude || "",
      locatedWithin: locatedWithin || "",
      placeDescription: placeDescription || "",
      mono: mono || ""
    });

    var placeSaved = await newPlace.save();

    if (placeSaved) {
      // Update the user's lastVisitedPlace field
      await User.updateOne({ mono: mono }, { $addToSet: { lastVisitedPlace: placeName } });

      return res.status(200).json({ status: true, message: "Place registered."});
    } else {
      return res.status(200).json({ status: false, message: "Failed." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};


exports.updatePlace = async (req, res) => {
  var {
    placeId,
    placeName,
    category,
    location,
    lattitued,
    longtitude,
    locatedWithin,
    placeDescription,
    mono,
  } = req.body;

  try {
    var existingPlace = await Place.findOne({ _id: placeId });

    if (existingPlace) {

      existingPlace.placeName = placeName != "" ? placeName : existingPlace.placeName;
      existingPlace.category = category != "" ? category : existingPlace.category;
      existingPlace.lattitued = lattitued != "" ? lattitued : existingPlace.lattitued;
      existingPlace.longtitude = longtitude != "" ? longtitude : existingPlace.longtitude;
      existingPlace.locatedWithin = locatedWithin != "" ? locatedWithin : existingPlace.locatedWithin;
      existingPlace.placeDescription = placeDescription != "" ? placeDescription : existingPlace.placeDescription;
      existingPlace.mono = mono != "" ? mono : existingPlace.mono;

      updateSaved = await existingPlace.save();

      if (updateSaved)
        res.status(200).json({ status: true, message: "Success." });
      else {
        res.status(200).json({ status: false, message: "Failed." });
      }
    } else {
      res
        .status(200)
        .json({ status: true, message: "Place is not registered." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getAllPlace = async (req, res) => {
  try {
    var existingPlace = await Place.find()
      .limit(req.query.limit)
      .skip((req.query.pageNo - 1) * req.query.limit)
      .sort({ createdAt: -1 });
    var existingPlaceLength = await Place.find();

    if (existingPlace.length > 0) {
      res.status(200).json({
        status: true,
        message: "Success.",
        totalPlace: existingPlaceLength.length,
        place: existingPlace,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Success.",
        totalPlace: existingPlaceLength.length,
        place: [],
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    var existingPlace = await Place.findOne({ _id: req.query.placeId });

    if (existingPlace) {
      var deletedPlace = await Place.deleteOne({ _id: req.query.placeId });

    
      return res.status(200).json({ status: true, message: "Success!!" });
    } else {
      return res.status(200).json({ status: false, message: "Wrong Id received." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.getUserWisePlace = async (req, res) => {
  try {
    var allPlaces = await Place.find({ mono: req.query.mono });

    if (allPlaces.length > 0) {
      res.status(200).json({
        status: true,
        message: "Success.",
        places: allPlaces,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Places not found for the given mobile number.",
        places: [],
      });
    }
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
