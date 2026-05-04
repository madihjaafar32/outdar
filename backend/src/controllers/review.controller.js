/**
 * Review Controller
 */

import Review from "../models/Review.js";
import Event from "../models/Event.js";
import Attendance from "../models/Attendance.js";

/**
 * @desc    Create a review
 * @route   POST /api/reviews
 * @access  Private (must have attended the event)
 */
export const createReview = async (req, res, next) => {
  try {
    const { eventId, rating, comment } = req.body;

    if (!eventId || !rating) {
      return res.status(400).json({
        success: false,
        message: "eventId and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event || event.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check user attended this event
    const attendance = await Attendance.findOne({
      user: req.user._id,
      event: eventId,
      status: { $in: ["going", "interested"] },
    });

    if (!attendance) {
      return res.status(403).json({
        success: false,
        message: "You can only review events you attended",
      });
    }

    // Check not already reviewed
    const existing = await Review.findOne({
      event: eventId,
      reviewer: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this event",
      });
    }

    // Create review
    const review = await Review.create({
      event: eventId,
      reviewer: req.user._id,
      host: event.host,
      rating,
      comment: comment || "",
    });

    // Update event average rating
    const allReviews = await Review.find({
      event: eventId,
      isDeleted: { $ne: true },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Event.findByIdAndUpdate(eventId, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    // Populate reviewer info before returning
    await review.populate("reviewer", "name avatar");

    res.status(201).json({
      success: true,
      message: "Review submitted! Thanks for your feedback 🌟",
      data: { review },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this event",
      });
    }
    next(error);
  }
};

/**
 * @desc    Get reviews for an event
 * @route   GET /api/reviews/event/:eventId
 * @access  Public
 */
export const getEventReviews = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const reviews = await Review.find({
      event: eventId,
      isDeleted: { $ne: true },
    })
      .populate("reviewer", "name avatar city")
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      success: true,
      data: {
        reviews,
        count: reviews.length,
        averageRating: Math.round(avgRating * 10) / 10,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my review for an event
 * @route   GET /api/reviews/my-review/:eventId
 * @access  Private
 */
export const getMyReview = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const review = await Review.findOne({
      event: eventId,
      reviewer: req.user._id,
      isDeleted: { $ne: true },
    });

    res.json({
      success: true,
      data: { review: review || null },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete own review
 * @route   DELETE /api/reviews/:id
 * @access  Private (owner only)
 */
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    review.isDeleted = true;
    await review.save();

    // Recalculate event rating
    const remaining = await Review.find({
      event: review.event,
      isDeleted: { $ne: true },
    });

    const avgRating =
      remaining.length > 0
        ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length
        : 0;

    await Event.findByIdAndUpdate(review.event, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: remaining.length,
    });

    res.json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    next(error);
  }
};
