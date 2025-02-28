const express = require("express");
const Menu = require("../models/Menu");
const router = express.Router();
const Vendor = require("../models/Vendor"); // ✅ Import Vendor model

// ✅ Get All Menu Items and Render Menu Page
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().populate("vendor"); // ✅ Populate vendor details
    const vendors = await Vendor.find(); // ✅ Fetch vendors

    res.render("menu", { menu, vendors }); // ✅ Pass vendors to the template
  } catch (error) {
    console.error("❌ Error fetching menu items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Add New Menu Item
// Add New Menu Item
router.post("/add", async (req, res) => {
  try {
    const {
      title,
      category,
      price,
      stock,
      image_url,
      vendor,
      nutrition,
      allergens,
    } = req.body;

    // ✅ Validate if vendor exists
    if (!vendor) {
      return res.status(400).json({ message: "Vendor is required!" });
    }

    const existingVendor = await Vendor.findById(vendor);
    if (!existingVendor) {
      return res.status(400).json({ message: "Invalid vendor ID!" });
    }

    const newItem = new Menu({
      title,
      category,
      price,
      stock,
      image_url: image_url || "https://default-image.jpg",
      vendor, // ✅ Ensure vendor is assigned
      nutrition: nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 },
      allergens: allergens || [],
    });

    await newItem.save();
    res.status(201).json({ message: "Menu item added successfully!", newItem });
  } catch (error) {
    console.error("❌ Error adding menu item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json([]);
    }

    const menuItems = await Menu.find({ title: new RegExp(query, "i") }).limit(
      5
    );
    res.json(menuItems);
  } catch (error) {
    console.error("❌ Error searching menu items:", error);
    res.status(500).json({ message: "Error fetching menu items" });
  }
});

// ✅ Update Menu Item
router.put("/update/:id", async (req, res) => {
  try {
    const { title, category, price, stock, image_url } = req.body;
    if (!title || !category || !price || !stock) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const updatedItem = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        price,
        stock,
        available: stock > 0,
        image_url:
          image_url ||
          "https://t3.ftcdn.net/jpg/02/57/21/40/360_F_257214005_63auIfr9KN0gTHt28w6G8hoP2k45ScyP.jpg",
      },
      { new: true }
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({ success: true, message: "Menu Item Updated!", updatedItem });
  } catch (error) {
    console.error("❌ Error updating menu item:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating menu item" });
  }
});

// ✅ Delete Menu Item
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({ success: true, message: "Menu Item Deleted!" });
  } catch (error) {
    console.error("❌ Error deleting menu item:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting menu item" });
  }
});

module.exports = router;
