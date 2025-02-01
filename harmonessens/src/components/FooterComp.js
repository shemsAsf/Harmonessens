import React from "react";
import "./FooterComp.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columns">
        {/* Colonne 1 : Horaires d'ouverture */}
        <div className="footer-column">
          <h3>Horaires d'ouverture</h3>
          <div className="colored-line"></div>
          <div className="footer-column-info">
            <p>
              <i className="fas fa-clock"></i>
              <strong>Mardi au Vendredi : </strong>
            </p>
            <p className="p-wm">9:30 à 13:00 | 14:00 à 18:30</p>
            <p>
              <i className="fas fa-clock"></i>
              <strong>Samedi : </strong>
            </p>
            <p className="p-wm">9:30 à 13:00</p>
          </div>
        </div>

        {/* Colonne 2 : Réseaux sociaux */}
        <div className="footer-column">
          <h3>Réseaux sociaux</h3>
          <div className="colored-line"></div>
          <div className="social-links footer-column-info">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-instagram"></i> Instagram
            </a>
          </div>
        </div>

        {/* Colonne 3 : Contact */}
        <div className="footer-column">
          <h3>Contact</h3>
          <div className="colored-line"></div>
          <div className="footer-column-info">
            <p>
              <i className="fas fa-envelope"></i>
              <strong>Email :</strong> 
            </p>
            <p className="p-wm">
              <a href="mailto:contact@harmonessens.fr" className="contact-link">contact@harmonessens.fr</a>
            </p>
            <p>
              <i className="fas fa-phone-alt"></i>
              <strong>Téléphone :</strong>
            </p>
            <p className="p-wm">
              <a href="tel:+33788765016" className="contact-link">+33 7 88 76 50 16</a>
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i>
              <strong>Adresse :</strong> 
            </p>
            <p className="p-wm">
              125 allée de Lauzard <br />
              34980 Saint Gely du Fesc
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
