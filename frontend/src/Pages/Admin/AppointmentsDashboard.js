import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import ReservationDetails from "../../Components/ReservationDetail";
import "../../Style/Calendar.css";
import "../../Style/Form.css";

const AppointmentsDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem("token");

        if (authToken) {
            fetchAppointments(authToken);
        }
    }, []);

    const fetchAppointments = async (authToken) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/get-appointments`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

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
    
    const handleSeeAll = () => {
        setShowAll(true);
    };

    const filteredAppointments = showAll
        ? appointments.filter((appt) => new Date(appt.start_time) > new Date())
        : appointments.filter((appt) => {
            const appointmentDate = new Date(appt.start_time);
            return appointmentDate.toDateString() === selectedDate.toDateString();
        });

    return (
        <div className="admin-page">
            <h1 className="main-title">Gestion des rendez-vous</h1>

            <div className="calendar-container">
                <h3>Choisir une date</h3>
                <div className="calendar-flex-container">
                    <Calendar
                        onChange={(date) => {
                            setSelectedDate(date);
                            setShowAll(false);
                        }}
                        value={selectedDate}
                    />
                </div>
            </div>
            <button className="submit-button" onClick={handleSeeAll}>Voir tous les futurs rendez-vous</button>
            <h2 className="main-title">{showAll ? "Tous les futurs rendez-vous" : `Rendez-vous du ${selectedDate.toLocaleDateString()}`}</h2>
            {filteredAppointments.length > 0 ? (
                filteredAppointments
                    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                    .map((appt) => (
                        <ReservationDetails key={appt.id} appointmentId={appt.id} />
                    ))
            ) : (
                <p className="centered-text">Aucun rendez-vous trouvé.</p>
            )}
        </div>
    );
};

export default AppointmentsDashboard;
