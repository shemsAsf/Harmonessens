const controller = require("../controllers/emailController");
const express = require("express");
const router = express.Router();

router.post("/send-contact-email", async (req, res) => controller.sendContactEMail(req, res));

router.post("/send-appointment-email", async (req, res) => controller.sendAppointmentEMail(req, res));

module.exports = router;