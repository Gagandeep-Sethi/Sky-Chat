const { Server } = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const express = require("express");
const app = express();
const onlineUsers = {};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://sky-chat-chi.vercel.app",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  },
});
const getReceiverSocketId = (receiveId) => {
  // Check if receiveId is present in onlineUsers
  const socketId = onlineUsers[receiveId];

  return socketId;
};

io.use((socket, next) => {
  const cookies = socket.handshake.headers.cookie;
  if (cookies) {
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.jwt; // Assuming your JWT cookie is named 'jwt'

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifying token
      if (!decoded) {
        return next(new Error("Authentication error"));
      } else {
        socket.userId = decoded._id; // Attach user ID to the socket object
        next();
      }
    } else {
      next(new Error("Authentication error"));
    }
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
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
