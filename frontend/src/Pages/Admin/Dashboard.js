import React, { useState } from 'react';
import AppointmentsDashboard from './AppointmentsDashboard';
import AdminAuth from "../../Components/AdminAuth";
import "../../Style/Dashboard.css";
import AppointmentCards from '../Services/ServiceCards';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState("appointments");
    const navigate = useNavigate();

    const handleButtonClick = (component) => {
        setActiveComponent(component);
    };

    return (

        <AdminAuth>

            <div className="main-div">
                <div>
                    <br/>
                    <br/>
                    <div className="dashboard-buttons">
                        <button onClick={() => handleButtonClick('appointments')}>Rendez-vous</button>
                        <button onClick={() => handleButtonClick('services')}>Services</button>
                    </div>
                    <br/>
                    <div className="dashboard-content">
                        {activeComponent === 'appointments' && <AppointmentsDashboard />}
                        {activeComponent === 'services' && 
                        <div>
                            <button 
                                className="submit-button" 
                                onClick={() => navigate('/ServiceForm')}>
                                    <i class="fa-solid fa-plus"></i> Créer un service
                            </button>
                            <AppointmentCards isDashboard="true" />
                        </div>}
                    </div>
                </div>
            </div>
        </AdminAuth>
    );
};

export default Dashboard;
