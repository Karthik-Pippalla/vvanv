const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ["Veg", "Non-Veg"], required: true },
  price: { type: Number, required: true },
  tags: [String],
  nutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  main_ingredient: String,
  allergens: [String],
  stock: { type: Number, default: 50 },
  available: { type: Boolean, default: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true, // ✅ Ensures each menu item is linked to a vendor
  },
  image_url: {
    type: String,
    default:
      "https://t3.ftcdn.net/jpg/02/57/21/40/360_F_257214005_63auIfr9KN0gTHt28w6G8hoP2k45ScyP.jpg",
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Menu", MenuSchema);
