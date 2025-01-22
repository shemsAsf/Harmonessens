import React from "react";
import { useLocation } from "react-router-dom";

const Recapitulatif = () => {
  const location = useLocation();
  const { appointmentDetails } = location.state || {};

  if (!appointmentDetails) {
    return <p>No appointment details found</p>;
  }

  const { title, date, time, length, price } = appointmentDetails;

  return (
    <div className="recap-container">
      <h2>Your Appointment</h2>
      <div className="recap-details">
        <p><strong>Title:</strong> {title}</p>
        <p><strong>Date:</strong> {date.toLocaleDateString()}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Length:</strong> {length} minutes</p>
        <p><strong>Price:</strong> ${price}</p>
      </div>

      <div className="payment-options">
        <button onClick={() => alert("Payment Now option")}>Pay Now</button>
        <button onClick={() => alert("Payment Later option")}>Pay Later</button>
      </div>
    </div>
  );
};

export default Recapitulatif;
