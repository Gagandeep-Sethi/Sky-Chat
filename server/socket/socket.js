const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: ["http://localhost:3000"],
    origin: "*",
    methods: ["GET", "PUT", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("sendMessage", (data) => {
    const { chatId, message } = data;
    // Save message to the database here
    const newMessage = { id: new Date().getTime(), text: message };
    io.to(chatId).emit("receiveMessage", { chatId, message: newMessage });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  socket.on("disconnect", () => {
    console.log(("user disconnected", socket.id));
  });
});

module.exports = { app, io, server };
