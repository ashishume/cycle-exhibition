import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./src/routes/Product.js";
import categoryRoutes from "./src/routes/Category.js";
import customerRoutes from "./src/routes/Customer.js";
import orderRoutes from "./src/routes/Orders.js";
import couponRoutes from "./src/routes/Coupon.js";

import cors from "cors";
import { ensureDirectoryExists } from "./src/utils/createDir.js";
import path from "path";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

ensureDirectoryExists(path.resolve("uploads/customers"));

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected with Express using ES modules!");
});
app.use(
  "/uploads",
  express.static(path.resolve("../demo-cycle-backend/uploads"))
);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
