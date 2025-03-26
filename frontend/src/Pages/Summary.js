import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../Style/Form.css";
import "../Style/Summary.css";
import ClientValueModal from '../Components/ClientModal/ClientValueModal';
import CheckoutForm from '../Components/CheckoutForm';
import { ClientCheck, UpdateClient } from '../Utils/ClientUtil';
import { AddAppointmentToDB, RemoveAppointmentFromDB } from '../Utils/AppointmentUtils';
import { AddAppointmentToCalendar, RemoveCalendarEvent } from '../Utils/CalendarUtil';
import { SendAppointmentEmail } from '../Utils/EmailUtils';
import { FormatDuration } from '../Utils/DateTimeUtil';
import { NotifyError, NotifySuccess } from '../Utils/NotifyUtil';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const Summary = () => {
	const { state: {reservationDetails, service} } = useLocation();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [paymentModalVisible, setPaymentModalVisible] = useState(false);
	const [differences, setDifferences] = useState([]);
	const [modalPromise, setModalPromise] = useState(null);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		message: '',
		isOnline: false,
	});
	const [clientId, setClientIdAndShowModal] = useState(null);
	const [emailData, setEmailData] = useState(null);
	const [processIds, setProcessIds] = useState(null);

	const stripePromise = loadStripe("pk_test_51QmwNtFDZlTLF3ipsKdOVGodzcE5FuBvCEThg1eCczGSdOdAEHHjPzMK9saR79fLoiYkFLjGTfxz1iEAtBojtQ3s00Cn6ogTBZ");

	const [clientSecret, setClientSecret] = useState(null);

	useEffect(() => {
		const fetchClientSecret = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/create-payment-intent`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						amount: service.price * 100,
						currency: "eur",
					}),
				});

				if (response.status === 500) {
					throw new Error("Server error:", response.error);
				}

				const data = await response.json();

				if (!data.clientSecret) {
					throw new Error("Invalid response: Missing clientSecret.");
				}

				setClientSecret(data.clientSecret);
				console.log("Successfully fetched client secret.");
			} catch (error) {
				console.error("Error fetching client secret:", error);

				if (processIds) {
					console.log("Cleaning up calendar event and database event...");
					RemoveCalendarEvent(processIds.calendar);
					RemoveAppointmentFromDB(processIds.appointment);
				}

				NotifyError(navigate, service.id ? `/appointment/${service.id}` : "/appointment", "Erreur lors de la récupération du paiement.");
			}
		};

		if (paymentModalVisible) {
			fetchClientSecret();
		}
	}, [paymentModalVisible, reservationDetails, navigate, service.id, processIds, service?.clientIds, service.price]);

	useEffect(() => {
		if (clientId !== null) {
			setShowModal(true);;
		}
	}, [clientId]);

	useEffect(() => {
		const cleanup = () => {
			if (paymentModalVisible && processIds) {
				console.log("Page closed before payment. Cleaning up appointment...");
				setPaymentModalVisible(false);
				RemoveCalendarEvent(processIds.calendar);
				RemoveAppointmentFromDB(processIds.appointment);
			}
		};

		window.addEventListener("beforeunload", cleanup);
		window.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "hidden") {
				cleanup();
			}
		});

		return () => {
			window.removeEventListener("beforeunload", cleanup);
			window.removeEventListener("visibilitychange", cleanup);
		};
	}, [paymentModalVisible, processIds]);


	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleCheckboxChange = (e) => {
		setFormData({ ...formData, isOnline: e.target.checked });
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
		const appointmentResponse = await AddAppointmentToDB(service, formData, reservationDetails, payNow, clientId);
		if (!appointmentResponse.success) {
			if (appointmentResponse.error === 409) {
				NotifyError(
					navigate,
					service.id ? `/appointment/${service.id}` : "/appointment",
					"L'horaire du rendez-vous chevauche un autre rendez-vous existant."
				);
			} else {
				NotifyError();
			}
			return;
		}

		const calendarResponse = await AddAppointmentToCalendar(appointmentResponse.id, reservationDetails, service, formData.isOnline);
		if (!calendarResponse.success) {
			NotifyError();
			RemoveAppointmentFromDB(appointmentResponse.id);
			return;
		}

		if (!payNow) {
			// --- Send Comfirmation Email ---
			const emailResponse = await SendAppointmentEmail(
				appointmentResponse.id,
				calendarResponse.inviteLink,
				formData,
				service.title,
				reservationDetails,
			)
			if (!emailResponse) {
				NotifyError(null, null, "Une erreur est survenue lors de l'envoi du mail de confirmation. Votre réservation & été sauvegardée avec succès");
			}
			NotifySuccess(navigate, `/seeAppointment/${appointmentResponse.id}`);
		}
		else {
			// --- Show Payment Method ---
			setEmailData({
				appointmentId: appointmentResponse.id,
				inviteLink: calendarResponse.inviteLink,
				formData,
				title: service.title,
				reservationDetails,
			})
			setProcessIds({
				calendar: calendarResponse.eventId,
				appointment: appointmentResponse.id
			})
			setPaymentModalVisible(true);
		}
	};

	const handleSubmit = (event, payNow) => {
		event.preventDefault();
		OnConfirmation(payNow);
	};

	const handleModalConfirm = async (useNewData) => {
		setShowModal(false);
		if (useNewData) {
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

	const handleSuccessPayment = async () => {
		setPaymentModalVisible(false);
		{
			// --- Send Comfirmation Email ---
			const emailResponse = await SendAppointmentEmail({ ...emailData })
			if (!emailResponse) {
				NotifyError(null, null, "Une erreur est survenue lors de l'envoi du mail de confirmation. Votre réservation & été sauvegardée avec succès");
			}
			NotifySuccess(navigate, `/seeAppointment/${processIds.appointment}`);
		}
	}

	const handleFailedPayment = async () => {
		setPaymentModalVisible(false);
		NotifyError(null, null, "Une erreur est survenue lors du payment.")

		RemoveCalendarEvent(processIds.calendar);
		RemoveAppointmentFromDB(processIds.appointment);
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

						{/* Conditionally render checkbox for online payment */}
						{service.allowOnline && (
							<div className="form-field">
								<label>
									<input
										type="checkbox"
										checked={formData.isOnline}
										onChange={handleCheckboxChange}
									/>
									<span>Rendez-vous en ligne ?</span>
								</label>
							</div>
						)}

						<div className="form-field button-group">
							<button
								className="submit-button"
								type="button"
								onClick={(e) => handleSubmit(e, true)}
								disabled={formData.payOnline}
							>
								Payer Maintenant
							</button>
							{!formData.isOnline && (
								<button
									className="submit-button"
									type="button"
									onClick={(e) => handleSubmit(e, false)}
									disabled={formData.payOnline}
								>
									Payer Plus Tard
								</button>
							)}

						</div>
					</form>
				</div>

				<div className="summary-details">
					<h2>{service.title}</h2>
					<div className="colored-line left-aligned-line"></div>
					<p><strong>Date:</strong> {new Date(reservationDetails.date).toLocaleDateString()}</p>
					<p><strong>Heure:</strong> {reservationDetails.time}</p>
					<p><strong>Durée:</strong> {FormatDuration(service.length)}</p>
					<p><strong>Prix:</strong> {service.price}€</p>
				</div>
			</div>

			{/* Payment Modal */}
			{paymentModalVisible && clientSecret && (
				<div className="payment-modal">
					<Elements stripe={stripePromise} options={{ clientSecret }}>
						<CheckoutForm
							handlePayment={handleSuccessPayment}
							handleFailedPayment={handleFailedPayment}
						/>
					</Elements>
				</div>
			)}

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
