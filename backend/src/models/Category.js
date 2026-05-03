/**
 * Category Model
 * Predefined categories for events: Music, Sports, Food, Art, etc.
 */

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    icon: {
      type: String, // Emoji like "🎵"
      required: true,
    },

    color: {
      type: String, // Hex color like "#E63946"
      required: true,
    },

    description: {
      type: String,
      maxlength: 200,
      default: "",
    },

    order: {
      type: Number, // Display order in UI
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name if not provided
categorySchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;