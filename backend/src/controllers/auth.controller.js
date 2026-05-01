/**
 * Auth Controller
 *
 * Handles:
 *  - register  → POST /api/auth/register
 *  - login     → POST /api/auth/login
 *  - getMe     → GET  /api/auth/me  (protected)
 */

import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, city, role } = req.body;

    // 1. Quick input check (we'll add proper validation in Slice 9)
    if (!name || !email || !password || !city) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, and city",
      });
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // 3. Determine role
    //    Allowed: 'user' (default) or 'host' (will need admin verification later)
    //    Block: 'admin' from public registration
    let userRole = "user";
    if (role === "host") userRole = "host";

    // 4. Create the user (password gets auto-hashed by pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      city: city.trim(),
      role: userRole,
    });

    // 5. Sign JWT — embed userId and role in the token
    const token = signToken({
      userId: user._id,
      role: user.role,
    });

    // 6. Return user (password auto-stripped by toJSON method) + token
    res.status(201).json({
      success: true,
      message: `Welcome to OUTDAR, ${user.name}! 🎉`,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Quick input check
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // 2. Find user by email — explicitly include password (it's select:false by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      // Generic message — don't reveal whether email exists (security)
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Check if account is soft-deleted
    if (user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: "This account has been deactivated",
      });
    }

    // 4. Compare password using the method we built in User model
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Sign JWT
    const token = signToken({
      userId: user._id,
      role: user.role,
    });

    // 6. Return user + token (toJSON strips password)
    res.json({
      success: true,
      message: `Welcome back, ${user.name}! 👋`,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private (requires valid JWT)
 *
 * Note: req.user is attached by `requireAuth` middleware
 */
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};