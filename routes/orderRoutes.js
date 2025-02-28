const express = require("express");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Menu = require("../models/Menu");
const router = express.Router();

// Get All Orders with Customer & Vendor Details
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name") // ✅ Get customer name only
      .populate({
        path: "items.menuItem",
        populate: { path: "vendor", select: "name" }, // ✅ Get vendor name
      });

    res.render("orders", { orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Order Status
router.get("/update/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: req.query.status });
    res.redirect("/orders");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Add New Order
router.post("/add", async (req, res) => {
  try {
    console.log("✅ Order Data Received:", req.body);

    const { customerId, items } = req.body;

    // Validate input data
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }

    let totalAmount = 0;
    let orderItems = [];

    // Fetch menu items & validate stock
    for (const item of items) {
      const menuItem = await Menu.findById(item.id);
      if (!menuItem) {
        return res
          .status(400)
          .json({ success: false, message: `Menu item not found: ${item.id}` });
      }

      // ✅ Add price to each order item
      const itemPrice = menuItem.price;

      // Calculate total price
      totalAmount += itemPrice * item.qty;

      // Push to order items list with price included
      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.qty,
        price: itemPrice, // ✅ Fix: Now including price in the order items
      });
    }

    // ✅ Create new order with price included
    const newOrder = new Order({
      customer: customerId,
      items: orderItems,
      totalAmount: totalAmount,
    });

    // ✅ Save order to database
    await newOrder.save();

    // ✅ Link the order to the customer
    await Customer.findByIdAndUpdate(customerId, {
      $push: { orderHistory: newOrder._id },
    });

    console.log("✅ Order Created Successfully:", newOrder);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Delete Order
router.get("/delete/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.redirect("/orders");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
