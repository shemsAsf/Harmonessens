const controller = require("../controllers/calendarController");
const express = require("express");
const router = express.Router();

router.post("/create-event", async (req, res) => controller.createCalendarEvent(req, res));

router.delete("/remove-event", async (req, res) => controller.removeCalendarEvent(req, res));

module.exports = router;