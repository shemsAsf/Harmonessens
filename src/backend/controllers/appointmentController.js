import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

export const addAppointmentToDb = async (req, res) => {
	const { appointmentId, startDateTime, durationInMinutes, message, hasPaid, clientId } = req.body;
	// Validate if the client exists in the database
	try {
		const [client] = await db.query('SELECT * FROM clients WHERE id = ?', [clientId]);
		if (client.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Client not found."
			});
		}
	} catch (error) {
		console.error("Error finding client:", error.message);
		return res.status(500).json({
			success: false,
			message: "Internal server error while validating client.",
		});
	}

	// Calculate the end time based on start time and duration
	const endTime = new Date(new Date(startDateTime).getTime() + durationInMinutes * 60000);

	// Check for overlapping appointments
	const hasOverlap = await checkForOverlaps(startDateTime, endTime);
	if (hasOverlap) {
		return res.status(409).json({ success: false, message: 'Appointment time overlaps with an existing appointment' });
	}

	// Generate a random 6-character appointment ID
	let foundValidId = false;
	let reservationId = -1;
	do {
		reservationId = Math.floor(Math.random() * (1000000 - 100000) + 100000);
		const [appointmentsWithId] = await db.query('SELECT * FROM appointments WHERE id = ?', [reservationId])
		foundValidId = appointmentsWithId.length === 0;
	} while (!foundValidId);

	// Create the appointment in the database
	try {
		await db.query(
			`INSERT INTO appointments (id, appointmentId, start_time, end_time, comment, has_paid, client_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[reservationId, appointmentId, new Date(startDateTime), endTime, message, hasPaid, clientId]
		);

		res.status(200).json({
			success: true,
			message: "Appointment created successfully.",
			uniqueAppointmentId: reservationId
		});

	} catch (error) {
		console.error("Database error:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to create appointment.",
		});
	}
};

export const removeAppointment = async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ success: false, message: 'Appointment ID is required' });
	}

	try {
		const result = await db.query('DELETE FROM appointments WHERE id = ?', id);

		if (result) {
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
		const [appointments] = await db.query(
			`SELECT 
			  TIME(start_time) AS start_time, 
			  TIME(end_time) AS end_time 
			FROM appointments 
			WHERE DATE(start_time) = ?`,
			[date]
		);

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
		const [appointment] = await db.query(
			`SELECT *
			FROM appointments 
			WHERE id = ?`,
			[id]
		);

		return res.status(200).json({ success: true, appointment: appointment[0] });
	} catch (error) {
		console.error("Error fetching appointment with the given id:", error);
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
        const [appointments] = await db.query(
            `SELECT * FROM appointments`
        );

        return res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const checkForOverlaps = async (startTime, endTime) => {
	// Query to check if there is an overlap with any existing appointment
	const query = `
    SELECT * FROM appointments
    WHERE
      (? <= start_time AND ? >= start_time) OR
      (? <= end_time AND ? >= end_time) OR
	  (? >= start_time AND ? <= end_time)
  `;

	const [existingAppointments] = await db.query(query, [startTime, endTime, startTime, endTime, startTime, endTime]);
	return existingAppointments.length > 0;
};