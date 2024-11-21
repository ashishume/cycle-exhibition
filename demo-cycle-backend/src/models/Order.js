import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  products: {
    type: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        brand: { type: String },
        variant: { type: Number },
        bundleQuantity: { type: Number },
        totalProducts: { type: Number },
        tyreType: { type: String },
        brandtype: { type: String },
        isTyreChargeable: { type: Boolean },
        additionalCost: { type: Number },
        costPerProduct: { type: Number },
        bundleSize: { type: Number },
        total: { type: Number },
      },
    ],
    required: true,
  },
  pricing: {
    type: {
      subtotal: { type: Number },
      tyreCharge: { type: Number },
      discount: { type: Number },
      gst: { type: Number },
      total: { type: Number },
      discountApplied: { type: Boolean },
      discountCode: { type: String },
      couponType: { type: String },
      discountAmount: { type: Number },
      additionalCost: { type: Number },
    },
    required: true,
  },
  remarks: { type: String },
  orderStatus: { type: String, default: "Order processing" },
});

export const Order = mongoose.model("Order", orderSchema);
