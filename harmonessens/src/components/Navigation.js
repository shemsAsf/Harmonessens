import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={toggleMobileMenu}>
        &#9776;
      </button>
      <ul className={`nav-list ${isMobileMenuOpen ? "open" : ""}`}>
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/blog" className="nav-link">
            Blog
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/appointment" className="nav-link">
            Appointment
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
