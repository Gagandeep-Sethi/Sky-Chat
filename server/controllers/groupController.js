const { uploadImagesToCloudinary } = require("../helpers/cloudinary");
const Chat = require("../models/Chat");

exports.createGroupChat = async (req, res) => {
  try {
    const { users, groupName } = req.body;
    const groupAdmin = req.user._id;
    const file = req.files?.profilePic;
    console.log(users, "users");
    console.log(groupName, "name");

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
    console.error("Error creating group chat", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

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
    console.log(error);
    return res.status(500).json({
      message: "Error updating group",
    });
  }
};
