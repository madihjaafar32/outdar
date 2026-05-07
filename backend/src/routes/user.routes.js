/**
 * User Routes
 * Mounted at: /api/users
 */
import express from "express";
import {
  getMyProfile,
  getUserById,
  updateMyProfile,
  getUserActivity,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// /me must come BEFORE /:id (or "me" gets caught as :id)
router.get("/me", requireAuth, getMyProfile);

// upload.single("avatar") parses multipart/form-data and attaches req.file
router.patch("/me", requireAuth, upload.single("avatar"), updateMyProfile);

// Public profile + activity
router.get("/:id", getUserById);
router.get("/:id/activity", getUserActivity);

export default router;