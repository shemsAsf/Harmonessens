import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import ReservationDetails from "../../Components/ReservationDetail";
import "../../Style/Calendar.css";
import "../../Style/Form.css";
import { addAppointmentLockToDB, RemoveAppointmentFromDB } from "../../Utils/AppointmentUtils";
import { NotifyError, NotifySuccess } from "../../Utils/NotifyUtil";
import { useNavigate } from "react-router-dom";

const generateTimes = (startHour, endHour, interval) => {
	let times = [];
	let current = startHour * 60;
	let end = endHour * 60;
	while (current <= end) {
		let hours = Math.floor(current / 60);
		let minutes = current % 60;
		let formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
		times.push(formattedTime);
		current += interval;
	}
	return times;
};

const AppointmentsDashboard = () => {
	const [appointments, setAppointments] = useState([]);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedStartTime, setSelectedStartTime] = useState("");
	const [selectedEndTime, setSelectedEndTime] = useState("");
	const [showAll, setShowAll] = useState(false);
	const [clientId, setClientId] = useState(0);
	const [showReservationForm, setShowReservationForm] = useState(false);

	const navigate = useNavigate()

	useEffect(() => {
		const fetchClientId = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/clients/client-exist?email=harmonessens@gmail.com`);
				const data = await response.json();
				if (data.client.id) {
					setClientId(data.client.id);
					console.log("Fetched clientId:", data.client.id);
				}
			} catch (error) {
				console.error("Error fetching client ID:", error);
			}
		};
		fetchClientId();
	}, []);

	const availableTimes = generateTimes(9.5, 18.5, 30);

	useEffect(() => {
		const authToken = localStorage.getItem("token");

		if (authToken) {
			fetchAppointments(authToken);
		}
	}, []);

	const fetchAppointments = async (authToken) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/get-appointments`, {
				headers: { Authorization: `Bearer ${authToken}` },
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();

			if (Array.isArray(data.appointments)) {
				setAppointments(data.appointments);
			} else {
				console.error("Appointments data is not in the expected format");
				setAppointments([]);
			}
		} catch (error) {
			console.error("Error fetching appointments:", error);
			setAppointments([]);
		}
	};

	const handleStartTimeChange = (e) => {
		setSelectedStartTime(e.target.value);
		setSelectedEndTime("");
	};

	const handleEndTimeChange = (e) => {
		setSelectedEndTime(e.target.value);
	};

	const handleSubmit = async () => {

		if (!clientId || clientId === 0) {
			console.error("Invalid clientId, submission aborted");
			NotifyError(null, null, "Client par default introuvable.")
			return;
		}

		if (selectedStartTime && selectedEndTime && clientId) {
			const start = selectedStartTime.split(':').map(Number);
			const end = selectedEndTime.split(':').map(Number);
			const startMinutes = start[0] * 60 + start[1];
			const endMinutes = end[0] * 60 + end[1];
			const duration = endMinutes - startMinutes;

			const result = await addAppointmentLockToDB(selectedDate, selectedStartTime, duration, clientId);
			if(result.success){
				NotifySuccess(navigate, 0, "Creneaux reservé avec succes", "Success")
			}
			else{
				NotifyError(null, null, "Veuillez réessayer plus tard.")
			}
		}
	};

	const filteredEndTimes = selectedStartTime
		? availableTimes.slice(availableTimes.indexOf(selectedStartTime) + 1)
		: [];

	const handleSeeAll = () => {
		setShowAll(true);
	};

	const filteredAppointments = showAll
		? appointments.filter((appt) => new Date(appt.start_time) > new Date())
		: appointments.filter((appt) => {
			const appointmentDate = new Date(appt.start_time);
			return appointmentDate.toDateString() === selectedDate.toDateString();
		});

	return (
		<div className="admin-page">
			<h1 className="main-title">Gestion des rendez-vous</h1>

			<div className="calendar-container">
				<h3>Choisir une date</h3>
				<div className="calendar-flex-container">
					<div className="calendar-flex-collumn-container">
						<Calendar
							onChange={(date) => {
								setSelectedDate(date);
								setShowAll(false);
							}}
							value={selectedDate}
						/>

						<br />

						<button
							className="cancel-button"
							onClick={() => setShowReservationForm(!showReservationForm)}
						>
							{showReservationForm ? "Annuler" : "Bloquer un créneau"}
						</button>
					</div>

					{showReservationForm && (

						<div className="time-button-container">
							<div className="time-selection">
								<label>Heure de début :</label>
								<select onChange={handleStartTimeChange} value={selectedStartTime}>
									<option value="">Sélectionner</option>
									{availableTimes.map((time, index) => (
										<option key={index} value={time}>{time}</option>
									))}
								</select>
							</div>

							<div className="time-selection">
								<label>Heure de fin :</label>
								<select onChange={handleEndTimeChange} value={selectedEndTime} disabled={!selectedStartTime}>
									<option value="">Sélectionner</option>
									{filteredEndTimes.map((time, index) => (
										<option key={index} value={time}>{time}</option>
									))}
								</select>
							</div>

							<button
								className="submit-button"
								onClick={handleSubmit}
								disabled={!selectedStartTime || !selectedEndTime || (clientId === 0)}
							>
								Valider
							</button>
						</div>
					)}
				</div>
			</div>

			<br />

			<button className="submit-button" onClick={handleSeeAll}>Voir tous les futurs rendez-vous</button>
			<h2 className="main-title">{showAll ? "Tous les futurs rendez-vous" : `Rendez-vous du ${selectedDate.toLocaleDateString()}`}</h2>
			{filteredAppointments.length > 0 ? (
				filteredAppointments
					.sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
					.map((appt) => (<div>
						<ReservationDetails key={appt.id} appointmentId={appt.id} />
						<button onClick={() => RemoveAppointmentFromDB(appt.id)}>Supprimer le rendez vous</button>
						</div>
					))
			) : (
				<p className="centered-text">Aucun rendez-vous trouvé.</p>
			)}
		</div>
	);
};

export default AppointmentsDashboard;
