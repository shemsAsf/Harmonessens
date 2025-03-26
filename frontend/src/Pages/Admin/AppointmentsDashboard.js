import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import ReservationDetails from "../../Components/ReservationDetail";
import "../../Style/Calendar.css";
import "../../Style/Form.css";

const AppointmentsDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

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

    const filteredAppointments = appointments
        .filter((appt) => {
            const appointmentDate = new Date(appt.start_time);
            return appointmentDate.toDateString() === selectedDate.toDateString();
        })
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    return (
        <div className="admin-page">
            <h1 className="main-title">Gestion des rendez-vous</h1>

            <div className="calendar-container">
                <h3>Choisir une date</h3>
                <div className="calendar-flex-container">
                    <Calendar
                        onChange={(date) => setSelectedDate(date)}
                        value={selectedDate}
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
    );
};

export default AppointmentsDashboard;
