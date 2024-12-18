import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import logo from '../ressources/logo.png';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="website-name">Harmonessens</h1>  
      </div>
      <button className="hamburger" onClick={toggleMobileMenu}>
        &#9776;
      </button>
      <ul className={`nav-list ${isMobileMenuOpen ? "open" : ""}`}>
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Presentation
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/blog" className="nav-link">
            Blog
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/appointment" className="nav-link">
            Prendre RDV
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
