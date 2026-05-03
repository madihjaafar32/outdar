/**
 * Review Routes
 * Mounted at: /api/reviews
 */

import express from "express";
import {
  createReview,
  getEventReviews,
  getMyReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, createReview);
router.get("/event/:eventId", getEventReviews);
router.get("/my-review/:eventId", requireAuth, getMyReview);
router.delete("/:id", requireAuth, deleteReview);

export default router;