const Setting = require("./setting.model");


exports.updateSetting = async (req, res) => {
  try {
    const { email, push, chat } = req.body;
    const updatedSetting = await Setting.findOneAndUpdate(
      {},  // Empty object {} to update the first found document (you can customize this as needed)
      { email, push, chat }, // Update the settings fields
      { new: true, upsert: true } // new: true returns the updated document, upsert: true creates a new document if none is found
    );

    return res.status(200).json({
      message: "Settings updated successfully",
      settings: updatedSetting,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while updating settings.",
      error: error.message,
    });
  }
};
