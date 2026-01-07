const controller = require("../controllers/servicesController.js");
const { upload } = require('../utils/utils.js');
const express = require("express");
const router = express.Router();

router.get("/", controller.GetServices);
router.get("/:id", controller.GetService);
router.post("/", upload.single("image"), controller.CreateService);
router.put("/:id", upload.single("image"), controller.UpdateService);
router.delete("/:id", controller.RemoveService);

module.exports = router;
