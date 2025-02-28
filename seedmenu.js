require("dotenv").config();
const mongoose = require("mongoose");
const Menu = require("./models/Menu");
const Vendor = require("./models/Vendor");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

const assignVendors = async () => {
  try {
    const vendors = await Vendor.find();
    if (vendors.length === 0) {
      console.error("❌ No vendors found! Please seed vendors first.");
      mongoose.connection.close();
      return;
    }

    const menuItems = await Menu.find();
    for (let item of menuItems) {
      if (!item.vendor) {
        item.vendor = vendors[Math.floor(Math.random() * vendors.length)]._id;
        await item.save();
      }
    }

    console.log("✅ Vendors assigned to all menu items!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error assigning vendors:", error);
    mongoose.connection.close();
  }
};

assignVendors();
