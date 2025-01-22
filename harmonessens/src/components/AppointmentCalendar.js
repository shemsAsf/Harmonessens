import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { appointments } from "../Data/Appointments";
import "./AppointmentCalendar.css"

// Opening hours
const openingHours = {
  "Tuesday": { morning: [9, 12.5], afternoon: [14, 17.5] },  // 9h-12h30 and 14h-17h30
  "Wednesday": { morning: [9, 12.5], afternoon: [14, 17.5] },
  "Thursday": { morning: [9, 12.5], afternoon: [14, 17.5] },
  "Friday": { morning: [9, 12.5], afternoon: [14, 17.5] },
  "Saturday": { morning: [10, 13.5] },  // 10h-13h30
};

const AppointmentCalendar = ({ appointmentId, onAppointmentSubmit }) => {
  const appointment = appointments.find((appt) => appt.id === appointmentId);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [length, setLength] = useState(appointment?.length || 60);
  const [price, setPrice] = useState(appointment?.price || 0);
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

  // Get available times for the selected date and ensure that the time doesn't exceed working hours
  const getAvailableTimes = (date) => {
    const dayOfWeek = date.getDay();
    const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek];
    const hours = openingHours[dayName];
    if (!hours) return [];
  
    const times = [];
  
    // Helper function to process time ranges
    const processTimeRange = (range) => {
      for (let i = range[0]; i < range[1]; i += 0.5) {
        const startHour = Math.floor(i);
        const startMinutes = (i % 1) * 60;

        const endTimeInMinutes = (startHour * 60 + startMinutes) + length;

        const endHour = Math.floor(endTimeInMinutes / 60);
        const endMinutes = endTimeInMinutes % 60;

        const slotEndHour = Math.floor(range[1]);
        const slotEndMinutes = (range[1] % 1) * 60;
  
        const startTime = startHour + startMinutes / 60;
        const endTime = slotEndHour + slotEndMinutes / 60;
  
        if (startTime + length / 60 <= endTime) {
          const timeString = `${startHour}:${startMinutes === 0 ? "00" : startMinutes} - ${endHour}:${endMinutes === 0 ? "00" : slotEndMinutes}`;
          times.push(timeString);
        }
      }
    };
  
    // Process both morning and afternoon ranges if they exist
    if (hours.morning) processTimeRange(hours.morning);
    if (hours.afternoon) processTimeRange(hours.afternoon);
  
    return times;
  };
  
  // Handle appointment submission
  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      const appointmentDetails = {
        id: appointment.id,
        date: selectedDate,
        time: selectedTime,
      };
      navigate("/summary", {state: appointmentDetails});
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
					{getAvailableTimes(selectedDate).map((time, index) => (
						<option key={index} value={time}>
						{time}
						</option>
					))}
					</select>
				</div>
				
				<button 
					className="confirm-button" 
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
