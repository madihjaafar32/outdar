/**
 * Attendance Routes
 * Mounted at: /api/attendances
 */

import express from "express";
import {
  rsvp,
  getMyStatus,
  getEventAttendees,
  getMyEvents,
} from "../controllers/attendance.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All routes require auth
router.post("/", requireAuth, rsvp);
router.get("/my-events", requireAuth, getMyEvents);
router.get("/my-status/:eventId", requireAuth, getMyStatus);
router.get("/event/:eventId", getEventAttendees);

export default router;