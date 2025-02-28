const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.adminLogin = async (req, res) => {
  console.log("🟡 Login Attempt Started...");
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) {
    console.log("❌ Admin Not Found!");
    return res.render("adminLogin", {
      error: "Invalid credentials. Try again!",
    });
  }

  console.log("✅ Admin Found:", admin.username);
  console.log("🔐 Stored Password:", admin.password);
  console.log("🔑 Entered Password:", password);

  // Direct Password Comparison (Insecure)
  if (password !== admin.password) {
    console.log("❌ Password does not match!");
    return res.render("adminLogin", {
      error: "Invalid credentials. Try again!",
    });
  }

  console.log("✅ Password Matched! Generating Token...");
  const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  // ✅ Only set token if login is successful
  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  console.log("✅ Token Created:", token);
  console.log("✅ Admin Login Successful! Redirecting...");

  res.redirect("/admin/dashboard");
};

// Logout Admin
exports.logoutAdmin = (req, res) => {
  res.clearCookie("adminToken");
  res.redirect("/");
};
