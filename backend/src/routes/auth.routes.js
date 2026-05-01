/**
 * Auth Routes
 * Mounted at: /api/auth
 */

import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * Public routes
 */
router.post("/register", register);
router.post("/login", login);

/**
 * Protected routes (require valid JWT)
 */
router.get("/me", requireAuth, getMe);

export default router;