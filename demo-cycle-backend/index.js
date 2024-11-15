import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./src/routes/Product.js";
import categoryRoutes from "./src/routes/Category.js";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Adjust the frontend URL as needed
    methods: ["GET", "POST", "PATCH", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials if necessary (e.g., for cookies)
  })
);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected with Express using ES modules!");
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
