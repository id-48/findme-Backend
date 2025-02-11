const Admin = require("./admin.model");
const jwt = require("jsonwebtoken");
const config = require("../../config");


exports.registerAdmin = async (req, res) => {
  var { adminName, email, password } = req.body;
  try {
    var existingUser = await Admin.findOne({ email });

    if (existingUser) {
      return res
        .status(200)
        .json({ status: true, message: "User already exists." });
    }

    var newUser = new Admin({
      adminName: adminName || "",
      email: email || "",
      password: password || "",
    });

    var userSaved = await newUser.save();

    if (userSaved) {
      return res
        .status(200)
        .json({ status: true, message: "Admin registered." });
    } else {
      return res.status(200).json({ status: false, message: "Failed." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.updateAdmin = async (req, res) => {
  var { userId, adminName, email, password } = req.body;

  try {
    var existingUser = await Admin.findOne({ _id: userId });

    if (existingUser) {
      existingUser.adminName = adminName != "" ? adminName : existingUser.adminName;
      existingUser.email = email != "" ? email : existingUser.email;
      existingUser.password = password != "" ? password : existingUser.password;

      updateSaved = await existingUser.save();

      if (updateSaved)
        res.status(200).json({ status: true, message: "Success." });
      else {
        res.status(200).json({ status: false, message: "Failed." });
      }
    } else {
      res
        .status(200)
        .json({ status: true, message: "Admin is not registered." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
 
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ status: false, reason: "Email doesn't exist." });

    const pass = await Admin.findOne({ password });
    if (!pass)
      return res
        .status(200)
        .json({ status: false, reason: "Password doesn't match." });

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET);

    await user.save();

    const response = {
      status: true,
      reason: "Success!!",
      data: user,
      token: token
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    var existingUser = await Admin.find()
      .limit(req.query.limit)
      .skip((req.query.pageNo - 1) * req.query.limit)
      .sort({ createdAt: -1 });
    var existingUserLength = await Admin.find();

    if (existingUser.length > 0) {
      res.status(200).json({
        status: true,
        message: "Success.",
        totalUser: existingUserLength.length,
        User: existingUser,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Success.",
        totalUser: existingUserLength.length,
        User: [],
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    var existingUser = await Admin.findOne({ _id: req.query.userId });

    if (existingUser) {
      var deletedUser = await Admin.deleteOne({ _id: req.query.userId });

      return res.status(200).json({ status: true, message: "Success!!" });
    } else {
      return res
        .status(200)
        .json({ status: false, message: "Wrong Id received." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
