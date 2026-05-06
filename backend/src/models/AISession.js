/**
 * AISession Model
 * Stores conversation history per user
 */

import mongoose from "mongoose";

const aiSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

aiSessionSchema.index({ user: 1, lastMessageAt: -1 });

const AISession = mongoose.model("AISession", aiSessionSchema);

export default AISession;