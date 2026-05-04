/**
 * Message Model
 * Real-time chat messages for event rooms
 * TTL index auto-deletes 7 days after event ends
 */

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      enum: ["text", "system"],
      default: "text",
    },

    // TTL — auto-delete 7 days after event ends
    expiresAt: {
      type: Date,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

// Auto-delete when expiresAt is reached
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Fast query: load messages for an event
messageSchema.index({ event: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;