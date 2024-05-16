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
