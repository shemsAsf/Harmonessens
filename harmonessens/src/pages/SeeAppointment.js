import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetAppointment } from "../utils/AppointmentUtils";
import { GetClient } from "../controllers/clientController";
import { NotifyError } from "../utils/NotifyUtil";
import { FormatDuration } from "../utils/DateTimeUtil";
import { appointments } from "../Data/Appointments";

const SeeAppointment = () => {
    const { appointmentId } = useParams();
    const [appointmentInfo, setAppointmentInfo] = useState(null);
    const [reservationDetails, setReservationDetails] = useState(null);
    const [clientInfo, setClientInfo] = useState(null);
	const navigate = useNavigate();
    

    useEffect(() => {
        const fetchInfo = async () => {
            const appointmentResult = await GetAppointment(appointmentId);
            console.log(appointmentResult);
    
            if (!appointmentResult.success) {
                if (appointmentResult.error === 404) {
                    NotifyError(navigate, "/", "Ce rendez-vous n'existe pas");
                } else {
                    NotifyError(navigate, "/");
                }
                return;
            }
    
            console.log(appointmentResult.appointment); // Log appointment data

            const clientResult = await GetClient(appointmentResult.appointment.client_id)

            if (!clientResult.success) {
                if (clientResult.error === 404) {
                    NotifyError(navigate, "/", "Ce client n'existe pas");
                } else {
                    NotifyError(navigate, "/");
                }
                return;
            }

            setReservationDetails(appointmentResult.appointment);
            setAppointmentInfo(appointments.find((appt) => appt.id === appointmentResult.appointment.appointmentId))
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
        <div className="main-div">
            <h1 className="main-title">Ma réservation</h1>
            <div className="summary-container">        
                {/* Appointment Details */}
                <div className="summary-details">
                    <h2>{appointmentInfo.title}</h2>
                    <div className="colored-line left-aligned-line"></div>
                    <p><strong>Date:</strong> {new Date(reservationDetails.date).toLocaleDateString()}</p>
                    <p><strong>Heure:</strong> {reservationDetails.time}</p>
                    <p><strong>Durée:</strong> {FormatDuration(appointmentInfo.length)}</p>
                    <p><strong>Prix:</strong> {appointmentInfo.price}€</p>
                </div>

                {/* Client Information */}
                {clientInfo && (
                    <div className="summary-details">
                        <h2>Informations Client</h2>
                        <div className="colored-line left-aligned-line"></div>
                        <p><strong>Nom:</strong> {clientInfo.lastName}</p>
                        <p><strong>Prénom:</strong> {clientInfo.firstName}</p>
                        <p><strong>Email:</strong> {clientInfo.email}</p>
                        {clientInfo.phone && <p><strong>Téléphone:</strong> {clientInfo.phone}</p>}
                        <p><strong>Message:</strong> {clientInfo.comment}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeeAppointment;
