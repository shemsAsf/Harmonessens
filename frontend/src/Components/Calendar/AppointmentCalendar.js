import React, { useEffect, useState, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import "../../Style/Calendar.css"

// Opening hours
const openingHours = {
	"Tuesday": { morning: [9.5, 13], afternoon: [14, 18.5] },
	"Wednesday": { morning: [9.5, 13], afternoon: [14, 18.5] },
	"Thursday": { morning: [9.5, 13], afternoon: [14, 18.5] },
	"Friday": { morning: [9.5, 13], afternoon: [14, 18.5] },
	"Saturday": { morning: [9.5, 13] },
};

const AppointmentCalendar = ({ service }) => {
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [availableTimes, setAvailableTimes] = useState([]);
	const navigate = useNavigate();

	// Get today's date to prevent selecting past dates
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Set to the start of the day to exclude time part

	// Handle date selection
	const handleDateChange = (date) => {
		setSelectedDate(date);
		setSelectedTime(null); // Reset time when date changes
	};

	// Handle time selection
	const handleTimeChange = (event) => {
		setSelectedTime(event.target.value);
	};

	// Check if the selected date is within allowed days
	const isAllowedDay = (date) => {
		const dayOfWeek = date.getDay();
		return dayOfWeek >= 2 && dayOfWeek <= 6; // Tuesday to Saturday
	};

	const processAvailableTimes = useCallback((existingAppointments, hours) => {
		const availableTimes = [];

		const processTimeRange = (range) => {
			for (let i = range[0]; i < range[1] - service.length / 60; i += 0.5) {
				const startHour = Math.floor(i);
				const startMinutes = (i % 1) * 60;
				const startTime = startHour + startMinutes / 60;

				const endTimeInMinutes = startHour * 60 + startMinutes + service.length;
				const endHour = Math.floor(endTimeInMinutes / 60);
				const endMinutes = endTimeInMinutes % 60;
				const endTime = endHour + endMinutes / 60;

				// Check if the slot overlaps with any existing appointment
				const hasOverlap = existingAppointments.some(appointment =>
					(startTime <= appointment.start && endTime >= appointment.start) ||
					(startTime <= appointment.end && endTime >= appointment.end) ||
					(startTime >= appointment.start && endTime <= appointment.end)
				);

				if (!hasOverlap) {
					const timeString = `${startHour}:${startMinutes === 0 ? "00" : startMinutes} - ${endHour}:${endMinutes === 0 ? "00" : endMinutes}`;
					availableTimes.push(timeString);
				}
			}
		};

		if (hours.morning) processTimeRange(hours.morning);
		if (hours.afternoon) processTimeRange(hours.afternoon);

		return availableTimes.length > 0 ? availableTimes : ["Aucun créneau disponible pour cette journée."];
	}, [service.length]);

	// Get available times for the selected date and ensure that the time doesn't exceed working hours
	const getAvailableTimes = useCallback(async (date) => {
		if (!date) return [];

		date = new Date(date);

		// Adjust for local time zone
		const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

		// Format the date to yyyy-mm-dd
		const formattedDate = localDate.toISOString().split('T')[0];

		const dayOfWeek = date.getDay();
		const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek];
		const hours = openingHours[dayName];
		if (!hours) return ["Aucun créneau disponible pour cette journée."];

		try {
			// Fetch existing appointments from the API
			const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/get-appointments-of-day?date=${formattedDate}`);
			const data = await response.json();

			if (!data.success) {
				console.error("Error fetching appointments:", data.message);
				return [];
			}

			const existingAppointments = data.appointments.map(app => {
				const startTime = app.start_time.split(':');
				const endTime = app.end_time.split(':');

				const start = parseInt(startTime[0]) + parseInt(startTime[1]) / 60;
				const end = parseInt(endTime[0]) + parseInt(endTime[1]) / 60;

				return { start, end };
			});

			return processAvailableTimes(existingAppointments, hours);
		} catch (error) {
			console.error("Failed to fetch appointments:", error);
			return [];
		}
	}, [processAvailableTimes]);

	useEffect(() => {
		const fetchAvailableTimes = async () => {
			const times = await getAvailableTimes(selectedDate);
			setAvailableTimes(times);
		};

		fetchAvailableTimes();
	}, [selectedDate, getAvailableTimes]);


	// Handle appointment submission
	const handleSubmit = () => {
		if (selectedDate && selectedTime) {
			const reservationDetails = {
				id: service.id,
				date: selectedDate,
				time: selectedTime,
			};
			navigate("/summary", { state: {reservationDetails, service} });
		} else {
			alert("Please select a date and time for your appointment.");
		}
	};

	return (
		<div className="calendar-container">
			<h3>Choisir une date</h3>
			<div className="calendar-flex-container">

				<Calendar
					onChange={handleDateChange}
					value={selectedDate}
					minDate={new Date(today.setDate(today.getDate() + 1))} // Disable past dates
					tileDisabled={({ date }) => !isAllowedDay(date)} // Disable days other than Tuesday-Saturday
				/>

				{selectedDate && isAllowedDay(selectedDate) && (
					<div className="time-button-container">
						<div className="time-selection">
							<label>Choisir une heure:</label>
							<select onChange={handleTimeChange} value={selectedTime}>
								<option value="">Horaire</option>
								{availableTimes.map((time, index) => (
									<option key={index} value={time}>
										{time}
									</option>
								))}
							</select>
						</div>

						<button
							className="submit-button"
							onClick={handleSubmit}
							disabled={!selectedTime}>
							Valider
						</button>
					</div>
				)}
			</div>
		</div>

	);
};

export default AppointmentCalendar;
