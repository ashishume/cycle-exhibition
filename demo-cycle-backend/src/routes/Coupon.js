import express from "express";
import { Coupon } from "../models/Coupon.js";

const router = express.Router();

// POST: Create a new coupon
router.post("/", async (req, res) => {
  try {
    const { code, discount, expirationDate } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }

    const newCoupon = new Coupon({ code, discount, expirationDate });
    await newCoupon.save();
    res.status(201).json({
      message: "Coupon created successfully",
      coupon: newCoupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the coupon" });
  }
});

// GET: Retrieve all coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error retrieving coupons:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving coupons" });
  }
});

// GET: Retrieve a single coupon by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.status(200).json(coupon);
  } catch (error) {
    console.error("Error retrieving coupon:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the coupon" });
  }
});

// PATCH: Update a coupon by ID
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expirationDate, isActive } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discount, expirationDate, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the coupon" });
  }
});

// DELETE: Delete a coupon by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon deleted successfully",
      coupon: deletedCoupon,
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the coupon" });
  }
});

export default router;
