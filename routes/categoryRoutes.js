// routes/categoryRoutes.js
import express from "express";
import Category from "../models/Category.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create category (Admin only)
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add categories" });
    }

    const { name } = req.body;
    const existing = await Category.findOne({ name });

    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a category (Admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can delete categories" });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted", category });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
