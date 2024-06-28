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
    origin: ["http://localhost:3000", "https://sky-chat-chi.vercel.app"],
    // origin: "*",
    methods: ["GET", "PUT", "POST"],
    credentials: true,
  },
});
const getReceiverSocketId = (receiveId) => {
  console.log("receiveId:", receiveId);
  console.log("Type of receiveId:", typeof receiveId);

  // Log keys of onlineUsers
  console.log("Keys in onlineUsers:", Object.keys(onlineUsers));

  // Check if receiveId is present in onlineUsers
  const socketId = onlineUsers[receiveId];
  console.log("Socket ID:", socketId);

  if (socketId) {
    console.log(`User ${receiveId} is online with socket ID ${socketId}`);
  } else {
    console.log(`User ${receiveId} is not online`);
  }

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
  console.log("a user connected", socket.id);
  console.log("a user connected id", socket.userId);
  if (socket.userId) {
    onlineUsers[socket.userId] = socket.id;
  }

  console.log(onlineUsers, "on");
  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });
  socket.on("typing", (room) => {
    console.log("typing");
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    console.log("stop typing");
    socket.in(room).emit("stop typing");
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    delete onlineUsers[socket.userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
    console.log(onlineUsers, "on");
  });
});

module.exports = { app, io, server, getReceiverSocketId };
