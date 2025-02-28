const express = require("express");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const router = express.Router();

// ✅ Get All Customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().populate("orderHistory");
    res.render("customer", { customers });
  } catch (error) {
    console.error("❌ Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers" });
  }
});

// ✅ Add New Customer
router.post("/add", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      orderHistory: [],
    });

    await newCustomer.save();
    res
      .status(201)
      .json({ success: true, message: "Customer Added!", newCustomer });
  } catch (error) {
    console.error("❌ Error adding customer:", error);
    res.status(500).json({ success: false, message: "Error adding customer" });
  }
});

// ✅ Get Single Customer Details & Past Orders
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "orderHistory"
    );

    if (!customer) {
      return res.status(404).send("Customer Not Found");
    }

    res.render("customerDetails", { customer });
  } catch (error) {
    console.error("❌ Error fetching customer details:", error);
    res.status(500).send("Error fetching customer details");
  }
});

// ✅ Update Customer
router.put("/update/:id", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address },
      { new: true }
    );

    if (!updatedCustomer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.json({ success: true, message: "Customer Updated!", updatedCustomer });
  } catch (error) {
    console.error("❌ Error updating customer:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating customer" });
  }
});

// ✅ Delete Customer
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.json({ success: true, message: "Customer Deleted!" });
  } catch (error) {
    console.error("❌ Error deleting customer:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting customer" });
  }
});

module.exports = router;
