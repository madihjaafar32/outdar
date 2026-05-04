/**
 * Socket.io Authentication Middleware
 * Verifies JWT on socket connection
 */

import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user || user.isDeleted) {
      return next(new Error("User not found"));
    }

    // Attach user to socket
    socket.user = user;

    // Auto-join personal notification room
    socket.join(`user:${user._id}`);

    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
};