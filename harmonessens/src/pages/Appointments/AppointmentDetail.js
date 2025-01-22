import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AppointmentCalendar from "../../components/AppointmentCalendar";
import { appointments } from "../../Data/Appointments";

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? hours + 'h' : ''} ${mins > 0 ? mins + 'min' : ''}`;
};

const AppointmentDetail = () => {
  const { id } = useParams();
  const appointment = appointments.find((appt) => appt.id === parseInt(id));
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  if (!appointment) return <p>Appointment not found</p>;

  return (
    <div className="main-div">
      <h1 className="main-title">{appointment.title}</h1>
      <div className="golden-line" id="centered-gl"></div>
      <br />

      <div className="text-columns">
        {appointment.description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
        
      {/* Display Duration and Price */}
      <div className="appointment-info">
        <p><strong>Durée:</strong> {formatDuration(appointment.length)}</p>
        <p><strong>Prix:</strong> {appointment.price}€</p>
      </div>

      <br></br>
      <AppointmentCalendar
        appointmentId={appointment.id}
      />
    </div>
  );
};

export default AppointmentDetail;
