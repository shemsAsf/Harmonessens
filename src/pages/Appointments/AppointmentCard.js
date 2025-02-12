import React, { useEffect, useState } from "react";
import "./AppointmentCard.css";

const AppointmentCard = ({ appointment }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [sliceValue, setSliceValue] = useState(window.innerWidth < 768 ? 100 : 300);

	useEffect(() => {
		const handleResize = () => {
			setSliceValue(window.innerWidth < 768 ? 100 : 300);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="appointment-card">
			<img src={appointment.image} alt={appointment.title} className="appointment-image" />
			<div className="appointment-content">
				<h3>{appointment.title}</h3>
				{isExpanded
					? appointment.description.map((paragraph, index) => <p key={index}>{paragraph}</p>)
					: `${appointment.description[0].slice(0, sliceValue)}...`}

				<br />
				<span className="toggle-text" onClick={() => setIsExpanded(!isExpanded)}>
					{isExpanded ? "^ Réduire" : "v En savoir plus"}
				</span>

				{isExpanded && (
					<div className="button-container">
						<button
							className="appointment-button"
							onClick={() => window.location.href = `/appointment/${appointment.id}`}>
							Prendre Rendez-vous
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AppointmentCard;