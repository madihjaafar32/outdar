/**
 * Event Routes
 * Mounted at: /api/events
 */

import express from "express";
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getNearbyEvents,
} from "../controllers/event.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", listEvents);
router.get("/nearby", getNearbyEvents); // Must be BEFORE /:id (so "nearby" doesn't match :id)
router.get("/:id", getEvent);

// Host/admin only routes
router.post("/", requireAuth, requireRole("host", "admin"), createEvent);
router.put("/:id", requireAuth, updateEvent); // Owner check inside controller
router.delete("/:id", requireAuth, deleteEvent); // Owner check inside controller

export default router;