import express from "express";
import { Customer } from "../models/Customer.js";
import { Order } from "../models/Order.js";
import multer from "multer";
import ImageKit from "imagekit";
import * as dotenv from "dotenv";
// import fs from "fs/promises";

dotenv.config();

const router = express.Router();

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: "public_q0/ktGeuDNKUfH7euI9rNgO+7K8=",
  privateKey: "private_J0MMlVXD6emQ8ff6TRCJWy0uhBw=",
  urlEndpoint: "https://ik.imagekit.io/cycle",
});
// Configure Multer for temporary storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

// Helper function to upload to ImageKit
async function uploadToImageKit(file) {
  try {
    const result = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: `customer-${Date.now()}-${file.originalname}`,
      folder: "/customers",
    });
    return result.url;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error("Failed to upload image");
  }
}

// Fetch all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
});

// Create customer
router.post("/", upload.single("customerImage"), async (req, res) => {
  try {
    const { customerName, leadType, description, gstNumber, transport } =
      req.body;

    let customerImage;
    if (req.file) {
      customerImage = await uploadToImageKit(req.file);
      console.log(customerImage);
    }

    const customerData = {
      customerName,
      leadType,
      description,
      gstNumber,
      transport,
      ...(customerImage ? { customerImage } : {}),
    };

    console.log(customerData);

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
    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    // Extract the file ID from the ImageKit URL if it exists
    if (customer.customerImage) {
      try {
        const fileId = customer.customerImage.split("/").pop();
        await imagekit.deleteFile(fileId);
      } catch (error) {
        console.error("Error deleting image from ImageKit:", error);
        // Continue with customer deletion even if image deletion fails
      }
    }

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
  const { customerName, leadType, description, gstNumber, transport } =
    req.body;

  try {
    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let customerImage = existingCustomer.customerImage;

    // If new image is uploaded, update it
    if (req.file) {
      // Delete old image if it exists
      if (existingCustomer.customerImage) {
        try {
          const fileId = existingCustomer.customerImage.split("/").pop();
          await imagekit.deleteFile(fileId);
        } catch (error) {
          console.error("Error deleting old image from ImageKit:", error);
        }
      }

      // Upload new image
      customerImage = await uploadToImageKit(req.file);
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        customerName,
        customerImage,
        leadType,
        description,
        gstNumber,
        transport,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error updating customer", error });
  }
});

export default router;
