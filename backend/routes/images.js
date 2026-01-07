const express = require("express");
const router = express.Router();
const controller = require("../controllers/imagesController.js");

router.get("/:imageName", controller.uploadImage);

module.exports = router;
