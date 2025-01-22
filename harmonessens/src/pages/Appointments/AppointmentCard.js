import React, { useState } from "react";
import "./AppointmentCard.css";

const AppointmentCard = ({ appointment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="appointment-card">
      <img src={appointment.image} alt={appointment.title} className="appointment-image" />
      <div className="appointment-content">
        <h3>{appointment.title}</h3>
          {isExpanded
            ? appointment.description.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            : `${appointment.description[0].slice(0, 300)}...`}
            
            <br />
        <span className="toggle-text" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "^ Réduire" : "v En savoir plus"}
        </span>

        {isExpanded && (
          <button
            className="appointment-button"
            onClick={() => window.location.href = `/appointment/${appointment.id}`}
          >
            Prendre Rendez-vous
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;