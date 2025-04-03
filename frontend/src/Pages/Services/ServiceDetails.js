import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppointmentCalendar from "../../Components/Calendar/AppointmentCalendar";
import { FormatDuration } from "../../Utils/DateTimeUtil";
import "../../Style/Services.css";
import { GetService } from "../../Utils/ServicesUtils";

const ServiceDetails = () => {
	const { id } = useParams();
	const [service, setService] = useState(null);

	useEffect(() => {
		if (id) {
			const fetchService = async () => {
				try {
					const fetchedService = await GetService(id);
					if (fetchedService && fetchedService.success) {
						setService(fetchedService.service);
					} else {
						console.error("Service not found or error fetching");
					}
				} catch (error) {
					console.error("Error fetching service:", error);
				}
			};

			fetchService();
		}
	}, [id]);

	if (!service) return <p className="error-message">Service not found</p>;

	return (
		<div className="main-div">
			<h1 className="main-title">{service.title}</h1>
			<div className="colored-line centered-line"></div>
			<br />

			<div className="text-columns">
				{service.description.split("\n").map((paragraph, index) => (
					<p key={index}>{paragraph}</p>
				))}
			</div>

			<div className="info-card">
				<i className="fas fa-clock info-icon"></i>
				<div className="info-content">
					<p>Durée: <span>{FormatDuration(service.length)}</span></p>
				</div>
			</div>

			<div className="info-card">
				<i className="fas fa-euro-sign info-icon"></i>
				<div className="info-content">
					<p>Prix: <span>{service.price}€</span></p>
				</div>
			</div>
			{service.allowOnline && (


				<div className="info-card">
					<i className="fas fa-globe info-icon"></i>
					<div className="info-content">
						<p>Ce rendez vous peut être prix en ligne</p>
					</div>
				</div>
			)}
			<br />
			<AppointmentCalendar service={service} />
		</div>
	);
};

export default ServiceDetails;
