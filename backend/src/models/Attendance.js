/**
 * Attendance Model
 * Links users to events (the RSVP system)
 */

import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    status: {
      type: String,
      enum: ["going", "interested", "waitlist", "cancelled"],
      required: true,
    },
  },
  { timestamps: true }
);

// One user can only have ONE attendance record per event
attendanceSchema.index({ user: 1, event: 1 }, { unique: true });

// Fast queries: "who's going to event X?"
attendanceSchema.index({ event: 1, status: 1 });

// Fast queries: "what events is user X attending?"
attendanceSchema.index({ user: 1, status: 1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;