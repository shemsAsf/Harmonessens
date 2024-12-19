import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage"
import Navbar from "./components/Navigation";
import Information from "./pages/Informations";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import Footer from "./components/FooterComp";
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
        <Route path="/appointment" element={<Appointment />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
