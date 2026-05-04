/**
 * Message Routes
 * REST endpoint for chat history
 * Mounted at: /api/messages
 */

import express from "express";
import Message from "../models/Message.js";
import Attendance from "../models/Attendance.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/messages/:eventId
 * Load chat history for an event (must be RSVP'd)
 */
router.get("/:eventId", requireAuth, async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // Verify RSVP
    const attendance = await Attendance.findOne({
      user: req.user._id,
      event: eventId,
      status: { $in: ["going", "interested"] },
    });

    if (!attendance) {
      return res.status(403).json({
        success: false,
        message: "RSVP to this event to view the chat",
      });
    }

    const messages = await Message.find({
      event: eventId,
      isDeleted: { $ne: true },
    })
      .populate("sender", "name avatar isVerified")
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({
      success: true,
      data: { messages, count: messages.length },
    });
  } catch (error) {
    next(error);
  }
});

export default router;