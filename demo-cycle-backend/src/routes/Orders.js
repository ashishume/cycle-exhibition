import { Order } from "../models/Order.js";
import { Customer } from "../models/Customer.js";
import { Product } from "../models/Product.js";
import express from "express";

const router = express.Router();

// Add a new order
router.post("/", async (req, res) => {
  const { customer, products, pricing } = req.body;

  try {
    // Check if customer exists
    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Validate and enrich product data
    const enrichedProducts = [];
    for (const product of products) {
      const existingProduct = await Product.findById(product._id);
      if (!existingProduct) {
        return res
          .status(404)
          .json({ message: `Product with ID ${product._id} not found` });
      }

      // Add product details to the order
      enrichedProducts.push({
        _id: product._id,
        brand: product.brand,
        variant: product.variant,
        bundleQuantity: product.bundleQuantity,
        totalProducts: product.totalProducts,
        tyreLabel: product.tyreLabel,
        isTyreChargeable: product.isTyreChargeable,
        costPerProduct: product.costPerProduct,
        bundleSize: product.bundleSize,
        total: product.total,
      });
    }

    // Create a new order
    const newOrder = new Order({
      customer,
      products: enrichedProducts,
      pricing,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: "Error creating order", error });
  }
});

// Fetch all orders
router.get("/", async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "customerName") // Populate customer name
      .populate("products._id", "productName"); // Populate product name
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Fetch order by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate("customer", "customerName")
      .populate("products._id", "productName");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
});

// Delete order by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
});

export default router;
