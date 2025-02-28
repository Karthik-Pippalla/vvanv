const Menu = require("../models/Menu");
const bucket = require("../config/googleCloudConfig");

exports.createMenuItem = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded!" });

    const blob = bucket.file(Date.now() + "-" + req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on("finish", async () => {
      await blob.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      const newItem = new Menu({
        title: req.body.title,
        category: req.body.category,
        tags: req.body.tags.split(","),
        nutrition: JSON.parse(req.body.nutrition),
        main_ingredient: req.body.main_ingredient,
        allergens: req.body.allergens.split(","),
        image_url: imageUrl,
      });

      await newItem.save();
      res.json({ message: "Menu item added!", newItem });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
