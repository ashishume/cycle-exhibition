import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  imageLinks: [{ type: String, required: true }],
  description: { type: String },
  subtitle: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  variants: [
    {
      costPerProduct: { type: Number, default: 0 },
      size: { type: Number, required: true },
    },
  ],
  bundleSize: { type: Number, required: true },
  tyreTypeLabel: { type: String, required: true },
});

export const Product = mongoose.model("Product", productSchema);
