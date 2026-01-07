import React, { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import "../../Style/Services.css";
import { GetServices } from "../../Utils/ServicesUtils";

const AppointmentCards = ({ isDashboard = false }) => {
	const [services, setServices] = useState([]);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const fetchedServices = await GetServices().then();
				setServices(fetchedServices);
			} catch (error) {
				console.error("Error fetching services:", error);
			}
		};

		fetchServices();
	}, []);

	return (
		<div className="appointment-list">
			{services.map((service) => (
				<div key={service.id} className="appointment-item">
					<ServiceCard service={service} isDashboard={isDashboard} />
				</div>
			))}
		</div>
	)
};

export default AppointmentCards;