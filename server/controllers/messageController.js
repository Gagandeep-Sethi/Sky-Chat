const ChatMessage = require("../models/ChatMessage");
const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    let chat;

    if (chatId) {
      // Group chat
      chat = await ChatMessage.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    } else if (receiverId) {
      // One-on-one chat
      chat = await ChatMessage.findOne({
        users: { $all: [senderId, receiverId] },
      });
      if (!chat) {
        chat = await ChatMessage.create({
          users: [senderId, receiverId],
        });
      }
    } else {
      // Neither chatId nor receiverId provided
      return res.status(400).json({ message: "Invalid request parameters" });
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
    const { id: userToChatWithId } = req.params;
    const senderId = req.user._id;
    const { chatId } = req.body;

    let chat;

    if (chatId) {
      // Group chat
      chat = await ChatMessage.findById(chatId);
    } else if (userToChatWithId) {
      // One-on-one chat
      chat = await ChatMessage.findOne({
        isGroupChat: false,
        users: { $all: [senderId, userToChatWithId] },
      });
    } else {
      // Neither chatId nor userToChatWithId provided
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    if (!chat) return res.status(200).json([]);

    // Fetch messages for the chat and populate senderId with only username field
    const messages = await Message.find({ chatId: chat._id })
      .select("-chatId")
      .populate("senderId", "username") // Populate only the username field from User model
      .sort("createdAt") // Sort messages by creation time
      .exec();

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getting messages", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// exports.getMessage = async (req, res) => {
//   try {
//     const { id: userToChatWithId } = req.params;
//     const senderId = req.user._id;

//     const chat = await ChatMessage.findOne({
//       users: { $all: [userToChatWithId, senderId] },
//     }).populate("chat");
//     if (!chat) return res.status(200).json([]);

//     return res.status(200).json(chat.chat);
//   } catch (error) {
//     console.log("error in getting message", error);
//     res.status(500).json({ message: "internal server error" });
//   }
// };
