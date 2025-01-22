const controller = require("../controllers/emailController");
const express = require("express");
const router = express.Router();

router.post("/send-email", async (req, res) => controller.sendClientEMail(req, res));

module.exports = router;