/**
 * User Model
 * Represents a user account on OUTDAR.
 * Roles: 'user' (default), 'host' (verified by admin), 'admin'
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default in queries
    },

    role: {
      type: String,
      enum: ["user", "host", "admin"],
      default: "user",
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    bio: {
      type: String,
      maxlength: [200, "Bio cannot exceed 200 characters"],
      default: "",
    },

    avatar: {
      type: String, // Cloudinary URL (added in Slice 3+)
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false, // Admin grants the "Verified Host" badge
    },

    isDeleted: {
      type: Boolean,
      default: false, // Soft delete
      select: false,
    },
  },
  {
    timestamps: true, // Adds createdAt + updatedAt automatically
  }
);

/**
 * Pre-save hook: Hash the password before saving
 * Runs ONLY if password was modified (e.g. on register or password change)
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: Compare a plain password with the hashed one
 * Usage: const isMatch = await user.comparePassword('myPlainPassword');
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Transform JSON output: Remove password and __v from API responses
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;