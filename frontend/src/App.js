import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage";
import Navbar from "./Components/Navigation/Navbar";
import Information from "./Pages/Informations";
import Blog from "./Pages/Blog";
import Contact from "./Pages/Contact";
import ServiceList from "./Pages/Services/ServiceList";
import ServiceDetails from "./Pages/Services/ServiceDetails";
import Summary from "./Pages/Summary";
import Dashboard from "./Pages/Admin/Dashboard";
import ServiceForm from "./Pages/Admin/ServiceForm";
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
        <Route path="/appointment" element={<ServiceList />} />
        <Route path="/appointment/:id" element={<ServiceDetails />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/Dashboard/:page?" element={<Dashboard />} />
        <Route path="/ServiceForm/:id?" element={<ServiceForm />} />
        <Route path="/SeeAppointment/:appointmentId?" element={<SeeAppointment />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
