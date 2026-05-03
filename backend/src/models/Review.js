/**
 * Review Model
 * Users rate events after attending
 */

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      maxlength: 500,
      default: "",
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

// One review per user per event
reviewSchema.index({ event: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ host: 1 });
reviewSchema.index({ event: 1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;