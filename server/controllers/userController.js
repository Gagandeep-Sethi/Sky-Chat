const {
  uploadImagesToCloudinary,
  deleteImage,
} = require("../helpers/cloudinary");
const Chat = require("../models/Chat");
const FriendList = require("../models/FriendList");
const Message = require("../models/Message");
const User = require("../models/User");

exports.search = async (req, res) => {
  console.log("req reached");
  try {
    const requestingUserId = req.user._id;
    const user = await User.findById(requestingUserId);
    if (!user) {
      throw new Error("user not found");
    }
    const { query } = req.query;

    console.log(query, "query");

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
        { _id: { $ne: requestingUserId } }, // Exclude requesting user
      ],
    }).select("username email profilePic _id"); // Select fields to return

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const user = await User.findById(requestingUserId);
    if (!user) {
      throw new Error("user not found");
    }
    const file = req.files?.profilePic;
    const { username } = req.body;
    console.log(username, "username");
    console.log(file, "file");

    if (file) {
      const filepath = await uploadImagesToCloudinary(file, "sky-chat/profile");
      if (user.profilePic) {
        await deleteImage(user.profilePic);
      }
      user.profilePic = filepath;
    }
    if (username) {
      user.username = username;
    }
    await user.save();
    console.log(user, "user");
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
    console.log(friendId, "friendid");
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
      res.status(400).json({ message: error.message });
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
      throw new Error("This user is not in friend list");
    }

    friendList.friends.splice(friendIndex, 1);
    await friendList.save();

    return res.status(200).json(friendList);
  } catch (error) {
    console.log(error, "remove friend error");
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
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
      res.status(400).json({ message: error.message });
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
      throw new Error("User is already unblocked");
    }

    friendList.blocked.splice(friendIndex, 1);
    await friendList.save();

    return res.status(200).json(friendList);
  } catch (error) {
    console.log(error, "remove friend error");
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};

exports.getFriendList = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const friendList = await FriendList.findOne({ userId: requestingUserId });
    const user = await User.findById(requestingUserId);

    if (!user) {
      throw new Error("Requesting user not found");
    }

    if (!friendList) {
      throw new Error("No friend list found");
    }

    // Fetch latest messages for each friend
    const friendsWithLatestMessages = await Promise.all(
      friendList.friends.map(async (friendId) => {
        const friend = await User.findById(friendId, {
          username: 1,
          profilePic: 1,
        });
        const chat = await Chat.findOne({
          users: { $all: [requestingUserId, friendId] },
        });

        let latestMessage = null;
        if (chat) {
          latestMessage = await Message.findById(chat.latestMessage);
        }

        return {
          friendId,
          profilePic: friend ? friend.profilePic : "",
          username: friend ? friend.username : null,
          latestMessage: latestMessage ? latestMessage.content : "",
          chatTime: latestMessage ? latestMessage.createdAt : null,
        };
      })
    );

    res.status(200).json(friendsWithLatestMessages);
  } catch (error) {
    console.log(error, "get friendlist error");
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
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

    const blockedList = await FriendList.findOne({ userId: requestingUserId });
    if (!blockedList) {
      throw new Error("No friendlist found");
    } else {
      res.status(200).json(blockedList.blocked);
    }
  } catch (error) {
    console.log(error, "get blockedlist error");
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};
{
  /* <div class="relative">
    <input required id="username" class="peer rounded-lg border border-green-400 px-2 py-1 placeholder-transparent placeholder-shown:border-gray-600 focus:border-green-400 focus:outline-none " type="text" placeholder="enter your name" />
    <label for="username" class="absolute left-2 top-1 cursor-text font-light text-gray-500 transition-all duration-200 peer-valid:-top-3 peer-valid:bg-white peer-valid:text-sm peer-valid:text-green-400 peer-focus:-top-3 peer-focus:bg-white peer-focus:text-sm peer-focus:text-green-400">Enter your name</label>
  </div> */
}
