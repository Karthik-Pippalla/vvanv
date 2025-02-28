const express = require("express");
const Vendor = require("../models/Vendor");
const Menu = require("../models/Menu");
const Order = require("../models/Order"); // Import Order model
const router = express.Router();

// Get all vendors
router.get("/", async (req, res) => {
  const vendors = await Vendor.find();
  res.render("vendors", { vendors });
});

// ✅ Get Vendor Details, Menu Items, and Orders
router.get("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).send("Vendor Not Found");
    }

    // ✅ Get menu items supplied by this vendor
    const items = await Menu.find({ vendor: vendor._id });

    // ✅ Find orders containing this vendor's menu items
    const orders = await Order.find({
      "items.menuItem": { $in: items.map((item) => item._id) },
    })
      .populate({
        path: "items.menuItem",
        populate: { path: "vendor", select: "name" }, // Ensures vendor details are available
      })
      .populate("customer", "name"); // Only fetch customer name

    // ✅ Format orders for cleaner display
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      customerName: order.customer ? order.customer.name : "Guest",
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: order.createdAt, // Ensure correct date field
      items: order.items.map((i) => ({
        title: i.menuItem.title,
        quantity: i.quantity,
      })),
    }));

    res.render("vendorDetails", { vendor, items, orders: formattedOrders });
  } catch (error) {
    console.error("❌ Error fetching vendor details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Add a New Vendor
router.post("/add", async (req, res) => {
  try {
    const { name, contact, email, address } = req.body;

    // ✅ Validate input fields
    if (!name || !contact || !email || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res
        .status(400)
        .json({ message: "Vendor with this email already exists." });
    }

    // ✅ Create new vendor
    const newVendor = new Vendor({ name, contact, email, address });
    await newVendor.save();

    console.log("✅ New Vendor Added:", newVendor);
    res.redirect("/vendors");
  } catch (error) {
    console.error("❌ Error adding vendor:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete vendor
router.get("/delete/:id", async (req, res) => {
  await Vendor.findByIdAndDelete(req.params.id);
  res.redirect("/vendors");
});

// Add item to vendor
router.post("/add-item", async (req, res) => {
  const { vendorId, title, category, price } = req.body;
  await new Menu({ title, category, price, vendor: vendorId }).save();
  res.redirect(`/vendors/${vendorId}`);
});

module.exports = router;
