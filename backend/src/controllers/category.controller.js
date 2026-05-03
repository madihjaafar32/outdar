/**
 * Category Controller
 */

import Category from "../models/Category.js";

/**
 * @desc    List all active categories
 * @route   GET /api/categories
 * @access  Public
 */
export const listCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
      name: 1,
    });

    res.json({
      success: true,
      data: { categories, count: categories.length },
    });
  } catch (error) {
    next(error);
  }
};