/**
 * Chat Socket Handler
 * Handles all real-time chat events
 */

import Message from "../models/Message.js";
import Event from "../models/Event.js";
import Attendance from "../models/Attendance.js";

export const initChatSocket = (io, socket) => {
  const user = socket.user;

  // ── Join chat room ──────────────────────────────────────
  socket.on("join_chat", async ({ eventId }) => {
    try {
      // Verify user has RSVP'd to this event
      const attendance = await Attendance.findOne({
        user: user._id,
        event: eventId,
        status: { $in: ["going", "interested"] },
      });

      if (!attendance) {
        socket.emit("error", { message: "RSVP to this event to join the chat" });
        return;
      }

      const room = `chat:${eventId}`;
      socket.join(room);

      // Notify others
      socket.to(room).emit("user_joined_chat", {
        user: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
        },
      });

      // Send system message
      const event = await Event.findById(eventId).select("date");
      const expiresAt = new Date(event.date);
      expiresAt.setDate(expiresAt.getDate() + 7);

      await Message.create({
        event: eventId,
        sender: user._id,
        content: `${user.name} joined the chat 👋`,
        type: "system",
        expiresAt,
      });

      socket.emit("joined_chat", { eventId, room });
    } catch (error) {
      socket.emit("error", { message: "Could not join chat" });
    }
  });

  // ── Send message ────────────────────────────────────────
  socket.on("send_message", async ({ eventId, content }) => {
    try {
      if (!content || !content.trim()) return;
      if (content.length > 1000) {
        socket.emit("error", { message: "Message too long (max 1000 chars)" });
        return;
      }

      // Verify still RSVP'd
      const attendance = await Attendance.findOne({
        user: user._id,
        event: eventId,
        status: { $in: ["going", "interested"] },
      });

      if (!attendance) {
        socket.emit("error", { message: "Not authorized to send messages" });
        return;
      }

      // Get event for TTL
      const event = await Event.findById(eventId).select("date");
      const expiresAt = new Date(event.date);
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Save to MongoDB
      const message = await Message.create({
        event: eventId,
        sender: user._id,
        content: content.trim(),
        type: "text",
        expiresAt,
      });

      // Populate sender info
      await message.populate("sender", "name avatar isVerified");

      const room = `chat:${eventId}`;

      // Broadcast to EVERYONE in room (including sender)
      io.to(room).emit("message_received", {
        _id: message._id,
        content: message.content,
        type: message.type,
        sender: message.sender,
        createdAt: message.createdAt,
        eventId,
      });

    } catch (error) {
      socket.emit("error", { message: "Could not send message" });
    }
  });

  // ── Typing indicators ───────────────────────────────────
  socket.on("typing_start", ({ eventId }) => {
    socket.to(`chat:${eventId}`).emit("user_typing", {
      user: { _id: user._id, name: user.name },
    });
  });

  socket.on("typing_stop", ({ eventId }) => {
    socket.to(`chat:${eventId}`).emit("user_stopped_typing", {
      userId: user._id,
    });
  });

  // ── Leave chat room ─────────────────────────────────────
  socket.on("leave_chat", ({ eventId }) => {
    const room = `chat:${eventId}`;
    socket.leave(room);
    socket.to(room).emit("user_left_chat", {
      user: { _id: user._id, name: user.name },
    });
  });

  // ── Disconnect ──────────────────────────────────────────
  socket.on("disconnect", () => {
    // Socket.io auto-removes from all rooms on disconnect
  });
};