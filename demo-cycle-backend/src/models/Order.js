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
        tyreLabel: { type: String },
        isTyreChargeable: { type: Boolean },
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
    },
    required: true,
  },
});

export const Order = mongoose.model("Order", orderSchema);
