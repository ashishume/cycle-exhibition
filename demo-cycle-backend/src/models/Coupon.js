import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g., "SAVE20"
  discount: { type: Number, required: true, min: 0, max: 100 }, // Percentage discount (0-100)
  isActive: { type: Boolean, default: true }, // To enable/disable coupon
  expirationDate: { type: Date }, // Optional expiration date
});

export const Coupon = mongoose.model("Coupon", couponSchema);
