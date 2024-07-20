const { Server } = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const onlineUsers = {};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://sky-chat-chi.vercel.app",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
  },
});
const getReceiverSocketId = (receiveId) => {
  // Check if receiveId is present in onlineUsers
  const socketId = onlineUsers[receiveId];
  return socketId;
};

io.use((socket, next) => {
  const token = socket.handshake.auth.token; // Get token from auth header

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded._id; // Attach user ID to the socket object
      next();
    } catch (error) {
      return next(new Error("Authentication error"));
    }
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  if (socket.userId) {
    onlineUsers[socket.userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
  socket.on("notification", (notificationData) => {
    //console.log("Notification received:", notificationData);
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });
});

module.exports = { app, io, server, getReceiverSocketId };
//origin: "http://localhost:3000",
