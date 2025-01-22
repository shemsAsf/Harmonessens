const express = require("express");
const router = express.Router();
const controller = require("../controllers/clientController");

router.post("/create-client", async (req, res) => controller.createClient(req, res));

// Endpoint checking if client is already in database
router.get("/client-exist", async (req, res) => controller.checkClientExistence(req, res));

// Endpoint to update client information
router.put("/update-client", async (req, res) => controller.modifyExistingClient(req, res));

module.exports = router;