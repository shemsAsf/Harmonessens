import { useState } from 'react';
import AdminAuth from "../../Components/AdminAuth";
import "../../Style/Dashboard.css";
import AppointmentCards from '../Services/ServiceCards';
import { useNavigate, useParams } from "react-router-dom";

const Dashboard = () => {
	const { page } = useParams();
    const [activeComponent, setActiveComponent] = useState(page ? page : "services");
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
                        <button onClick={() => handleButtonClick('services')}>Services</button>
                    </div>
                    <br/>
                    <div className="dashboard-content">
                        {activeComponent === 'services' && 
                        <div>
                            <button 
                                className="submit-button" 
                                onClick={() => navigate('/ServiceForm')}>
                                    <i className="fa-solid fa-plus"></i> Créer un service
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
