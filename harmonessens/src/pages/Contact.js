import React, { useState, useEffect } from "react";
import "./Contact.css";
import Swal from "sweetalert2";

function Contact() {
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(JSON.stringify(formData))
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Message envoyé avec succès !",
          confirmButtonColor: "#4CAF50",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: `Une erreur est survenue : ${data.message || "Erreur inconnue"}`,
          confirmButtonColor: "#F44336",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="main-div">
      <h1 className="main-title">Me Contacter</h1>
      <div className="info-container">
        {/* Form Section */}
        <div className="form-div">
          <h2>Formulaire de Contact</h2>
          <form onSubmit={handleSubmit}>
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
              <input
                type="text"
                name="subject"
                placeholder="Sujet:"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <textarea
                name="message"
                placeholder="Texte:"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-field">
              <button className="submit-button" type="submit">
                Envoyer
              </button>
            </div>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="contact-info">
          <div className="info-element">
            <h2><i className="fas fa-phone-alt"></i> Telephone :</h2>
            <div className={`golden-line ${isMobile ? "" : "left-aligned-line"}`}></div>
            <a href="tel:+33123456789" className="info">+33 7 88 76 50 16 </a>
          </div>
          <div className="info-element">
            <h2><i className="fas fa-envelope"></i> Mail :</h2>
            <div className={`golden-line ${isMobile ? "" : "left-aligned-line"}`}></div>
            <a href="mailto:contact@harmonessens.fr" className="info">contact@harmonessens.fr</a>
          </div>
        </div>
      </div>

      {/* Google Map Section */}
      <div className="map-container">
        <iframe
          title="Harmonessens Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5771.241927372349!2d3.8135895105326507!3d43.67685227098037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b6abdb1eefab85%3A0x1d40aa1d8cd3b77f!2sHarmonessens%20naturopathie%20-%20soins%20chamaniques...!5e0!3m2!1sfr!2sfr!4v1734531352075!5m2!1sfr!2sfr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;
