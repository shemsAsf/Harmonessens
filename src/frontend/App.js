import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage";
import Navbar from "./Components/Navigation/Navbar";
import Information from "./Pages/Informations";
import Blog from "./Pages/Blog";
import Contact from "./Pages/Contact";
import AppointmentList from "./Pages/Appointments/AppointmentList";
import AppointmentDetail from "./Pages/Appointments/AppointmentDetail";
import Summary from "./Pages/Summary";
import AppointmentsDashboard from "./Pages/AppointmentsDashboard";
import SeeAppointment from "./Pages/SeeAppointment";
import Footer from "./Components/Footer/FooterComp";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/information" element={<Information />} />
        <Route path="/information/:section" element={<Information />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment" element={<AppointmentList />} />
        <Route path="/appointment/:id" element={<AppointmentDetail />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/AppointmentsDashboard" element={<AppointmentsDashboard />} />
        <Route path="/SeeAppointment/:appointmentId?" element={<SeeAppointment />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
