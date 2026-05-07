/**
 * User Controller
 *
 * Handles:
 *  - getMyProfile     → GET    /api/users/me
 *  - getUserById      → GET    /api/users/:id            (public)
 *  - updateMyProfile  → PATCH  /api/users/me
 *  - getUserActivity  → GET    /api/users/:id/activity   (events + rsvps + reviews)
 */
console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  has_secret: !!process.env.CLOUDINARY_API_SECRET,
});

import mongoose from "mongoose";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Attendance from "../models/Attendance.js";
import Review from "../models/Review.js";
import cloudinary from "../config/cloudinary.js";

// ─── Helper: upload a buffer to Cloudinary ───────────────────────────────────
const uploadToCloudinary = (buffer, mimetype) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "outdar/avatars",
        resource_type: "image",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

/**
 * @desc    Get my own profile (full data, includes email)
 * @route   GET /api/users/me
 * @access  Private
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get any user's PUBLIC profile by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await User.findOne({
      _id: id,
      isDeleted: { $ne: true },
    }).select("name avatar role city bio isVerified createdAt");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update my own profile
 * @route   PATCH /api/users/me   (multipart/form-data OR application/json)
 * @access  Private
 *
 * Allowed fields: name, bio, city, avatar (file upload takes priority over text field)
 */
export const updateMyProfile = async (req, res, next) => {
  try {
    // avatar is handled separately via req.file → Cloudinary, never from req.body
    const allowedFields = ["name", "bio", "city"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // ── Avatar file upload (takes priority over any avatar text field) ──
    if (req.file) {
  try {
    console.log("req.file received:", req.file.originalname, req.file.size);
    const avatarUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    console.log("Cloudinary URL:", avatarUrl);
    updates.avatar = avatarUrl;
  } catch (uploadError) {
    console.error("Cloudinary upload error:", uploadError.message);
    return res.status(500).json({
      success: false,
      message: "Failed to upload avatar image. Please try again.",
    });
  }
} else {
  console.log("No req.file — file did not reach the backend");
}

    // ── Optional password change ──
    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password required to change password",
        });
      }

      const userWithPassword = await User.findById(req.user._id).select("+password");
      const isMatch = await userWithPassword.comparePassword(req.body.currentPassword);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (req.body.newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters",
        });
      }

      userWithPassword.password = req.body.newPassword;
      Object.assign(userWithPassword, updates);
      await userWithPassword.save();

      const user = userWithPassword.toJSON();
      return res.json({
        success: true,
        message: "Profile + password updated 🔐",
        data: { user },
      });
    }

    // ── Plain profile update ──
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated ✨",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a user's activity (their events + RSVPs + reviews)
 * @route   GET /api/users/:id/activity
 * @access  Public
 */
export const getUserActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const userId = new mongoose.Types.ObjectId(id);
    const now = new Date();

    const [hostedEvents, attendances, reviews] = await Promise.all([
      Event.find({ host: userId, isDeleted: { $ne: true } })
        .populate("category", "name slug icon color")
        .sort({ date: -1 })
        .limit(50)
        .lean(),

      Attendance.find({ user: userId, status: "going" })
        .populate({
          path: "event",
          select: "title image date duration price location attendeeCount capacity category host",
          populate: [
            { path: "category", select: "name slug icon color" },
            { path: "host", select: "name avatar role isVerified" },
          ],
        })
        .lean(),

      Review.find({ reviewer: userId })
        .populate("event", "title image date")
        .sort({ createdAt: -1 })
        .limit(30)
        .lean(),
    ]);

    const validAttendances = attendances.filter((a) => a.event);
    const upcomingRsvps = validAttendances
      .filter((a) => new Date(a.event.date) >= now)
      .map((a) => a.event);
    const pastRsvps = validAttendances
      .filter((a) => new Date(a.event.date) < now)
      .map((a) => a.event);

    let avgRating = 0;
    let totalReviews = 0;
    if (hostedEvents.length > 0) {
      const ratings = hostedEvents.filter((e) => e.averageRating > 0).map((e) => e.averageRating);
      totalReviews = hostedEvents.reduce((sum, e) => sum + (e.reviewCount || 0), 0);
      if (ratings.length > 0) {
        avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      }
    }

    res.json({
      success: true,
      data: {
        hostedEvents,
        upcomingRsvps,
        pastRsvps,
        reviews,
        stats: {
          totalHosted: hostedEvents.length,
          totalUpcoming: upcomingRsvps.length,
          totalPast: pastRsvps.length,
          totalReviews: reviews.length,
          avgRatingOnHostedEvents: parseFloat(avgRating.toFixed(1)),
          totalReviewsOnHostedEvents: totalReviews,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};