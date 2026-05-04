/**
 * Socket.io Server Setup
 */

import { socketAuth } from "../middleware/socketAuth.js";
import { initChatSocket } from "./chat.socket.js";

export const initSocket = (io) => {
  // Auth middleware — runs on every connection
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.user.name} (${socket.id})`);

    // Initialize chat handlers
    initChatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`⚡ Socket disconnected: ${socket.user.name}`);
    });
  });
};