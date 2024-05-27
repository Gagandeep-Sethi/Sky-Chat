const {
  uploadImagesToCloudinary,
  deleteImage,
} = require("../helpers/cloudinary");
const User = require("../models/User");

exports.search = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            username: { $regex: req.query.search, $option: "i" },
          },
          {
            email: { $regex: req.query.search, $option: "i" },
          },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
};

exports.updateProfile = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const user = await User.findById(requestingUserId);
    if (!user) {
      throw new Error("user not found");
    }
    const file = req.files.profilePic;

    if (file) {
      const filepath = await uploadImagesToCloudinary(file, "sky-chat/profile");
      if (user.profilePic) {
        deleteImage(user.profilePic);
      }
      user.profilePic = filepath;
    }
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error, "update profile error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};
