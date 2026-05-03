/**
 * Event Model
 *
 * The core entity of OUTDAR.
 * Includes geospatial location for "events near me" queries.
 */

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    image: {
      type: String, // Picsum URL or Cloudinary URL later
      default: "",
    },

    /**
     * Geospatial location
     * Format: { type: 'Point', coordinates: [longitude, latitude] }
     * Note: MongoDB GeoJSON uses [lng, lat] order — NOT [lat, lng]!
     */
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (v) => Array.isArray(v) && v.length === 2,
          message: "Coordinates must be [longitude, latitude]",
        },
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      venueName: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
    },

    date: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: function (v) {
          // Only validate on creation, not on update
          if (this.isNew) {
            return v > new Date();
          }
          return true;
        },
        message: "Event date must be in the future",
      },
    },

    duration: {
      type: Number, // Duration in minutes
      default: 120,
      min: 30,
      max: 1440, // 24 hours
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 1000,
    },

    price: {
      type: Number, // 0 = free, otherwise MAD
      default: 0,
      min: 0,
    },

    /**
     * Denormalized counters (updated by Attendance creation/deletion)
     * Faster than counting attendances on every page load
     */
    attendeeCount: {
      type: Number,
      default: 0,
    },
    interestedCount: {
      type: Number,
      default: 0,
    },

    /**
     * Reviews stats (updated by Review creation)
     */
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false, // Admin can feature events to homepage
    },

    isCancelled: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Geospatial index for "events near me" queries
 * Enables: Event.find({ location: { $near: { ... } } })
 */
eventSchema.index({ location: "2dsphere" });

/**
 * Compound indexes for common queries
 */
eventSchema.index({ date: 1, "location.city": 1 }); // Browse by city + date
eventSchema.index({ category: 1, date: 1 }); // Browse by category
eventSchema.index({ host: 1, date: -1 }); // User's hosted events

/**
 * Virtual: Is the event in the past?
 */
eventSchema.virtual("isPast").get(function () {
  return this.date < new Date();
});

/**
 * Virtual: Is the event full?
 */
eventSchema.virtual("isFull").get(function () {
  return this.attendeeCount >= this.capacity;
});

/**
 * Virtual: Spots remaining
 */
eventSchema.virtual("spotsRemaining").get(function () {
  return Math.max(0, this.capacity - this.attendeeCount);
});

// Include virtuals in JSON output
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;