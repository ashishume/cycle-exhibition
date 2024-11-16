import express from "express";
import { Customer } from "../models/Customer.js";
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
  const { customerName, customerImage, leadType, description, address } =
    req.body;
  try {
    const newCustomer = new Customer({
      customerName,
      customerImage,
      leadType,
      description,
      address,
    });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error creating customer", error });
  }
});

// Delete customer by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
});

// Update customer by ID
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { customerName, customerImage, leadType, description, address } =
    req.body;

  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      {
        customerName,
        customerImage,
        leadType,
        description,
        address,
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
