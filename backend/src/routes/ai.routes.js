/**
 * AI Routes
 * Mounted at: /api/ai
 */

import express from "express";
import { chat, getSessions, getSession } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/chat", requireAuth, chat);
router.get("/sessions", requireAuth, getSessions);
router.get("/sessions/:id", requireAuth, getSession);

export default router;