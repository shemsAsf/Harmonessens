require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Backend modules
const { checkAndCreateTables } = require("./backend/config/db");
const serviceRoutes = require("./backend/routes/services");
const adminRoutes = require("./backend/routes/admin");
const imageRoutes = require("./backend/routes/images");
const statusRoutes = require("./backend/routes/status");
const emailRoutes = require("./backend/routes/email");
const { IMAGE_FOLDER } = require("./backend/config/constants");

const app = express();
const port = process.env.PORT;

if (!fs.existsSync(IMAGE_FOLDER)) {
	fs.mkdirSync(IMAGE_FOLDER, { recursive: true });
}

const allowedOrigin = [process.env.ALLOWED_ORIGIN];
app.use(
	cors({
		origin: allowedOrigin,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
	})
);

app.use(bodyParser.json());

// ---- API ROUTES ----
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/email", emailRoutes);

// ---- FRONTEND SERVING ----
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "frontend/build")));

	app.get(/^(?!\/api).*/, (req, res) => {
		res.sendFile(path.join(__dirname, "frontend/build/index.html"));
	});
} else {
	console.log(
		"Development mode: React dev server handles frontend; set 'proxy' in frontend/package.json to forward /api requests to Express."
	);
}

// ---- START SERVER ----
app.listen(port, async () => {
	console.log(`Server running on port ${port} in ${process.env.NODE_ENV || "development"} mode`);
	await checkAndCreateTables();
});
