import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

export const addAppointmentToDb = async (req, res) => {
	const { appointmentId, startDateTime, durationInMinutes, message, hasPaid, clientId, online } = req.body;

	try {
		// Check if client exists
		const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(clientId);
		if (!client) {
			return res.status(400).json({ success: false, message: "Client not found." });
		}
	} catch (error) {
		console.error("Error finding client:", error.message);
		return res.status(500).json({ success: false, message: "Internal server error while validating client." });
	}

	// Calculate end time
	const endTime = new Date(new Date(startDateTime).getTime() + durationInMinutes * 60000).toISOString();

	// Check for overlaps
	const hasOverlap = checkForOverlaps(startDateTime, endTime);
	if (hasOverlap) {
		return res.status(409).json({ success: false, message: 'Appointment time overlaps with an existing appointment' });
	}

	// Generate unique 6-digit appointment ID
	let reservationId;
	while (true) {
		reservationId = Math.floor(Math.random() * 900000) + 100000;

		const existingInAppointments = db.prepare('SELECT id FROM appointments WHERE id = ?').get(reservationId);
		const existingInUsedIds = db.prepare('SELECT id FROM used_ids WHERE id = ?').get(reservationId);

		if (!existingInAppointments && !existingInUsedIds) break;
	}

	// Store the new ID in the `used_ids` table to prevent future reuse
	db.prepare('INSERT INTO used_ids (id) VALUES (?)').run(reservationId);

	// Insert appointment
	try {
		db.prepare(`
            INSERT INTO appointments (id, appointmentId, start_time, end_time, comment, has_paid, online, client_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(reservationId, appointmentId, startDateTime, endTime, message, hasPaid ? 1 : 0, online ? 1 : 0, clientId);

		res.status(200).json({
			success: true,
			message: "Appointment created successfully.",
			uniqueAppointmentId: reservationId
		});

	} catch (error) {
		console.error("Database error:", error.message);
		res.status(500).json({ success: false, message: "Failed to create appointment." });
	}
};

export const removeAppointment = async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ success: false, message: 'Appointment ID is required' });
	}

	try {
		const result = db.prepare('DELETE FROM appointments WHERE id = ?').run(id);

		if (result.changes > 0) {
			return res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
		} else {
			return res.status(404).json({ success: false, message: 'Appointment not found' });
		}
	} catch (error) {
		console.error('Error deleting appointment:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export const getAppointmentsByDate = async (req, res) => {
	const { date } = req.query;

	if (!date) {
		return res.status(400).json({ success: false, message: "A valid date is required." });
	}

	try {
		const appointments = db.prepare(`
            SELECT 
                strftime('%H:%M', start_time) AS start_time, 
                strftime('%H:%M', end_time) AS end_time 
            FROM appointments 
            WHERE DATE(start_time) = ?
        `).all(date);

		return res.status(200).json({ success: true, appointments });
	} catch (error) {
		console.error("Error fetching appointments for the given date:", error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export const getAppointment = async (req, res) => {
	const { id } = req.query;

	if (!id) {
		return res.status(400).json({ success: false, message: "A valid id is required." });
	}

	try {
		const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);

		if (!appointment) {
			return res.status(404).json({ success: false, message: "Appointment not found." });
		}

		return res.status(200).json({ success: true, appointment });
	} catch (error) {
		console.error("Error fetching appointment:", error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export const getAppointments = async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
	}

	try {
		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(403).json({ success: false, message: "Forbidden: Invalid token" });
		}

		// Fetch all appointments
		const appointments = db.prepare('SELECT * FROM appointments').all();

		return res.status(200).json({ success: true, appointments });
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const checkForOverlaps = (startTime, endTime) => {
	const query = `
        SELECT * FROM appointments
        WHERE
            (? <= start_time AND ? >= start_time) OR
            (? <= end_time AND ? >= end_time) OR
            (? >= start_time AND ? <= end_time)
    `;

	const existingAppointments = db.prepare(query).all(startTime, endTime, startTime, endTime, startTime, endTime);
	return existingAppointments.length > 0;
};