import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navigation";
import Information from "./pages/Informations";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Information />} />
        <Route path="/information/:section" element={<Information />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment" element={<Appointment />} />
      </Routes>
    </Router>
  );
}

export default App;
