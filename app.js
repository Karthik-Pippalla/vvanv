const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const menuRoutes = require("./routes/menuRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const vendorRoutes = require("./routes/VendorRoutes");
const app = express();
connectDB();

// ✅ Enable JSON and Cookie Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Enable CORS with Credentials (for Frontend Requests)
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

// ✅ Set View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Route for Login Page
app.get("/", (req, res) => {
  res.render("adminLogin", { error: null });
});
app.use("/admin", adminRoutes);
app.use("/menu", menuRoutes);
app.use("/customers", customerRoutes); // ✅ Customer Routes
app.use("/orders", orderRoutes); // ✅ Order Routes
app.use("/vendors", vendorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
