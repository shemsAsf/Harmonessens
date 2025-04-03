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
	const data = validateAndConvertServiceData(req, res);
	if (!data || !id) return res.status(400).json({ error: "Invalid data or missing ID" });

	try {
		// Retrieve the old image
		const smtm1 = db.prepare("SELECT image FROM services WHERE id = ?");
		const row = smtm1.get(id); 

		// If no service found, return an error
		if (!row) {
			return res.status(404).json({ error: "Service not found" });
		}

		const oldImage = row.image;

		// Update the service
		const smtm = db.prepare(`
			UPDATE services 
			SET title = ?, description = ?, length = ?, price = ?, allowOnline = ?, isActive = ?, image = COALESCE(?, image)
			WHERE id = ?
		`);

		const result = smtm.run(
			data.title, data.description, data.lengthNum, data.priceNum, 
			data.allowOnlineInt, data.isActiveInt, data.image, id
		);

		// Delete old image if a new one was uploaded
		if (data.image && oldImage) {
			const oldImagePath = path.join(IMAGE_FOLDER, oldImage);
			RemoveImage(oldImagePath);
		}

		res.status(200).json({ success: true, message: "Service updated successfully" });

	} catch (err) {
		res.status(500).json({ error: err.message });
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
	fs.unlink(name, (unlinkErr) => {
		if (unlinkErr && unlinkErr.code !== "ENOENT") {
			console.error("Error deleting image:", unlinkErr.message);
		}
	});
}

const GetImageAsLink = (req, img) => {
	return img == null ? "" : `${req.protocol}://${req.get("host")}/images/${path.basename(img)}`
}

module.exports = {
	GetServices,
	GetService,
	CreateService,
	UpdateService,
	RemoveService,
};
