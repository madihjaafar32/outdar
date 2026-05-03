/**
 * Event Controller
 *
 * Handles:
 *  - listEvents       → GET    /api/events (with filters)
 *  - getEvent         → GET    /api/events/:id
 *  - createEvent      → POST   /api/events       (host only)
 *  - updateEvent      → PUT    /api/events/:id   (owner only)
 *  - deleteEvent      → DELETE /api/events/:id   (owner only)
 *  - getNearbyEvents  → GET    /api/events/nearby (geospatial!)
 */

import Event from "../models/Event.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";

/**
 * @desc    List events with optional filters
 * @route   GET /api/events
 * @access  Public
 *
 * Query params:
 *   ?category=music         (slug or _id)
 *   ?city=Casablanca
 *   ?free=true              (free events only)
 *   ?upcoming=true          (default: true — only future events)
 *   ?search=jazz            (text search in title/description)
 *   ?limit=20               (default: 20)
 *   ?page=1                 (default: 1)
 *   ?sort=date              (date | -date | popular | rating)
 */
export const listEvents = async (req, res, next) => {
  try {
    const {
      category,
      city,
      free,
      upcoming = "true",
      search,
      limit = 20,
      page = 1,
      sort = "date",
    } = req.query;

    // Build query
    const query = {
      isDeleted: { $ne: true },
      isCancelled: { $ne: true },
    };

    // Upcoming filter (default true)
    if (upcoming !== "false") {
      query.date = { $gte: new Date() };
    }

    // Category filter (accept slug or ID)
    if (category) {
      const cat = mongoose.isValidObjectId(category)
        ? await Category.findById(category)
        : await Category.findOne({ slug: category.toLowerCase() });

      if (cat) {
        query.category = cat._id;
      } else {
        return res.json({
          success: true,
          data: { events: [], total: 0, page: 1, totalPages: 0 },
        });
      }
    }

    // City filter
    if (city) {
      query["location.city"] = new RegExp(`^${city}$`, "i");
    }

    // Free events filter
    if (free === "true") {
      query.price = 0;
    }

    // Text search (title + description)
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    // Sort options
    let sortObj = { date: 1 };
    if (sort === "-date") sortObj = { date: -1 };
    if (sort === "popular") sortObj = { attendeeCount: -1, date: 1 };
    if (sort === "rating") sortObj = { averageRating: -1, reviewCount: -1 };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), 100); // Max 100 per request

    // Execute queries in parallel
    const [events, total] = await Promise.all([
      Event.find(query)
        .populate("category", "name slug icon color")
        .populate("host", "name avatar role isVerified city")
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Event.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        events,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
export const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const event = await Event.findOne({
      _id: id,
      isDeleted: { $ne: true },
    })
      .populate("category", "name slug icon color")
      .populate("host", "name avatar role isVerified city bio");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (host only)
 */
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      categoryId,
      image,
      date,
      duration,
      capacity,
      price,
      location, // { coordinates: [lng, lat], address, venueName, city }
    } = req.body;

    // Quick validation
    if (!title || !description || !categoryId || !date || !capacity || !location) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates are required as [longitude, latitude]",
      });
    }

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    // Create event
    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      host: req.user._id,
      category: categoryId,
      image: image || "",
      date: new Date(date),
      duration: duration || 120,
      capacity,
      price: price || 0,
      location: {
        type: "Point",
        coordinates: location.coordinates,
        address: location.address,
        venueName: location.venueName || "",
        city: location.city,
      },
    });

    // Populate before returning
    await event.populate("category", "name slug icon color");
    await event.populate("host", "name avatar role isVerified");

    res.status(201).json({
      success: true,
      message: "Event created successfully! 🎉",
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private (owner or admin only)
 */
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Ownership check
    if (
      event.host.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own events",
      });
    }

    // Apply allowed updates
    const allowedFields = [
      "title",
      "description",
      "image",
      "date",
      "duration",
      "capacity",
      "price",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    if (req.body.location) {
      event.location = { ...event.location, ...req.body.location };
    }

    await event.save();

    await event.populate("category", "name slug icon color");
    await event.populate("host", "name avatar role isVerified");

    res.json({
      success: true,
      message: "Event updated",
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete event (soft delete)
 * @route   DELETE /api/events/:id
 * @access  Private (owner or admin only)
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (
      event.host.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own events",
      });
    }

    event.isDeleted = true;
    await event.save();

    res.json({
      success: true,
      message: "Event deleted",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get events near a location (geospatial!)
 * @route   GET /api/events/nearby?lng=-7.5898&lat=33.5731&maxDistance=10000
 * @access  Public
 */
export const getNearbyEvents = async (req, res, next) => {
  try {
    const { lng, lat, maxDistance = 10000 } = req.query; // maxDistance in meters

    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: "Provide lng and lat query parameters",
      });
    }

    const events = await Event.find({
      isDeleted: { $ne: true },
      isCancelled: { $ne: true },
      date: { $gte: new Date() },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    })
      .populate("category", "name slug icon color")
      .populate("host", "name avatar role isVerified")
      .limit(50);

    res.json({
      success: true,
      data: { events, count: events.length },
    });
  } catch (error) {
    next(error);
  }
};