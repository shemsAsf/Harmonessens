require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { checkAndCreateTables } = require("./src/backend/config/db");
const clientRoutes = require("./src/backend/routes/clients");
const appointmentRoutes = require("./src/backend/routes/appointments");
const calendarRoutes = require("./src/backend/routes/calendar");
const emailRoutes = require("./src/backend/routes/email");
const stripeRoutes = require("./src/backend/routes/stripe");
const jwt = require("jsonwebtoken");

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
app.use("/stripe", stripeRoutes);

// Admin login route
app.post("/admin/login", (req, res) => {
  const { password } = req.body;
  
  if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.json({ token });
});

// Status endpoint
app.get("/status", (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

// Start server
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await checkAndCreateTables();
});
