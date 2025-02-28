const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Plain-text password
  role: {
    type: String,
    enum: ["Super Admin", "Manager", "Staff"],
    default: "Manager",
  },
});

module.exports = mongoose.model("Admin", AdminSchema);
