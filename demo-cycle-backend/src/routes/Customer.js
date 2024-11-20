import express from "express";
import { Customer } from "../models/Customer.js";
import { Order } from "../models/Order.js";
import multer from "multer";
import path from "path";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/customers/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `customer-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

// Fetch all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
});

router.post("/", upload.single("customerImage"), async (req, res) => {
  try {
    const { customerName, leadType, description, address, transport } =
      req.body;

    // Construct customer object
    const customerData = {
      customerName,
      leadType,
      description,
      address,
      transport,
      // Only add customerImage if a file was uploaded
      ...(req.file ? { customerImage: req.file.path } : {}),
    };

    const newCustomer = new Customer(customerData);
    const savedCustomer = await newCustomer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Customer creation error:", error);
    res.status(400).json({
      message: "Error creating customer",
      error: error.message,
    });
  }
});

// Fetch customer by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer", error });
  }
});

// Delete customer by ID and associated orders
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the customer exists
    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    // Delete all orders linked to the customer
    await Order.deleteMany({ customer: id });

    // Delete the customer
    await Customer.findByIdAndDelete(id);

    res.status(200).json({
      message: "Customer and associated orders deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer and orders:", error);
    res.status(500).json({
      message: "Error deleting customer and associated orders",
      error,
    });
  }
});

// Update customer by ID
router.patch("/:id", upload.single("customerImage"), async (req, res) => {
  const { id } = req.params;
  const {
    customerName,
    customerImage,
    leadType,
    description,
    address,
    transport,
  } = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        customerName,
        customerImage,
        leadType,
        description,
        address,
        transport,
        ...(req.file ? { customerImage: req.file.path } : {}), // Add updated image path if a new file was uploaded
      },
      { new: true, runValidators: true } // Return the updated document and validate the changes
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error updating customer", error });
  }
});

export default router;
