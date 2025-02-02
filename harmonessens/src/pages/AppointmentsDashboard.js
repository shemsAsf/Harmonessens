import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../components/Calendar.css";
import ReservationDetails from "../components/ReservationDetail";

const AppointmentsDashboard = () => {
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(localStorage.getItem("adminToken"));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const today = new Date();

    const handleLogin = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem("adminToken", data.token);
            setToken(data.token);
            setIsAuthenticated(true);
            fetchAppointments(data.token);
        } else {
            alert("Mot de passe incorrect");
        }
    };

    const fetchAppointments = async (authToken) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/get-appointments`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            const data = await response.json();
            console.log(data.appointments);
            if (Array.isArray(data.appointments)) {
                setAppointments(data.appointments);
            } else {
                console.error("Appointments data is not in the expected format");
                setAppointments([]);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setAppointments([]);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAppointments(token);
        }
    }, [token]);

    if (!isAuthenticated) {
        return (
            <div className="admin-login">
                <h2>Connexion Admin</h2>
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Se connecter</button>
            </div>
        );
    }

    const filteredAppointments = appointments
        .filter((appt) => {
            const appointmentDate = new Date(appt.start_time);
            return appointmentDate.toDateString() === selectedDate.toDateString();
        })
        .sort((a, b) => {
            const startA = new Date(a.start_time).getTime();
            const startB = new Date(b.start_time).getTime();
            return startA - startB;
        });

    return (
        <div className="main-div">
            <div className="admin-page">
                <h1 className="main-title">Gestion des rendez-vous</h1>


                <div className="calendar-container">
                    <h3>Choisir une date</h3>
                    <div className="calendar-flex-container">
                        <Calendar
                            onChange={(date) => setSelectedDate(date)}
                            value={selectedDate}
                            minDate={today}
                        />
                    </div>
                </div>

                <h2 className="main-title" >Rendez-vous du {selectedDate.toLocaleDateString()}</h2>
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appt) => (
                        <ReservationDetails appointmentId={appt.id} />
                    ))
                ) : (
                    <p className="centered-text">Aucun rendez-vous ce jour-là.</p>
                )}
            </div>
        </div>
    );
};

export default AppointmentsDashboard;