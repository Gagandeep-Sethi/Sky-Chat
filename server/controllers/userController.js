const {
  uploadImagesToCloudinary,
  deleteImage,
} = require("../helpers/cloudinary");
const FriendList = require("../models/FriendList");
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

exports.addFriend = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const user = await User.findById(requestingUserId);

    if (!user) {
      throw new Error("user not found");
    }
    const { id: friendId } = req.params;
    if (!friendId) {
      throw new Error("User tou are trying to add not found");
    }

    let friendList = await FriendList({ userId: requestingUserId });
    if (friendList) {
      friendList.friends.push(friendId);
    } else {
      friendList = await FriendList.create({
        userId: requestingUserId,
        friends: [],
      });
      friendList.friends.push(friendId);
    }
    await friendList.save();
    res.status(200).json(friendList);
  } catch (error) {
    console.log(error, "adding friend error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const user = await User.findById(requestingUserId);
    const { id: friendId } = req.params;

    if (!user) {
      throw new Error("user not found");
    }

    const friendList = await FriendList.findOne({ userId: requestingUserId });

    if (!friendList) {
      throw new Error("Friend list not found ");
    }

    const friendIndex = friendList.friends.indexOf(friendId);

    if (friendIndex === -1) {
      throw new Error("Friend not found in the list");
    }

    friendList.friends.splice(friendIndex, 1);
    await friendList.save();

    return res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.log(error, "remove friend error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};
