import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// One user can be connected from multiple browser tabs or devices.
const userSockets = new Map();

const getOnlineUserIds = () => [...userSockets.keys()];

io.on("connection", (socket) => {
  const userId = String(socket.handshake.query.userId || "");

  if (!userId) {
    socket.disconnect(true);
    return;
  }

  console.log(`User ${userId} connected with socket ${socket.id}`);

  socket.join(userId);

  const sockets = userSockets.get(userId) || new Set();
  sockets.add(socket.id);
  userSockets.set(userId, sockets);

  io.emit("getOnlineUsers", getOnlineUserIds());

  socket.on("typing", ({ receiverId, isTyping }) => {
    if (!receiverId) return;

    socket.to(String(receiverId)).emit("typing", {
      senderId: userId,
      isTyping: Boolean(isTyping),
    });
  });

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected socket ${socket.id}`);

    const remainingSockets = userSockets.get(userId);
    remainingSockets?.delete(socket.id);

    if (!remainingSockets?.size) {
      userSockets.delete(userId);
    }

    io.emit("getOnlineUsers", getOnlineUserIds());
  });
});

export { io, app, server };
