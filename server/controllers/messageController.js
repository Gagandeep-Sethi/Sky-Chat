const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const { io, getReceiverSocketId } = require("../socket/socket");
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
    //socket io
    if (chat.isGroupChat) {
      const filteruser = chat?.users.filter(
        (userId) => userId.toString() !== senderId.toString()
      );

      filteruser.map(async (userId) => {
        const receiverSocketId = getReceiverSocketId(userId.toString());
        if (receiverSocketId) {
          const message = await Message.findById(newMessage._id)
            //.select("-chatId")
            .populate("senderId", "username profilePic")
            .exec();

          io.to(receiverSocketId).emit("notification", {
            message,
            isGroup: true,
            chatName: chat?.chatName,
          });
        }
      });
    } else {
      const receiverSocketId = getReceiverSocketId(id);
      if (receiverSocketId) {
        const message = await Message.findById(newMessage._id)
          .select("-chatId")
          .populate("senderId", "username profilePic")
          .exec();

        io.to(receiverSocketId).emit("notification", {
          message,
          isGroup: false,
        });
      }
    }

    const message = await Message.findById(newMessage._id)
      //.select("-chatId")
      .populate("senderId", "username profilePic")
      .sort("createdAt")
      .exec();
    io.to(chat._id.toString()).emit("newMessage", message);
    //}

    res.status(200).json(newMessage);
  } catch (error) {
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
      //.select("-chatId")
      .populate("senderId", "username profilePic")
      .sort("createdAt")
      .exec();

    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
