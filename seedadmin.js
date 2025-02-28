require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Function to seed admin
const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists. No new admin created.");
      process.exit();
    }

    const newAdmin = new Admin({
      username: "admin",
      password: "admin123", // ⚠️ Stored as plain text
    });

    await newAdmin.save();
    console.log("✅ Admin account created successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
