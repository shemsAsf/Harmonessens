const controller = require("../controllers/servicesController.js");
const { upload } = require("../utils/utils.js");
const adminAuth = require("../middlewares/adminAuth");
const express = require("express");

const router = express.Router();

router.get("/", controller.GetServices);
router.get("/:id", controller.GetService);

router.post("/", adminAuth, upload.single("image"), controller.CreateService);
router.put("/:id", adminAuth, upload.single("image"), controller.UpdateService);
router.delete("/:id", adminAuth, controller.RemoveService);

module.exports = router;
