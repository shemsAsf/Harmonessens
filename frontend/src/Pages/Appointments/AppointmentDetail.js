import React from "react";
import { useParams } from "react-router-dom";
import AppointmentCalendar from "../../Components/Calendar/AppointmentCalendar";
import { appointments } from "../../Data/Appointments";
import { FormatDuration } from "../../Utils/DateTimeUtil";
import "../../Style/Appointment.css";

const AppointmentDetail = () => {
	const { id } = useParams();
	const appointment = appointments.find((appt) => appt.id === parseInt(id));

	if (!appointment) return <p className="error-message">Appointment not found</p>;

	return (
		<div className="main-div">
			<h1 className="main-title">{appointment.title}</h1>
			<div className="colored-line centered-line"></div>
			<br />

			<div className="text-columns">
				{appointment.description.map((paragraph, index) => (
					<p key={index}>{paragraph}</p>
				))}
			</div>

			<div className="info-card">
				<i className="fas fa-clock info-icon"></i>
				<div className="info-content">
					<p>Durée: <span>{FormatDuration(appointment.length)}</span></p>
				</div>
			</div>

			<div className="info-card">
				<i className="fas fa-euro-sign info-icon"></i>
				<div className="info-content">
					<p>Prix: <span>{appointment.price}€</span></p>
				</div>
			</div>
			{ appointment.allowOnline && (
				

			<div className="info-card">
			<i className="fas fa-globe info-icon"></i>
			<div className="info-content">
				<p>Ce rendez vous peut être prix en ligne</p>
			</div>
		</div>
			)}
			<br />
			<AppointmentCalendar appointmentId={appointment.id} />
		</div>
	);
};

export default AppointmentDetail;
