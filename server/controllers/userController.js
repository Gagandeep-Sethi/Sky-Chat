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
    const friend = await User.findById(friendId);

    if (!friend) {
      throw new Error("User you are trying to add not found");
    }

    let friendList = await FriendList.findOne({ userId: requestingUserId });
    if (friendList) {
      if (friendList.friends.includes(friendId)) {
        throw new Error("User already in your friendlist");
      } else friendList.friends.push(friendId);
    } else {
      friendList = await FriendList.create({
        userId: requestingUserId,
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

    return res.status(200).json(friendList);
  } catch (error) {
    console.log(error, "remove friend error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};

exports.blockFriend = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const user = await User.findById(requestingUserId);

    if (!user) {
      throw new Error("user not found");
    }
    const { id: friendId } = req.params;
    const friend = await User.findById(friendId);

    if (!friend) {
      throw new Error("User you are trying to block not found");
    }

    let friendList = await FriendList.findOne({ userId: requestingUserId });
    if (friendList) {
      if (friendList.blocked.includes(friendId)) {
        throw new Error("User already in your blockedlist");
      }
      friendList.blocked.push(friendId);
    } else {
      friendList = await FriendList.create({
        userId: requestingUserId,
      });
      friendList.blocked.push(friendId);
    }
    await friendList.save();
    res.status(200).json(friendList);
  } catch (error) {
    console.log(error, "blocking  friend error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};

exports.removeBlockedFriend = async (req, res) => {
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

    const friendIndex = friendList.blocked.indexOf(friendId);

    if (friendIndex === -1) {
      throw new Error("Friend not found in the list");
    }

    friendList.blocked.splice(friendIndex, 1);
    await friendList.save();

    return res.status(200).json(friendList);
  } catch (error) {
    console.log(error, "remove friend error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};

exports.getFriendList = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const friendList = await friendList.findOne({ userId: requestingUserId });
    const user = await User.findById(requestingUserId);

    if (!user) {
      throw new Error("requesting user not found");
    }

    if (!friendList) {
      throw new Error("No friendlist found");
    } else {
      res.status(200).json(friendList.friends);
    }
  } catch (error) {
    console.log(error, "get friendlist error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};

exports.getBlockedList = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const user = await User.findById(requestingUserId);

    if (!user) {
      throw new Error("requesting user not found");
    }

    const friendList = await friendList.findOne({ userId: requestingUserId });
    if (!friendList) {
      throw new Error("No friendlist found");
    } else {
      res.status(200).json(friendList.blocked);
    }
  } catch (error) {
    console.log(error, "get blockedlist error");
    if (error instanceof Error) {
      res.status(400).json({ mesage: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};
