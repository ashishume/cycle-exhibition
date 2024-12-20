import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerImage: { type: String, default: null },
  leadType: { type: String, default: "" },
  description: { type: String, default: "" },
  transport: { type: String, default: "" },
  gstNumber: { type: String, default: "" },
});

export const Customer = mongoose.model("Customer", customerSchema);
