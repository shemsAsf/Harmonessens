const controller = require("../controllers/appointmentController");
const express = require("express");
const router = express.Router();

router.post("/create-appointment", async (req, res) => controller.addAppointmentToDb(req, res));

router.delete("/remove-appointment", async (req, res) => controller.removeAppointment(req, res));

router.get("/get-appointments-of-day", async (req, res) => controller.getAppointmentsByDate(req, res));

router.get("/get-appointment", async (req, res) => controller.getAppointment(req, res));

router.get("/get-appointments", async (req, res) => controller.getAppointments(req, res));

module.exports = router;