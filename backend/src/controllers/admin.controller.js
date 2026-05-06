/**
 * Admin Controller
 * Full platform management
 */

import User from "../models/User.js";
import Event from "../models/Event.js";
import Attendance from "../models/Attendance.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";

/**
 * @desc    Get platform stats
 * @route   GET /api/admin/stats
 */
export const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalHosts,
      pendingHosts,
      totalEvents,
      activeEvents,
      totalAttendances,
      totalReviews,
    ] = await Promise.all([
      User.countDocuments({ isDeleted: { $ne: true }, role: "user" }),
      User.countDocuments({ isDeleted: { $ne: true }, role: "host" }),
      User.countDocuments({ isDeleted: { $ne: true }, role: "host", isVerified: false }),
      Event.countDocuments({ isDeleted: { $ne: true } }),
      Event.countDocuments({ isDeleted: { $ne: true }, date: { $gte: new Date() } }),
      Attendance.countDocuments({ status: { $in: ["going", "interested"] } }),
      Review.countDocuments({ isDeleted: { $ne: true } }),
    ]);

    // Recent signups (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    // Recent events (last 7 days)
    const recentEvents = await Event.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    // Top 5 most popular events
    const topEvents = await Event.find({
      isDeleted: { $ne: true },
      date: { $gte: new Date() },
    })
      .populate("category", "name icon color")
      .populate("host", "name")
      .sort({ attendeeCount: -1 })
      .limit(5)
      .select("title attendeeCount capacity date location category host");

    // Events by category
    const eventsByCategory = await Event.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Populate category names
    const categoryIds = eventsByCategory.map((e) => e._id);
    const categoryDocs = await Category.find({ _id: { $in: categoryIds } });
    const categoryMap = {};
    categoryDocs.forEach((c) => { categoryMap[c._id.toString()] = c; });

    const categoryStats = eventsByCategory.map((e) => ({
      category: categoryMap[e._id?.toString()],
      count: e.count,
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalHosts,
          pendingHosts,
          totalEvents,
          activeEvents,
          totalAttendances,
          totalReviews,
          recentSignups,
          recentEvents,
        },
        topEvents,
        categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;

    const query = { isDeleted: { $ne: true } };
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("-password"),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        users,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify a host
 * @route   PATCH /api/admin/users/:id/verify-host
 */
export const verifyHost = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "host") {
      return res.status(400).json({
        success: false,
        message: "User is not a host",
      });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      message: `${user.name} is now a Verified Host! ✓`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Ban a user
 * @route   PATCH /api/admin/users/:id/ban
 */
export const banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot ban an admin" });
    }

    user.isDeleted = true;
    await user.save();

    res.json({
      success: true,
      message: `${user.name} has been banned`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get pending host verifications
 * @route   GET /api/admin/hosts/pending
 */
export const getPendingHosts = async (req, res, next) => {
  try {
    const hosts = await User.find({
      role: "host",
      isVerified: false,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .select("-password");

    // Get event count for each host
    const hostsWithStats = await Promise.all(
      hosts.map(async (host) => {
        const eventCount = await Event.countDocuments({
          host: host._id,
          isDeleted: { $ne: true },
        });
        return { ...host.toJSON(), eventCount };
      })
    );

    res.json({
      success: true,
      data: { hosts: hostsWithStats, total: hostsWithStats.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all events (admin view)
 * @route   GET /api/admin/events
 */
export const getAdminEvents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const query = { isDeleted: { $ne: true } };
    if (search) query.title = new RegExp(search, "i");

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate("category", "name icon color")
        .populate("host", "name isVerified")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Event.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        events,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Force delete an event
 * @route   DELETE /api/admin/events/:id
 */
export const forceDeleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    event.isDeleted = true;
    await event.save();

    res.json({ success: true, message: "Event removed from platform" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get categories (admin)
 * @route   GET /api/admin/categories
 */
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PATCH /api/admin/categories/:id
 */
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};