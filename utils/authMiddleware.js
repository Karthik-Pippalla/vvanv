const jwt = require("jsonwebtoken");

exports.authenticateAdmin = (req, res, next) => {
  console.log("🔍 Checking Authentication...");

  console.log("🔍 Cookies Received:", req.cookies);
  const token = req.cookies.adminToken;

  if (!token) {
    console.log("❌ No Token Found. Access Denied!");
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified! Admin ID:", decoded.adminId);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    console.log("❌ Invalid Token. Redirecting to login...");
    return res.redirect("/");
  }
};
