const {
  uploadImagesToCloudinary,
  deleteImage,
} = require("../helpers/cloudinary");
const Chat = require("../models/Chat");
const FriendList = require("../models/FriendList");
const Message = require("../models/Message");
const User = require("../models/User");

exports.search = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const user = await User.findById(requestingUserId);
    if (!user) {
      throw new Error("user not found");
    }
    const { query } = req.query;

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

    if (file) {
      const filepath = await uploadImagesToCloudinary(file, "sky-chat/profile");
      if (user.profilePic) {
        await deleteImage(user.profilePic);
      }
      user.profilePic = filepath;
    }
    if (username) {
      //find user with this username
      const usernameExist = await User.findOne({ username });
      if (usernameExist) {
        if (usernameExist._id.toString() !== requestingUserId.toString()) {
          throw new Error(`${username} Username is already taken `);
        }
      }
      user.username = username;
    }
    await user.save();

    res.status(200).json({
      email: user.email,
      username: user.username,
      profilePic: user?.profilePic,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
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
      throw new Error("User not found");
    }
    const { id: friendId } = req.params;
    const friend = await User.findById(friendId);

    if (!friend) {
      throw new Error("User you are trying to add not found");
    }

    // Add the friend to the requesting user's friend list
    let requestingUserFriendList = await FriendList.findOne({
      userId: requestingUserId,
    });
    if (requestingUserFriendList) {
      if (requestingUserFriendList.friends.includes(friendId)) {
        throw new Error("User already in your friend list");
      } else requestingUserFriendList.friends.push(friendId);
    } else {
      requestingUserFriendList = await FriendList.create({
        userId: requestingUserId,
        friends: [friendId],
      });
    }
    await requestingUserFriendList.save();

    // Add the requesting user to the friend's friend list
    let friendUserFriendList = await FriendList.findOne({ userId: friendId });
    if (friendUserFriendList) {
      if (!friendUserFriendList.friends.includes(requestingUserId)) {
        friendUserFriendList.friends.push(requestingUserId);
        await friendUserFriendList.save();
      }
    } else {
      await FriendList.create({
        userId: friendId,
        friends: [requestingUserId],
      });
    }

    res.status(200).json(requestingUserFriendList);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const { id: friendId } = req.params;

    // Find the requesting user and their friend list
    const user = await User.findById(requestingUserId);
    if (!user) {
      throw new Error("User not found");
    }

    const friendList = await FriendList.findOne({ userId: requestingUserId });
    if (!friendList) {
      throw new Error("Friend list not found");
    }

    // Remove friend from requesting user's friend list
    const friendIndex = friendList.friends.indexOf(friendId);
    if (friendIndex === -1) {
      throw new Error("This user is not in your friend list");
    }
    friendList.friends.splice(friendIndex, 1);
    await friendList.save();

    // Find the friend's friend list and remove requesting user from it
    const friendUserFriendList = await FriendList.findOne({ userId: friendId });
    if (friendUserFriendList) {
      const requestingUserIndex =
        friendUserFriendList.friends.indexOf(requestingUserId);
      if (requestingUserIndex !== -1) {
        friendUserFriendList.friends.splice(requestingUserIndex, 1);
        await friendUserFriendList.save();
      }
    }

    return res.status(200).json(friendList);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
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
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};
