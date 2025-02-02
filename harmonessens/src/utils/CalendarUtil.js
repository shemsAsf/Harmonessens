import { getValidDateTime } from "./DateTimeUtil";

export const AddAppointmentToCalendar = async (reservationId, reservationDetails, appointmentInfo) => {
    const createCalendarRequestData = {
        summary: `Harmonessens: ${appointmentInfo.title}`,
        description: `Voir ma réservation: ${process.env.REACT_APP_WEBSITE_URL}/seeAppointment/${reservationId}`,
        startDateTime: getValidDateTime(reservationDetails.date, reservationDetails.time),
        durationInMinutes: appointmentInfo.length,
    };
    
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/calendar/create-event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(createCalendarRequestData),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to create calendar event");
        }

        console.log("Calendar event successfully created:", data);

        return {
            success: true,
            inviteLink: data.inviteLink,
            eventId: data.eventId,
        }
    } catch (error) {
        console.error("Error adding calendar event:", error.message);
        return { success: false };}
};

export const RemoveCalendarEvent = async (eventId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/remove-event`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId }),
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to remove event from calendar.");
        }

        console.log("Event successfully removed from calendar.");
    } catch (error) {
        console.error("Error while removing event from calendar:", error.message);
    }
};
