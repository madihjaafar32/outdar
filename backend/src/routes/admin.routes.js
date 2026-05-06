/**
 * Admin Routes
 * Mounted at: /api/admin
 * ALL routes require admin role
 */

import express from "express";
import {
  getStats,
  getUsers,
  verifyHost,
  banUser,
  getPendingHosts,
  getAdminEvents,
  forceDeleteEvent,
  getAdminCategories,
  updateCategory,
} from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// All admin routes protected
router.use(requireAuth, requireRole("admin"));

router.get("/stats",                    getStats);
router.get("/users",                    getUsers);
router.patch("/users/:id/verify-host",  verifyHost);
router.patch("/users/:id/ban",          banUser);
router.get("/hosts/pending",            getPendingHosts);
router.get("/events",                   getAdminEvents);
router.delete("/events/:id",            forceDeleteEvent);
router.get("/categories",               getAdminCategories);
router.patch("/categories/:id",         updateCategory);

export default router;