const controller = require("../controllers/appointmentController");
const express = require("express");
const router = express.Router();

// API for adding an appointment
router.post("/create-appointment", async (req, res) => controller.addAppointmentToDb(req, res));

module.exports = router;