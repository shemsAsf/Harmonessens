import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAppointment } from "../Utils/AppointmentUtils";
import { GetClient } from "../Utils/ClientUtil";
import { NotifyError } from "../Utils/NotifyUtil";
import { FormatDuration } from "../Utils/DateTimeUtil";
import "../Style/Summary.css";
import { fetchService } from "../Utils/ServicesUtils";

const ReservationDetails = ({ appointmentId }) => {
    const [appointmentInfo, setService] = useState(null);
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
            await fetchService(appointmentResult.appointment.appointmentId, setService);
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
                {reservationDetails.online === 1 && <p><strong>Rendez-vous en ligne</strong></p>}
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