require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { checkAndCreateTables } = require("./src/config/db");
const clientRoutes = require("./src/routes/clients");
const appointmentRoutes = require("./src/routes/appointments");
const calendarRoutes = require("./src/routes/calendar");
const emailRoutes = require("./src/routes/email");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/clients", clientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/calendar", calendarRoutes);
app.use("/email", emailRoutes);

// Status endpoint
app.get("/status", (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

// Start server
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await checkAndCreateTables();
});
