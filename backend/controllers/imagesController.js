const fs = require("fs");
const path = require("path");
const { IMAGE_FOLDER } = require("../config/constants");

const uploadImage = (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(IMAGE_FOLDER, imageName);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: "Image not found" });
  }

  res.sendFile(imagePath, (err) => {
    if (err) res.status(500).json({ error: "Error serving the image" });
  });
};

module.exports = {
	uploadImage
};
