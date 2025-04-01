import React, { useEffect, useState } from "react";
import "../../Style/Services.css";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service, isDashboard }) => {
	const navigate = useNavigate();
	const [isExpanded, setIsExpanded] = useState(false);
	const [sliceValue, setSliceValue] = useState(window.innerWidth < 768 ? 100 : 300);

	useEffect(() => {
		const handleResize = () => {
			setSliceValue(window.innerWidth < 768 ? 100 : 300);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const renderDescription = () => {
		if (isExpanded) {
			return service.description.split("\n").map((paragraph, index) => <p key={index}>{paragraph}</p>);
		} else {
			return <p>{service.description.slice(0, sliceValue)}...</p>;
		}
	};

	// If service.active is 0 and isDashboard is false, don't render the card
	if (service.isActive === 0 && !isDashboard) {
		return null;
	}

	return (
		<div className={`appointment-card ${service.isActive === 0 ? 'inactive' : ''}`}>
			<img src={service.image} alt={service.title} className="appointment-image" />

			<div className="appointment-content">
				<h3>{service.title}</h3>
				{renderDescription()}

				<br />
				<span className="toggle-text" onClick={() => setIsExpanded(!isExpanded)}>
					{isExpanded ? "^ Réduire" : "v En savoir plus"}
				</span>
				<div className="button-container">
					{isDashboard ? (
						<button
							className="appointment-button"
							type="button"
							onClick={() => navigate(`/ServiceForm/${service.id}`)}
						>
							Modifier
						</button>
					) : (
						<button
							className="appointment-button"
							onClick={() => window.location.href = `/appointment/${service.id}`}
						>
							Prendre Rendez-vous
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ServiceCard;
