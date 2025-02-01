import { getValidDateTime } from "./DateTimeUtil";

export const AddAppointmentToDB = async (appointment, formData, reservationDetails, hasPaid, clientId) => {
    const createAppointmentRequestData = {
        appointmentId: appointment.id,
        startDateTime: getValidDateTime(reservationDetails.date, reservationDetails.time),
        durationInMinutes: appointment.length,
        message: formData.message,
        hasPaid,
        clientId,
    };

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/create-appointment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(createAppointmentRequestData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${data.message || "Failed to create appointment"}`);
        }

        // Successfully created appointment
        return { success: true, id: data.uniqueAppointmentId};

    } catch (error) {
        console.error("Error adding appointment to database:", error.message);

        // Specific handling for appointment conflicts (HTTP 409)
        if (error.message.includes("Error 409")) {
            return { success: false, error:409 }
            
        } else {
            return { success: false, error:400 }
        }
    }
};

export const RemoveAppointmentFromDB = async (appointmentId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/remove-appointment`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: appointmentId }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to remove appointment");
        }

        console.log("Appointment successfully removed from database.");
    } catch (error) {
        console.error("Error removing appointment:", error.message);
    }
};