import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { appointments } from "../Data/Appointments";
import "./Form.css";

const Summary = () => {
  const { state: appointmentDetails } = useLocation();
  const appointment = appointments.find((appt) => appt.id === appointmentDetails.id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentOption = (payNow) => {
    if (payNow) {
      alert('Redirecting to payment platform...');
      // Add your payment platform logic here
    } else {
      alert('Appointment confirmed without payment.');
      // Add your confirmation logic here
    }
  };

  const handleSubmit = (event, payNow) => {
    event.preventDefault();
    handlePaymentOption(payNow);
  };

  return (
    <div className="main-div">
      <h1 className="main-title">Récapitulatif</h1>
      <h3>{appointment.title}</h3>
      
      {/* Appointment Information */}
      <img src={appointment.image} alt={appointment.title} />
      <p>Date: {new Date(appointmentDetails.date).toLocaleDateString()}</p>
      <p>Heure: {appointmentDetails.time}</p>
      <p>Durée: {appointment.length}</p>
      <p>Prix: {appointment.price}€</p>

      {/* Form Section */}
      <div className="form-div">
      <form>
        <div className="form-field">
          <input
            type="text"
            name="firstName"
            placeholder="Nom:"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <input
            type="text"
            name="lastName"
            placeholder="Prénom:"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <input
            type="email"
            name="email"
            placeholder="Adresse mail:"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <input
            type="tel"
            name="phone"
            placeholder="Numéro de téléphone:"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <textarea
            name="message"
            placeholder="Commentaire (facultatif):"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-field button-group">
          <button
            className="submit-button"
            type="button"
            onClick={(e) => handleSubmit(e, true)}
          >
            Payer Maintenant
          </button>
          <button
            className="submit-button"
            type="button"
            onClick={(e) => handleSubmit(e, false)}
          >
            Payer Plus Tard
          </button>
        </div>
      </form>
    </div>


      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>Retour</button>
    </div>
  );
};

export default Summary;
