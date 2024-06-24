const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const senderId = req.user._id;
    const { id } = req.params; // Use the same parameter for userToChatWithId and chatId

    let chat;

    // Check if the ID corresponds to a user first
    const userToChatWith = await User.findById(id);

    if (userToChatWith) {
      // One-on-one chat
      chat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [senderId, id] },
      });

      if (!chat) {
        // Create a new one-on-one chat if it doesn't exist
        chat = await Chat.create({
          users: [senderId, id],
        });
      }
    } else {
      // If not a user, assume it's a chat ID for group chat
      chat = await Chat.findById(id);

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    }

    const newMessage = new Message({
      senderId,
      chatId: chat._id,
      content,
      readBy: [senderId], // The sender has read their own message
    });

    chat.latestMessage = newMessage._id;

    await Promise.all([chat.save(), newMessage.save()]);

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error in sending message", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getChat = async (req, res) => {
  try {
    const { id } = req.params; // Use the same parameter for userToChatWithId and chatId
    const senderId = req.user._id;

    let chat;

    // Check if the ID corresponds to a user first
    const userToChatWith = await User.findById(id);

    if (userToChatWith) {
      // One-on-one chat
      chat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [senderId, id] },
      });
    } else {
      // If not a user, assume it's a chat ID for group chat
      chat = await Chat.findById(id);
    }

    if (!chat) return res.status(200).json([]);

    // Fetch messages for the chat and populate senderId with username and profilePic fields
    const messages = await Message.find({ chatId: chat._id })
      .select("-chatId")
      .populate("senderId", "username profilePic")
      .sort("createdAt")
      .exec();

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getting messages", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
