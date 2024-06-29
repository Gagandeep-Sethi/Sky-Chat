const {
  uploadImagesToCloudinary,
  deleteImage,
} = require("../helpers/cloudinary");
const Chat = require("../models/Chat");

exports.createGroupChat = async (req, res) => {
  try {
    const { users, groupName } = req.body;
    const groupAdmin = req.user._id;
    const file = req.files?.profilePic;

    if (!users || users.length < 2) {
      return res
        .status(400)
        .json({ message: "A group chat requires at least two users." });
    }

    // Adding groupAdmin to the users array
    const userIds = [...users, groupAdmin];
    const filepath = await uploadImagesToCloudinary(file, "sky-chat/profile");

    // Check if a group with the same users and name already exists
    let group = await Chat.findOne({
      chatName: groupName,
      isGroupChat: true,
      users: { $all: userIds },
    });

    if (group) {
      return res.status(400).json({
        message: "A group with the same name and users already exists.",
      });
    }

    // Create the new group chat
    group = await Chat.create({
      chatName: groupName,
      users: userIds,
      isGroupChat: true,
      profilePic: filepath,
    });
    group.groupAdmin.push(groupAdmin);
    await group.save();

    return res.status(201).json(group);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateGroupProfile = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const file = req.files?.profilePic;

    // Find the group by ID
    let group = await Chat.findById(chatId);

    // Check if group exists
    if (!group) {
      return res.status(400).json({
        message: "Group does not exist",
      });
    }

    // Check if the user is an admin
    const isAdmin = group.groupAdmin.includes(req.user._id);
    if (!isAdmin) {
      return res.status(403).json({
        message: "User trying to update group settings is not an admin",
      });
    }
    if (file) {
      const filepath = await uploadImagesToCloudinary(file, "sky-chat/profile");
      if (group.profilePic) {
        await deleteImage(group.profilePic);
      }
      group.profilePic = filepath;
    }

    // Update the chatName if provided
    if (chatName) {
      group.chatName = chatName;
    }

    // Save the updated group document
    await group.save();
    return res.status(200).json({
      message: "Group updated successfully",
      group,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating group",
    });
  }
};
exports.getGroupChats = async (req, res) => {
  try {
    const requestingUserId = req.user._id;

    // Find all group chats the user is a part of
    const groupChats = await Chat.find({
      isGroupChat: true,
      users: requestingUserId,
    })
      .populate("latestMessage")
      .populate("chatName")
      .populate("users", "username profilePic");

    // Format the group chat data
    const groupChatsWithDetails = groupChats.map((groupChat) => {
      const latestMessage = groupChat.latestMessage
        ? groupChat.latestMessage.content
        : "";
      const chatTime = groupChat.latestMessage
        ? groupChat.latestMessage.createdAt
        : null;

      return {
        groupId: groupChat._id,
        chatName: groupChat.chatName,
        profilePic: groupChat.profilePic,
        users: groupChat.users.map((user) => ({
          userId: user._id,
          username: user.username,
          profilePic: user.profilePic,
        })),
        latestMessage,
        chatTime,
      };
    });

    res.status(200).json(groupChatsWithDetails);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};
exports.groupInfo = async (req, res) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId)
      .populate("users", "username profilePic")
      .populate("groupAdmin", "username");

    if (!chat || !chat.isGroupChat) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.addUsers = async (req, res) => {
  const { chatId, userIds } = req.body;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the chat is a group chat
    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    // Find users that are already in the group
    const existingUsers = userIds.filter((userId) =>
      chat.users.includes(userId)
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: `User already in the group`,
      });
    }

    // Add the new users to the group
    chat.users.push(...userIds);
    await chat.save();

    res.status(200).json({ message: "Users added to the group", chat });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.removeUser = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the chat is a group chat
    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    // Check if the user is in the group
    const userIndex = chat.users.indexOf(userId);

    if (userIndex === -1) {
      return res.status(400).json({ message: "User not in group" });
    }

    // Remove the user from the group
    chat.users.splice(userIndex, 1);
    await chat.save();

    res.status(200).json({ message: "User removed from the group", chat });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.makeAdmin = async (req, res) => {
  const { chatId, userId } = req.body;

  const requestingUser = req.user._id;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the chat is a group chat
    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    // Check if the requesting user is an admin
    if (
      !chat.groupAdmin.some(
        (admin) => admin._id.toString() === requestingUser.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "Requesting user is not an admin" });
    }

    // Check if the user is already an admin
    if (
      chat.groupAdmin.some(
        (admin) => admin._id.toString() === userId.toString()
      )
    ) {
      return res.status(400).json({ message: "User is already an admin" });
    }

    // Add the user to the groupAdmin array
    chat.groupAdmin.push(userId);
    await chat.save();

    res.status(200).json({ message: "User promoted to admin", chat });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.leaveGroup = async (req, res) => {
  const { chatId } = req.body;
  const requestingUser = req.user._id;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the chat is a group chat
    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    // Remove the user from the users array
    chat.users = chat.users.filter(
      (user) => String(user) !== String(requestingUser)
    );

    // Check if the user is the last person in the group
    if (chat.users.length === 0) {
      await Chat.deleteOne({ _id: chatId });
      return res
        .status(200)
        .json({ message: "Group deleted as it has no members left" });
    }

    // Remove the user from the groupAdmin array if they are an admin
    chat.groupAdmin = chat.groupAdmin.filter(
      (admin) => String(admin) !== String(requestingUser)
    );

    // If the user was an admin and there are no admins left, make the first user in the group an admin
    if (chat.groupAdmin.length === 0 && chat.users.length > 0) {
      chat.groupAdmin.push(chat.users[0]);
    }

    await chat.save();

    res.status(200).json({ message: "User has left the group", chat });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
