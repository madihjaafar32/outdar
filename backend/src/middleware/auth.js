/**
 * Authentication Middleware
 * - requireAuth: User must be logged in (valid JWT)
 * - requireRole: User must have a specific role
 */

import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

/**
 * Middleware: Require authentication
 *
 * Reads the JWT from the Authorization header (format: "Bearer <token>")
 * Verifies it, fetches the user, attaches user to req.user
 * If anything fails -> 401 Unauthorized
 */
export const requireAuth = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Token expired, please login again"
            : "Invalid token",
      });
    }

    // 3. Find user in DB (make sure they still exist + aren't deleted)
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    if (user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated",
      });
    }

    // 4. Attach user to request — controllers can now use req.user
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware: Require a specific role
 * Usage: router.delete('/event/:id', requireAuth, requireRole('admin'), handler)
 *
 * @param {...String} allowedRoles - One or more allowed roles
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires role(s): ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};