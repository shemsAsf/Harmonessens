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
const serviceRoutes = require("./routes/services");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5000;
const IMAGE_FOLDER = path.join(__dirname, "./data/images/services");

// Ensure image folder exists
if (!fs.existsSync(IMAGE_FOLDER)) {
  fs.mkdirSync(IMAGE_FOLDER, { recursive: true });
}

// Middleware
const allowedOrigin = [process.env.ALLOWED_ORIGIN, "http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// Routes
app.use("/clients", clientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/calendar", calendarRoutes);
app.use("/email", emailRoutes);
app.use("/stripe", stripeRoutes);
app.use("/services", serviceRoutes);

// Admin login route
app.post("/admin/login", (req, res) => {
  const { password } = req.body;
  
  if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.json({ token });
});

app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(IMAGE_FOLDER, imageName);

  // Check if the image exists
  fs.exists(imagePath, (exists) => {
      if (!exists) {
          return res.status(404).json({ error: 'Image not found' });
      }

      res.sendFile(imagePath, (err) => {
          if (err) {
              res.status(500).json({ error: 'Error serving the image' });
          }
      });
  });
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
