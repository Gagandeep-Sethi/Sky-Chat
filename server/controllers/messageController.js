const ChatMessage = require("../models/ChatMessage");
const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let chat = await ChatMessage.findOne({
      users: { $all: [senderId, receiverId] },
    });
    if (!chat) {
      chat = await ChatMessage.create({
        users: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      chat.chat.push(newMessage._id);
      chat.latestMessage = newMessage._id;
    }
    // await chat.save()
    // await newMessage.save()
    Promise.all([chat.save(), newMessage.save()]); //so that these gets saved paralel not to wait for each step complete to optimize it more
    res.status(200).json(newMessage);
  } catch (error) {
    console.log("error in sending message", error);
    res.status(500).json({ message: "internal server error" });
  }
};
