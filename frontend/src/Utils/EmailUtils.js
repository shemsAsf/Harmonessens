import { getLocalDate } from "./DateTimeUtil";

export const SendAppointmentEmail = async (appointmentId, inviteLink, formData, title, reservationDetails) => {
    try {
        console.log("title:", )
        const response = await fetch(`${process.env.REACT_APP_API_URL}/email/send-appointment-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                title,
                day: getLocalDate(reservationDetails.date).toLocaleDateString(),
                time: reservationDetails.time,
                appointmentId,
                inviteLink,
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Failed to send email.");
        }

        console.log("Email sent successfully");
        return true;
    } catch (error) {
        console.error("Error sending email:", error.message);
        return false;
    }
};