import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET all categories with their subcategories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST a new category or a new subcategory
router.post("/", async (req, res) => {
  try {
    const { categoryName, subcategoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    if (subcategoryName) {
      // Find the category and update it by pushing a new subcategory.
      // The upsert: true option creates a new category if it doesn't exist.
      const updatedCategory = await Category.findOneAndUpdate(
        { name: categoryName },
        { $addToSet: { subcategories: subcategoryName } },
        { new: true, upsert: true, runValidators: true }
      );
      return res.status(200).json(updatedCategory);
    }
    
    // Add a new top-level category only
    else {
      const category = await Category.findOneAndUpdate(
        { name: categoryName },
        { name: categoryName },
        { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
      );
      return res.status(200).json(category);
    }

  } catch (err) {
    res.status(500).json({ error: "Failed to process request" });
  }
});

export default router;