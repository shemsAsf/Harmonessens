import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { appointments } from "../Data/Appointments";
import "./Form.css";
import ClientValueModal from '../components/ClientValueModal';
import Swal from 'sweetalert2';

const Summary = () => {
	const { state: appointmentDetails } = useLocation();
	const appointment = appointments.find((appt) => appt.id === appointmentDetails.id);
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [differences, setDifferences] = useState([]);
	const [payNow, setPayNow] = useState(false);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		message: '',
	});
	const [clientId, setClientId] = useState(-1);

	const getValidDateTime = (date, time) => {
		const [hour, minute] = time.split(" - ")[0].split(":").map(num => num.padStart(2, "0"));
		return `${getLocalDate(date).toISOString().split('T')[0]}T${hour}:${minute}:00`;
	};
	
	const getLocalDate = (date) => {
		return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	// --- Client checking phase ---

	const ClientCheckForConfirmation = async (payNow) => {
		if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
			notifyError(null, "Veuillez remplir tous les champs obligatoires : Nom, Prénom, et Adresse mail.");
			return;
		}
	
		setPayNow(payNow);
	
		try {
			const queryParams = new URLSearchParams({ email: formData.email }).toString();
			const clientResponse = await fetch(`${process.env.REACT_APP_API_URL}/clients/client-exist?${queryParams}`);
			const clientData = await clientResponse.json();
	
			if (!clientResponse.ok || !clientData.success) {
				throw new Error(clientData.message || "Unknown error checking client existence.");
			}
	
			const newClientId = clientData.found ? clientData.client.id : await createNewClient();

			if (newClientId === null) {
				throw new Error(clientData.message || "Unknown error creating new client.");
			}
			
			setClientId(newClientId);
			clientData.found ? checkForDifferences(clientData.client) : AddAppointmentToDB();
			
		} catch (error) {
			console.error("Error in ClientCheckForConfirmation:", error.message);
			notifyError();
		}
	};
	
	const createNewClient = async () => {
		const createClientRequestData = {
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: formData.email,
			phone: formData.phone,
		};

		try {
			const createClientResponse = await fetch(`${process.env.REACT_APP_API_URL}/clients/create-client`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(createClientRequestData),
			});

			const createClientData = await createClientResponse.json();
			if (!createClientResponse.ok) {
				throw new Error(`Error: ${createClientData.message || "Failed to create client"}`);
			}

			return createClientData.success ? createClientData.clientId : null;

		} catch (error) {
			console.error("Error creating client:", error.message);
			return null;
		}
	};

	const checkForDifferences = (client) => {
		const fields = [
			{ field: 'Prénom', oldValue: client.first_name, newValue: formData.firstName },
			{ field: 'Nom', oldValue: client.last_name, newValue: formData.lastName },
			{ field: 'Numéro de Téléphone', oldValue: client.phone, newValue: formData.phone }
		];
		const diffs = fields.filter(f => f.oldValue?.trim() !== f.newValue?.trim());
		console.log("diff client id:", clientId);
		if (diffs.length > 0) {
			setDifferences(diffs);
			setShowModal(true);
		} else {
			AddAppointmentToDB();
		}
	};

	const updateClient = async () => {
		
		console.log("clientId:", clientId);
		const updateClientRequestData = {
			id: clientId,
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: formData.email,
			phone: formData.phone,
		};
		
		try{
			const response = await fetch(`${process.env.REACT_APP_API_URL}/clients/update-client`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateClientRequestData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(`Error: ${data.message || "Failed to update client information."}`);
			}
			
			return data.success ? data.clientId : null

		} catch (error) {
			console.error("Error updating client information:", error.message);
			return null;
		}
	};
	
	// --- Appointment database phase ---

	const AddAppointmentToDB = async () => {
		const createAppointmentRequestData = {
			appointmentId: appointment.id,
			startDateTime: getValidDateTime(appointmentDetails.date, appointmentDetails.time),
			durationInMinutes: appointment.length,
			message: formData.message,
			hasPaid: payNow,
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
			AddAppointmentToCalendar(data.uniqueAppointmentId);
			return data.uniqueAppointmentId;
	
		} catch (error) {
			console.error("Error adding appointment to database:", error.message);
	
			// Specific handling for appointment conflicts (HTTP 409)
			if (error.message.includes("Error 409")) {
				notifyError(
					appointment.id ? `/appointment/${appointment.id}` : "/appointment",
					"L'horaire du rendez-vous chevauche un autre rendez-vous existant."
				);
			} else {
				notifyError();
			}
	
			return null;
		}
	};
	
	const removeAppointmentFromDB = async (appointmentId) => {
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
	
	// --- Calendar phase ---

	const AddAppointmentToCalendar = async (appointmentId) => {
		const createCalendarRequestData = {
			summary: `Harmonessens: ${appointment.title}`,
			description: `Id du rendez-vous: ${appointmentId}`,
			startDateTime: getValidDateTime(appointmentDetails.date, appointmentDetails.time),
			durationInMinutes: appointment.length,
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
	
			// Send appointment email with event details
			sendAppointmentEmail(
				appointmentId,
				data.inviteLink,
				data.eventId,
				formData,
				appointmentDetails
			);
	
		} catch (error) {
			console.error("Error adding calendar event:", error.message);
			notifyError();
	
			// Ensure appointment removal from DB if calendar event creation fails
			removeAppointmentFromDB(appointmentId);
		}
	};

	const removeCalendarEvent = async (eventId) => {
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

	// --- Sending Email phase ---

	const sendAppointmentEmail = async (appointmentId, inviteLink, eventId, formData, appointmentDetails) => {
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

			Swal.fire({
				icon: 'success',
				title: 'Réservation Confirmée',
				text: 'La réservation a été effectuée avec succès.',
				confirmButtonColor: '#4CAF50',
			  }).then(() => {
				navigate("/appointment"); 
			  });

		} catch (error) {
			console.error("Error sending email:", error.message);
			notifyError()
			removeCalendarEvent(eventId);
			removeAppointmentFromDB(appointmentId);
		}
	};

	const handleSubmit = (event, payNow) => {
		event.preventDefault();
		ClientCheckForConfirmation(payNow);
	};

	const handleModalConfirm = useCallback(async (useNewData) => {
		setShowModal(false);
		if (useNewData) {
			console.log("clientId Modal conf:", clientId);
			const updatedClientId = await updateClient();
			if (updatedClientId  === null){
				console.error('notifyError: Failed updating client info')
				notifyError();
				return;
			}
		}
		AddAppointmentToDB();
	}, [clientId]);

	const handleModalCancel = () => setShowModal(false);

	const notifyError = (navigate, redirect, errorMessage) => {
		Swal.fire({
			icon: 'error',
			title: 'Erreur',
			text: `Une erreur est survenue, ${errorMessage ? errorMessage : "Veuillez réessayer plus tard."}`,
			confirmButtonColor: '#F44336',
		}).then(() => {
			if (redirect) {
				navigate(redirect);
			}
		});
	};

	return (
		<div className="main-div">
			<h1 className="main-title">Récapitulatif</h1>
			<h3>{appointment.title}</h3>

			{/* Appointment Information */}
			<img src={appointment.image} alt={appointment.title} />
			<p>Date: {new Date(appointmentDetails.date).toLocaleDateString()}</p>
			<p>Heure: {appointmentDetails.time}</p>
			<p>Durée: {appointment.length}</p>
			<p>Prix: {appointment.price}€</p>

			{showModal && (
				<ClientValueModal
					differences={differences}
					onConfirm={handleModalConfirm}
					onCancel={handleModalCancel}
					clientId={clientId}
				/>
			)}

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


			{/* Back Button */}
			<button className="back-button" onClick={() => navigate(-1)}>Retour</button>
		</div>
	);
};

export default Summary;
