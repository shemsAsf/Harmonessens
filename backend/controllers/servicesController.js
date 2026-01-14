const { db } = require("../config/db.js");
const path = require("path");
const fs = require("fs");
const { IMAGE_FOLDER } = require("../config/constants.js");

const GetServices = (req, res) => {
	try {
		const result = db.prepare(
			"SELECT * FROM services wHERE id > 0"
		).all();

		const services = result.map((service) => ({
			...service,
			image: GetImageAsLink(req, service.image),
		}));

		return res.status(200).json({ success: true, services });
	} catch (error) {
		console.error("Error fetching appointments for the given date:", error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
}; 

const GetService = (req, res) => {
	try {
	  const { id } = req.params;
  
	  const result = db.prepare("SELECT * FROM services WHERE id = ?").get(id);

	  if (!result) {
		return res.status(404).json({ success: false, message: "Service not found" });
	  }
  
	  const service = {
		...result,
		image: GetImageAsLink(req, result.image),
	  };
  
	  return res.status(200).json({ success: true, service });
	} catch (error) {
	  console.error("Error fetching service:", error);
	  return res.status(500).json({ success: false, message: "Internal server error" });
	}
  };

const CreateService = (req, res) => {
	const data = validateAndConvertServiceData(req, res);
	if (!data) return;

	console.log(data);

	try {
		const stmt = db.prepare(
			"INSERT INTO services (title, image, description, length, price, allowOnline, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)"
		);
		const result = stmt.run(data.title, data.image, data.description, data.lengthNum, data.priceNum, data.allowOnlineInt, data.isActiveInt);

		res.status(201).json({ success: true, serviceId: result.lastInsertRowid });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const UpdateService = (req, res) => {
	const { id } = req.params;
	console.log(`Updating service with ID: ${id}`);

	const data = validateAndConvertServiceData(req, res);
	if (!data || !id) {
		console.error("Invalid data or missing ID", { id, data });
		return res.status(400).json({ error: "Invalid data or missing ID" });
	}

	try {
		console.log("Fetching old image for service...");
		const stmt1 = db.prepare("SELECT image FROM services WHERE id = ?");
		const row = stmt1.get(id);

		if (!row) {
			console.warn(`Service with ID ${id} not found.`);
			return res.status(404).json({ error: "Service not found" });
		}

		const oldImage = row.image;
		console.log(`Old image: ${oldImage ? oldImage : "No image found"}`);

		console.log("Updating service data in the database...");
		const stmt = db.prepare(`
			UPDATE services 
			SET title = ?, description = ?, length = ?, price = ?, allowOnline = ?, isActive = ?, image = COALESCE(?, image)
			WHERE id = ?
		`);

		const result = stmt.run(
			data.title, data.description, data.lengthNum, data.priceNum, 
			data.allowOnlineInt, data.isActiveInt, data.image, id
		);
		console.log(`Service updated. Changes applied: ${result.changes}`);

		// Delete old image if:
		// - A new image was uploaded
		// - The old image exists and is not an empty string
		if (data.image && oldImage && oldImage.trim() !== "") {
			const oldImagePath = path.join(IMAGE_FOLDER, oldImage);
			console.log(`Attempting to remove old image at: ${oldImagePath}`);
			RemoveImage(oldImagePath);
		} else {
			console.log("No old image to remove.");
		}

		console.log("Update process completed successfully.");
		res.status(200).json({ success: true, message: "Service updated successfully" });

	} catch (err) {
		console.error("Error updating service:", err.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const validateAndConvertServiceData = (req, res) => {
	const { title, description, length, price, allowOnline, isActive } = req.body;
	const image = req.file ? req.file.filename : null;


	if (!title || !description || length === undefined || price === undefined) {
		res.status(400).json({ error: "Missing required fields" });
		return null;
	}

	// Convert to correct types
	const lengthNum = Number(length);
	const priceNum = Number(price);
	const allowOnlineInt = Number(allowOnline);
	const isActiveInt = Number(isActive);

	if (isNaN(lengthNum) || isNaN(priceNum)) {
		res.status(400).json({ error: "Invalid number format for length or price" });
		return null;
	}

	return { title, description, lengthNum, priceNum, allowOnlineInt, isActiveInt, image };
};

const RemoveService = (req, res) => {
	try {
		const { id } = req.params;

		const row = db.prepare("SELECT * FROM services WHERE id = ?").get(id);
		if (!row) {
			return res.status(404).json({ success: false, message: "Service not found" });
		}

		if (row.image) {
			RemoveImage(row.image);
		}

		db.prepare("DELETE FROM services WHERE id = ?").run(id);

		return res.status(200).json({ success: true, service: row });
	} catch (error) {
		console.error("Error removing service:", error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const RemoveImage = (name) => {
	const filePath = path.join(IMAGE_FOLDER, name);

	// Check if the file exists before attempting to delete it
	fs.access(filePath, fs.constants.F_OK, (err) => {
		if (err) {
			if (err.code === "ENOENT") {
				console.log(`Image not found, skipping: ${filePath}`);
				return;
			}
			console.error("Error checking image existence:", err.message);
			return;
		}

		// If the file exists, delete it
		fs.unlink(filePath, (unlinkErr) => {
			if (unlinkErr) {
				console.error("Error deleting image:", unlinkErr.message);
			} else {
				console.log(`Deleted image: ${filePath}`);
			}
		});
	});
};


const GetImageAsLink = (req, img) => {
	return img == null ? "" : `${req.protocol}://${req.get("host")}/api/images/${path.basename(img)}`
}

module.exports = {
	GetServices,
	GetService,
	CreateService,
	UpdateService,
	RemoveService,
};
