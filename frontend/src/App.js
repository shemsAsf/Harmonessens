import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/HomePage";
import Navbar from "./Components/Navigation/Navbar";
import Footer from "./Components/Footer/FooterComp";
import Presentation from "./Pages/Presentation";
import ServiceList from "./Pages/Services/ServiceList";
import Contact from "./Pages/Contact";
import Dashboard from "./Pages/Admin/Dashboard";
import ServiceForm from "./Pages/Admin/ServiceForm";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/presentation" element={<Presentation />} />
				<Route path="/appointment" element={<ServiceList />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/Dashboard/:page?" element={<Dashboard />} />
				<Route path="/ServiceForm/:id?" element={<ServiceForm />} />
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;
