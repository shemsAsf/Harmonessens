import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contactDiv main-div">
      <h1 className="title">Me Contacter</h1>
      <div className="info-container">
        {/* Form Section */}
        <div className="form-div">
          <h2>Formulaire de Contact</h2>
          <form action="mailto:contact@harmonessens.fr" method="POST" encType="text/plain">
            <div className="form-field">
              <input type="text" id="first-name" name="first-name" placeholder="Nom:" required />
            </div>
            <div className="form-field">
              <input type="text" id="last-name" name="last-name" placeholder="Prénom:" required />
            </div>
            <div className="form-field">
              <input type="email" id="email" name="email" placeholder="Adresse mail:" required />
            </div>
            <div className="form-field">
              <input type="tel" id="phone" name="phone" placeholder="Numéro de téléphone:" />
            </div>
            <div className="form-field">
              <input type="text" id="subject" name="subject" placeholder="Sujet:" required />
            </div>
            <div className="form-field">
              <textarea id="message" name="message" placeholder="Texte:" required></textarea>
            </div>
            <div className="form-field">
              <button type="submit">Envoyer</button>
            </div>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="contact-info">
          <div className="info-element">
            <h2><i className="fas fa-phone-alt"></i> Telephone :</h2>
            <div className="golden-line"></div>
            <a href="tel:+33123456789" className="info">+33 7 88 76 50 16 </a>
          </div>
          <div className="info-element">
            <h2><i className="fas fa-envelope"></i> Mail :</h2>
            <div className="golden-line"></div>
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
