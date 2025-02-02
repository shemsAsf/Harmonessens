const express = require("express");
const router = express.Router();
const controller = require("../controllers/clientController");

// Endpoint creating a new client
router.post("/create-client", async (req, res) => controller.CreateClient(req, res));

// Endpoint checking if client is already in database
router.get("/client-exist", async (req, res) => controller.CheckClientExistence(req, res));

// Endpoint to update client information
router.put("/update-client", async (req, res) => controller.ModifyExistingClient(req, res));

// Endpoint to fetch client from id
router.get("/get-client", async (req, res) => controller.GetClient(req, res));

module.exports = router;