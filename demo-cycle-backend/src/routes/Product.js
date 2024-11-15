// routes/productRoutes.js
import express from "express";
import { Category } from "../ models/Category.js";
import { Product } from "../ models/Product.js";

const router = express.Router();

// POST: create a new product
router.post("/", async (req, res) => {
  try {
    const {
      brand,
      imageLinks,
      description,
      subtitle,
      category,
      variants,
      bundleSize,
      tyreTypeLabel,
    } = req.body;

    // Check if category exists in Category collection
    const foundCategory = await Category.findOne({ slug: category });
    if (!foundCategory) {
      return res.status(400).json({ error: "Category not found" });
    }

    // Create a new product with the category reference
    const newProduct = new Product({
      brand,
      imageLinks,
      description,
      subtitle,
      category: foundCategory._id, // Reference the ObjectId of the Category
      variants,
      bundleSize,
      tyreTypeLabel,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the product" });
  }
});

// GET: Retrieve all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving products" });
  }
});

// GET: Retrieve a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("category"); // Populate category details
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the product" });
  }
});

// PATCH: Update a product by ID
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      brand,
      imageLinks,
      description,
      subtitle,
      category,
      variants,
      bundleSize,
      tyreTypeLabel,
    } = req.body;

    // Validate category ID
    if (category) {
      const foundCategory = await Category.findById(category);
      if (!foundCategory) {
        return res.status(400).json({ error: "Category not found" });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        brand,
        imageLinks,
        description,
        subtitle,
        category,
        variants,
        bundleSize,
        tyreTypeLabel,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the product" });
  }
});

// DELETE: Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
});

export default router;
