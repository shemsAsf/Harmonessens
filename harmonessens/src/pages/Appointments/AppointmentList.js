import React from "react";
import { appointments } from "../../Data/Appointments";
import AppointmentCard from "./AppointmentCard";

const AppointmentList = () => {
  return (
    <div className="main-div">
      <h1 className="main-title">RENDEZ-VOUS</h1>
      <div className="appointment-list">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
};

export default AppointmentList;
