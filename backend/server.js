require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { checkAndCreateTables } = require("./config/db");
const clientRoutes = require("./routes/clients");
const appointmentRoutes = require("./routes/appointments");
const calendarRoutes = require("./routes/calendar");
const emailRoutes = require("./routes/email");
const stripeRoutes = require("./routes/stripe");
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
  //await checkAndCreateTables();
});
