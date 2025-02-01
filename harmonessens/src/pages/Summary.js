import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { appointments } from "../Data/Appointments";
import "./Form.css";
import "./Summary.css";
import ClientValueModal from '../components/ClientValueModal';
import { ClientCheck, UpdateClient } from '../utils/ClientUtil';
import { AddAppointmentToDB, RemoveAppointmentFromDB } from '../utils/AppointmentUtils';
import { AddAppointmentToCalendar, RemoveCalendarEvent } from '../utils/CalendarUtil';
import { SendAppointmentEmail } from '../utils/EmailUtils';
import { FormatDuration } from '../utils/DateTimeUtil';
import { NotifyError, NotifySuccess } from '../utils/NotifyUtil';

const Summary = () => {
	const { state: reservationDetails } = useLocation();
	const appointmentInfo = appointments.find((appt) => appt.id === reservationDetails.id);
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [differences, setDifferences] = useState([]);
	const [modalPromise, setModalPromise] = useState(null);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		message: '',
	});
	const [clientId, setClientIdAndShowModal] = useState(null);

	useEffect(() => {
		if (clientId !== null) {
			setShowModal(true);;
		}
	}, [clientId]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const OnConfirmation = async (payNow) => {
		// --- Check client information ---
		if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
			NotifyError(navigate, null, "Veuillez remplir tous les champs obligatoires : Nom, Prénom, et Adresse mail.");
			return;
		}

		const clientId = await ClientCheck(formData, setupModal, setClientIdAndShowModal);
		if (clientId === null) {
			NotifyError();
			return;
		}

		// --- Add appointment to database ---
		const appointmentResponse = await AddAppointmentToDB(appointmentInfo, formData, reservationDetails, payNow, clientId);
		if (!appointmentResponse.success) {
			if (appointmentResponse.error === 409) {
				NotifyError(
					navigate,
					appointmentInfo.id ? `/appointment/${appointmentInfo.id}` : "/appointment",
					"L'horaire du rendez-vous chevauche un autre rendez-vous existant."
				);
			} else {
				NotifyError();
			}
			return;
		}

		const calendarResponse = await AddAppointmentToCalendar(appointmentResponse.id, reservationDetails, appointmentInfo);
		if (!calendarResponse.success) {
			NotifyError();
			RemoveAppointmentFromDB(appointmentResponse.id);
			return;
		}

		// --- Send Comfirmation Email ---
		const emailResponse = await SendAppointmentEmail(
			appointmentResponse.id,
			calendarResponse.inviteLink,
			formData,
			reservationDetails,
		)
		if (!emailResponse) {
			NotifyError();
			RemoveCalendarEvent(calendarResponse.eventId);
			RemoveAppointmentFromDB(appointmentResponse.id);
			return;
		}
		NotifySuccess(navigate);
	};

	const handleSubmit = (event, payNow) => {
		event.preventDefault();
		OnConfirmation(payNow);
	};

	const handleModalConfirm = async (useNewData) => {
		setShowModal(false);
		if (useNewData) {
			console.log("clientId Modal conf:", clientId);
			const updatedClientId = await UpdateClient(clientId, formData);
			if (updatedClientId === null) {
				modalPromise?.resolve({ error: true, message: 'Failed updating client info' });
				NotifyError();
				modalPromise?.resolve();
				return;
			}
		}
		modalPromise?.resolve({ error: false });
	};

	const handleModalCancel = () => {
		setShowModal(false);
		modalPromise?.resolve();
	};

	const setupModal = async (differences, resolve, id) => {
		setDifferences(differences);
		setModalPromise({ resolve });
		setClientIdAndShowModal(id);
	}



	return (
		<div className="main-div">
			<h1 className="main-title">Réserver</h1>
			<div className="summary-container">
				

				{/* Form Section */}
				<div className="form-div">
					<form>
						<div className="form-field">
							<input
								type="text"
								name="firstName"
								placeholder="Nom:"
								value={formData.firstName}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-field">
							<input
								type="text"
								name="lastName"
								placeholder="Prénom:"
								value={formData.lastName}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-field">
							<input
								type="email"
								name="email"
								placeholder="Adresse mail:"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-field">
							<input
								type="tel"
								name="phone"
								placeholder="Numéro de téléphone:"
								value={formData.phone}
								onChange={handleChange}
							/>
						</div>
						<div className="form-field">
							<textarea
								name="message"
								placeholder="Commentaire (facultatif):"
								value={formData.message}
								onChange={handleChange}
							></textarea>
						</div>
						<div className="form-field button-group">
							<button
								className="submit-button"
								type="button"
								onClick={(e) => handleSubmit(e, true)}
							>
								Payer Maintenant
							</button>
							<button
								className="submit-button"
								type="button"
								onClick={(e) => handleSubmit(e, false)}
							>
								Payer Plus Tard
							</button>
						</div>
					</form>
				</div>
				<div className="summary-details">
					<h2>{appointmentInfo.title}</h2>
					<div className="colored-line left-aligned-line"></div>
					<p>Date: {new Date(reservationDetails.date).toLocaleDateString()}</p>
					<p>Heure: {reservationDetails.time}</p>
					<p>Durée: {FormatDuration(appointmentInfo.length)}</p>
					<p>Prix: {appointmentInfo.price}€</p>
				</div>
			</div>
			

			{showModal && (
				<ClientValueModal
					differences={differences}
					onConfirm={handleModalConfirm}
					onCancel={handleModalCancel}
					clientId={clientId}
				/>
			)}
		</div>
	);
};

export default Summary;
