const { db } = require("../config/db");

const createClient = async (req, res) => {
	const { firstName, lastName, email, phone } = req.body;
	if (!firstName || !lastName || !email) {
		return res.status(400).json({ message: "Required fields missing." });
	}
	try {
		const [result] = await db.query(
			"INSERT INTO clients (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)",
			[firstName, lastName, email, phone || null]
		);
		res.status(201).json({ success: true, clientId: result.insertId });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const checkClientExistence = async (req, res) => {
	const { email } = req.query;
	try {
		const [result] = await db.query("SELECT * FROM clients WHERE email = ?", [email]);
		if (result.length) {
			res.status(200).json({ success: true, found: true, client: result[0] });
		} else {
			res.status(200).json({ success: true, found: false });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const modifyExistingClient = async (req, res) => {
	const { id, firstName, lastName, email, phone } = req.body;
	console.log( req.body);
	if (!id) {
		return res.status(400).json({
			success: false,
			message: "Client ID is required to update information.",
		});
	}

	try {
		const [existingClient] = await db.query("SELECT * FROM clients WHERE id = ?", [id]);

		if (existingClient.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Client not found.",
			});
		}

		// Update client information
		await db.query(
			`UPDATE clients 
          SET first_name = ?, last_name = ?, email = ?, phone = ?
          WHERE id = ?`,
			[firstName, lastName, email, phone, id]
		);

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

module.exports = { createClient, checkClientExistence, modifyExistingClient };
