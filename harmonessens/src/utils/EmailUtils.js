import { getLocalDate } from "./DateTimeUtil";

export const SendAppointmentEmail = async (appointmentId, inviteLink, formData, appointmentDetails) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/email/send-appointment-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                title: appointmentDetails.title,
                day: getLocalDate(appointmentDetails.date).toLocaleDateString(),
                time: appointmentDetails.time,
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