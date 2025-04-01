const controller = require("../controllers/servicesController.js");
const { upload } = require('../utils/utils.js');
const express = require("express");
const router = express.Router();

router.get("/get-services", async (req, res) => controller.GetServices(req, res));

router.get("/get-service/:id", async (req, res) => controller.GetService(req, res));

router.post("/create-service", upload.single('image'), async (req, res) => controller.CreateService(req, res));

router.put("/update-service/:id", upload.single('image'), async (req, res) => controller.UpdateService(req, res));

router.delete("/remove-service/:id", async (req, res) => controller.RemoveService(req, res));

module.exports = router;
