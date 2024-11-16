import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g., "ranger-cycles"
});

export const Category = mongoose.model("Category", categorySchema);
