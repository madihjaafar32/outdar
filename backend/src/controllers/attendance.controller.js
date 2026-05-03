/**
 * Attendance Controller
 * Handles RSVP logic — going, interested, cancel
 */

import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import mongoose from "mongoose";

/**
 * @desc    RSVP to an event (going or interested)
 * @route   POST /api/attendances
 * @access  Private
 */
export const rsvp = async (req, res, next) => {
  try {
    const { eventId, status } = req.body;

    if (!eventId || !status) {
      return res.status(400).json({
        success: false,
        message: "eventId and status are required",
      });
    }

    if (!["going", "interested"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be going or interested",
      });
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event || event.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if event is full (only for "going")
    if (status === "going" && event.attendeeCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: "Event is full",
        data: { isFull: true },
      });
    }

    // Check if already RSVP'd
    const existing = await Attendance.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existing) {
      // If same status → cancel (toggle off)
      if (existing.status === status) {
        existing.status = "cancelled";
        await existing.save();

        // Decrement counter
        if (status === "going") {
          await Event.findByIdAndUpdate(eventId, {
            $inc: { attendeeCount: -1 },
          });
        } else if (status === "interested") {
          await Event.findByIdAndUpdate(eventId, {
            $inc: { interestedCount: -1 },
          });
        }

        return res.json({
          success: true,
          message: "RSVP cancelled",
          data: { status: "cancelled", attendance: existing },
        });
      }

      // If different status → update
      const oldStatus = existing.status;
      existing.status = status;
      await existing.save();

      // Update counters
      if (oldStatus === "going") {
        await Event.findByIdAndUpdate(eventId, {
          $inc: { attendeeCount: -1 },
        });
      } else if (oldStatus === "interested") {
        await Event.findByIdAndUpdate(eventId, {
          $inc: { interestedCount: -1 },
        });
      }

      if (status === "going") {
        await Event.findByIdAndUpdate(eventId, {
          $inc: { attendeeCount: 1 },
        });
      } else if (status === "interested") {
        await Event.findByIdAndUpdate(eventId, {
          $inc: { interestedCount: 1 },
        });
      }

      return res.json({
        success: true,
        message: `Status updated to ${status}`,
        data: { status, attendance: existing },
      });
    }

    // New RSVP — create attendance
    const attendance = await Attendance.create({
      user: req.user._id,
      event: eventId,
      status,
    });

    // Increment counter
    if (status === "going") {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { attendeeCount: 1 },
      });
    } else if (status === "interested") {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { interestedCount: 1 },
      });
    }

    res.status(201).json({
      success: true,
      message: status === "going" ? "You're going! 🎉" : "Marked as interested!",
      data: { status, attendance },
    });
  } catch (error) {
    // Handle duplicate key (race condition)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already RSVP'd to this event",
      });
    }
    next(error);
  }
};

/**
 * @desc    Get my RSVP status for an event
 * @route   GET /api/attendances/my-status/:eventId
 * @access  Private
 */
export const getMyStatus = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const attendance = await Attendance.findOne({
      user: req.user._id,
      event: eventId,
    });

    res.json({
      success: true,
      data: {
        status: attendance?.status || null,
        attendance: attendance || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendees for an event
 * @route   GET /api/attendances/event/:eventId
 * @access  Public
 */
export const getEventAttendees = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const attendances = await Attendance.find({
      event: eventId,
      status: { $in: ["going", "interested"] },
    })
      .populate("user", "name avatar city isVerified")
      .sort({ createdAt: 1 })
      .limit(50);

    const going = attendances.filter((a) => a.status === "going");
    const interested = attendances.filter((a) => a.status === "interested");

    res.json({
      success: true,
      data: {
        going,
        interested,
        goingCount: going.length,
        interestedCount: interested.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my upcoming events (events I RSVP'd to)
 * @route   GET /api/attendances/my-events
 * @access  Private
 */
export const getMyEvents = async (req, res, next) => {
  try {
    const attendances = await Attendance.find({
      user: req.user._id,
      status: { $in: ["going", "interested"] },
    })
      .populate({
        path: "event",
        populate: [
          { path: "category", select: "name slug icon color" },
          { path: "host", select: "name avatar isVerified" },
        ],
      })
      .sort({ createdAt: -1 });

    // Filter out deleted events
    const valid = attendances.filter((a) => a.event && !a.event.isDeleted);

    res.json({
      success: true,
      data: {
        attendances: valid,
        total: valid.length,
      },
    });
  } catch (error) {
    next(error);
  }
};