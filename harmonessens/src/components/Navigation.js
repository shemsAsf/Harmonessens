import { Link } from "react-router-dom";
import "./Navigation.css";
import logo from "../ressources/logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="website-name">Harmonessens</h1>
      </div>
      <ul className="nav-list">
        <li className="nav-item dropdown">
          <Link to="/" className="nav-link">
            Information
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
