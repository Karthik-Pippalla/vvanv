const express = require("express");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Menu = require("../models/Menu");
const Customer = require("../models/Customer"); // ✅ Make sure this is imported

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Render Admin Login Page
router.get("/login", (req, res) => {
  res.render("adminLogin", { error: null });
});

// ✅ Handle Admin Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  // ✅ Direct Password Comparison (if stored in plain text)
  if (!admin || password !== admin.password) {
    return res.render("adminLogin", {
      error: "Invalid credentials. Try again!",
    });
  }

  console.log("✅ Admin Authenticated. Generating token...");
  const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  // ✅ Store token in HTTP-only cookies
  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.redirect("/admin/dashboard");
});

// ✅ Middleware to Protect Routes
const authenticateAdmin = (req, res, next) => {
  console.log("🔍 Checking Authentication...");
  console.log("🔍 Cookies Received:", req.cookies);

  if (!req.cookies || !req.cookies.adminToken) {
    console.log("❌ No Token Found. Redirecting to login...");
    return res.redirect("/admin/login");
  }

  try {
    const decoded = jwt.verify(req.cookies.adminToken, JWT_SECRET);
    req.adminId = decoded.adminId;
    console.log("✅ Admin Verified:", decoded.adminId);
    next();
  } catch (error) {
    console.log("❌ Invalid Token. Redirecting to login...");
    return res.redirect("/admin/login");
  }
};

// ✅ Admin Dashboard Page (Protected Route)
router.get("/dashboard", authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("customer");
    const customers = await Customer.find();
    const menuItems = await Menu.find();
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get Top-Selling Item
    const topItem = await Menu.findOne().sort({ stock: -1 });

    res.render("dashboard", { orders, customers, menuItems, revenue, topItem });
  } catch (error) {
    console.error("❌ Error in Dashboard Route:", error);
    res.status(500).json({ message: error.message });
  }
});
// ✅ Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.redirect("/admin/login");
});

module.exports = router;
