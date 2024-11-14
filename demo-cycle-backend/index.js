import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected with Express using ES modules!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
