import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAppointment } from "../utils/AppointmentUtils";
import { GetClient } from "../utils/ClientUtil";
import { NotifyError } from "../utils/NotifyUtil";
import { FormatDuration } from "../utils/DateTimeUtil";
import { appointments } from "../Data/Appointments";
import "../pages/Summary.css";

const ReservationDetails = ({ appointmentId }) => {
    const [appointmentInfo, setAppointmentInfo] = useState(null);
    const [reservationDetails, setReservationDetails] = useState(null);
    const [clientInfo, setClientInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfo = async () => {
            const appointmentResult = await GetAppointment(appointmentId);

            if (!appointmentResult.success) {
                if (appointmentResult.error === 404) {
                    NotifyError(navigate, "/", "Ce rendez-vous n'existe pas");
                } else {
                    NotifyError(navigate, "/");
                }
                return;
            }

            const clientResult = await GetClient(appointmentResult.appointment.client_id);

            if (!clientResult.success) {
                if (clientResult.error === 404) {
                    NotifyError(navigate, "/", "Ce client n'existe pas");
                } else {
                    NotifyError(navigate, "/");
                }
                return;
            }

            setReservationDetails(appointmentResult.appointment);
            setAppointmentInfo(appointments.find((appt) => appt.id === appointmentResult.appointment.appointmentId));
            setClientInfo(clientResult.client);
        };

        fetchInfo();
    }, [appointmentId, navigate]);

    if (!appointmentInfo) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Chargement en cours...</p>
            </div>
        );
    }

    return (
        <div className="summary-container">
            {/* Appointment Details */}
            <div className="summary-details">
                <h2>{appointmentInfo.title}</h2>
                <div className="colored-line left-aligned-line"></div>
                <p><strong>Date:</strong> {new Date(reservationDetails.start_time).toLocaleDateString()}</p>
                <p><strong>Heure:</strong> {new Date(reservationDetails.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Durée:</strong> {FormatDuration(appointmentInfo.length)}</p>
                <p><strong>Reste à payer:</strong> {reservationDetails.has_paid ? 0 : appointmentInfo.price}€</p>
            </div>

            {/* Client Information */}
            {clientInfo && (
                <div className="summary-details">
                    <h2>Informations Client</h2>
                    <div className="colored-line left-aligned-line"></div>
                    <p><strong>Nom:</strong> {clientInfo.last_name}</p>
                    <p><strong>Prénom:</strong> {clientInfo.first_name}</p>
                    <p><strong>Email:</strong> {clientInfo.email}</p>
                    {clientInfo.phone && <p><strong>Téléphone:</strong> {clientInfo.phone}</p>}
                    {reservationDetails.comment && <p><strong>Message:</strong> {reservationDetails.comment}</p>}
                </div>
            )}
        </div>
    );
};

export default ReservationDetails;