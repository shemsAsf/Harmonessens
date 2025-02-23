import React from "react";
import { appointments } from "../../Data/Appointments";
import AppointmentCard from "./AppointmentCard";
import { useNavigate } from "react-router-dom";
import "../../Style/Appointment.css";

const AppointmentList = () => {
	const navigate = useNavigate();

	return (
		<div className="main-div">
			<h1 className="main-title">RENDEZ-VOUS</h1>
			<div className="appointment-list">
				{appointments.map((appointment) => (
					<AppointmentCard key={appointment.id} appointment={appointment} />
				))}
			</div>
			<br />
			<div className="colored-line" id="centered-gl"></div><br />

			<div className="appointment-end-text">
				<p>Plusieurs soins vous appellent, mais vous ne savez pas lequel vous convient le mieux ?<br /><br />
					Lorsque l’âme perçoit l’appel du soin avant que l’esprit ne comprenne, l’hésitation est naturelle. Chaque chemin a sa justesse, et parfois, il suffit simplement d’un échange pour sentir ce qui résonne profondément en vous.
					Si vous en ressentez le besoin, je vous invite à me laisser un message. Je prendrai le temps de vous rappeler pour que nous trouvions ensemble ce qui vous correspond.
				</p>
				<button
					className="submit-button"
					type="button"
					onClick={() => {navigate("/contact");}}
				>Me Contacter</button>
			</div>
		</div>
	);
};

export default AppointmentList;
