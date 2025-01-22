const { generateRandomId } = require("../utils/utils");
const { db } = require("../config/db");

const addAppointmentToDb = async (req, res) => {
    const { appointmentId, startDateTime, durationInMinutes, comment, hasPaid, clientId } = req.body;
  
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

    // Generate a random 6-character appointment ID
    let foundValidId = false;
    let reservationId = -1;
    do{
        reservationId = generateRandomId();
        const [appointmentsWithId] = await db.query('SELECT * FROM appointments WHERE id = ?', [reservationId])
        foundValidId = appointmentsWithId.length === 0;
    } while(!foundValidId);

  
    // Create the appointment in the database
    try {
      const [result] = await db.query(
        `INSERT INTO appointments (id, appointmentId, start_time, end_time, comment, has_paid, client_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [reservationId, appointmentId, new Date(startDateTime), endTime, comment, hasPaid, clientId]
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

  module.exports = { addAppointmentToDb };