import mongoose from "mongoose";

// Define the coupon schema
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  couponType: {
    type: String,
    enum: ["perCycle", "totalAmount"],
    required: true,
  },
  expirationDate: {
    type: Date, 
  },
});

// Export the Coupon model
export const Coupon = mongoose.model("Coupon", couponSchema);
