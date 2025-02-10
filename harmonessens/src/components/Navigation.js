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
			<div className="navbar-logo">
				<img src="/logo.png" alt="Logo" className="logo" />
				<Link to="/" className="nav-link">
					<h1 className="website-name nav-link">Harmonessens</h1>
				</Link>
			</div>
			<button className="hamburger" onClick={toggleMobileMenu}>
				&#9776;
			</button>
			<ul className={`nav-list ${isMobileMenuOpen ? "open" : ""}`}>
				<li className="nav-item dropdown">
					<Link to="/information" className="nav-link">
						Présentation
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
