import express from "express";
import { Category } from "../models/Category.js";

const router = express.Router();

// POST: Create a new category
router.post("/", async (req, res) => {
  try {
    const { name, slug } = req.body;

    // Check if the category with the same slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Category with this slug already exists" });
    }

    const newCategory = new Category({ name, slug });
    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the category" });
  }
});

// GET: Retrieve all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving categories" });
  }
});

// GET: Retrieve a single category by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error retrieving category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the category" });
  }
});

// PATCH: Update an existing category by ID
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the category" });
  }
});

// DELETE: Delete a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the category" });
  }
});

export default router;
