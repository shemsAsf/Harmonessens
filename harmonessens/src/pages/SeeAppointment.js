import React from "react";
import { useParams } from "react-router-dom";
import ReservationDetail from "../components/ReservationDetail";

const SeeAppointment = () => {
    const { appointmentId } = useParams();

    return (
        <div className="main-div">
            <h1 className="main-title">Ma réservation</h1>
            <div>
                <ReservationDetail appointmentId={appointmentId} />
            </div>
        </div>
    );
};

export default SeeAppointment;