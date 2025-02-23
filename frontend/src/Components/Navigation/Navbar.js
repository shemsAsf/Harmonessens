import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navigate = useNavigate();

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const handleLogoClick = () => {
		closeMobileMenu();
		navigate("/");
	};

	return (
		<nav className="navbar">
			<div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
				<img src="/logo.png" alt="Logo" className="logo" />
				<h1 className="website-name">Harmonessens</h1>
			</div>
			<button className="hamburger" onClick={toggleMobileMenu}>
				&#9776;
			</button>
			<ul className={`nav-list ${isMobileMenuOpen ? "open" : ""}`}>
				<li className="nav-item">
					<Link to="/information" className="nav-link" onClick={closeMobileMenu}>
						Présentation
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/appointment" className="nav-link" onClick={closeMobileMenu}>
						Prendre RDV
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/contact" className="nav-link" onClick={closeMobileMenu}>
						Contact
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
