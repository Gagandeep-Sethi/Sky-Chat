const ChatMessage = require("../models/ChatMessage");
const Message = require("../models/Message");
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const senderId = req.user._id;
    const { chatId } = req.body; // chatId for group chats
    const { id: receiverId } = req.params; // receiverId for one-on-one chats

    let chat;

    if (chatId) {
      // Group chat
      chat = await ChatMessage.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    } else {
      // One-on-one chat
      chat = await ChatMessage.findOne({
        users: { $all: [senderId, receiverId] },
      });
      if (!chat) {
        chat = await ChatMessage.create({
          users: [senderId, receiverId],
        });
      }
    }

    const newMessage = new Message({
      senderId,
      chatId: chat._id,
      content,
      readBy: [senderId], // The sender has read their own message
    });

    chat.latestMessage = newMessage._id;
    // await chat.save()
    // await newMessage.save()
    await Promise.all([chat.save(), newMessage.save()]); //so that these gets saved parallel not to wait for each step complete to optimize it more

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error in sending message", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const { id: userToChatWithId } = req.params;
    const senderId = req.user._id;

    const chat = await ChatMessage.findOne({
      users: { $all: [userToChatWithId, senderId] },
    }).populate("chat");
    if (!chat) return res.status(200).json([]);

    return res.status(200).json(chat.chat);
  } catch (error) {
    console.log("error in getting message", error);
    res.status(500).json({ message: "internal server error" });
  }
};
