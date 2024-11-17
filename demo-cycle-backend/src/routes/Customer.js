import express from "express";
import { Customer } from "../models/Customer.js";
import { Order } from "../models/Order.js";
const router = express.Router();

// Fetch all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
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

// Add a new customer
router.post("/", async (req, res) => {
  const {
    customerName,
    customerImage,
    leadType,
    description,
    address,
    transport,
  } = req.body;
  try {
    const newCustomer = new Customer({
      customerName,
      customerImage,
      leadType,
      transport,
      description,
      address,
    });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error creating customer", error });
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
router.patch("/:id", async (req, res) => {
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
