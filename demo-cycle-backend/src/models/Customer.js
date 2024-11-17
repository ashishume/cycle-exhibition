import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerImage: { type: String, default: null },
  leadType: { type: String, required: true },
  description: { type: String, default: "" },
  transport: { type: String, default: "" },
  address: { type: String, default: "" },
});

export const Customer = mongoose.model("Customer", customerSchema);
