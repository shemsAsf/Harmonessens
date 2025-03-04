import { db } from "../config/db.js";

// Create a client
export const CreateClient = (req, res) => {
	const { firstName, lastName, email, phone } = req.body;
	if (!firstName || !lastName || !email) {
		return res.status(400).json({ message: "Required fields missing." });
	}
	try {
		const stmt = db.prepare(
			"INSERT INTO clients (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)"
		);
		const result = stmt.run(firstName, lastName, email, phone || null);

		res.status(201).json({ success: true, clientId: result.lastInsertRowid });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Check if client exists
export const CheckClientExistence = (req, res) => {
	const { email } = req.query;
	try {
		const stmt = db.prepare("SELECT * FROM clients WHERE email = ?");
		const result = stmt.all(email);

		if (result.length) {
			res.status(200).json({ success: true, found: true, client: result[0] });
		} else {
			res.status(200).json({ success: true, found: false });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Modify existing client
export const ModifyExistingClient = (req, res) => {
	const { id, firstName, lastName, email, phone } = req.body;
	if (!id) {
		return res.status(400).json({
			success: false,
			message: "Client ID is required to update information.",
		});
	}

	try {
		const stmt = db.prepare("SELECT * FROM clients WHERE id = ?");
		const existingClient = stmt.all(id); 

		if (existingClient.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Client not found.",
			});
		}

		// Update client information
		const updateStmt = db.prepare(
			`UPDATE clients 
			SET first_name = ?, last_name = ?, email = ?, phone = ?
			WHERE id = ?`
		);
		updateStmt.run(firstName, lastName, email, phone, id); // run() for update

		res.status(200).json({
			success: true,
			message: "Client information updated successfully.",
			clientid: id,
		});
	} catch (error) {
		console.error("Error updating client information:", error.message);
		res.status(500).json({
			success: false,
			message: "Error updating client information.",
		});
	}
};

// Get client by ID
export const GetClient = (req, res) => {
	const { id } = req.query;

	if (!id) {
		return res.status(400).json({ success: false, message: "A valid id is required." });
	}

	try {
		const stmt = db.prepare("SELECT * FROM clients WHERE id = ?");
		const result = stmt.get(id);
		if (!result) {
			return res.status(404).json({ success: false, message: "Client not found." });
		}

		return res.status(200).json({ success: true, client: result });
	} catch (error) {
		console.error("Error fetching client with the given id:", error);
		return res.status(500).json({ success: false, error });
	}
};