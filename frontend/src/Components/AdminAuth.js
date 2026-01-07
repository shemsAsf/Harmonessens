import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AdminAuth = ({ children }) => {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && isValidToken(token)) {
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem("token");
        }
    }, []);

    const isValidToken = (token) => {
        try {
            if (typeof token !== "string" || token.trim() === "") {
                return false;
            }
            const { exp } = jwtDecode(token);
            return exp > Math.floor(Date.now() / 1000);
        } catch (error) {
            console.error("Invalid token format:", error);
            return false;
        }
    };
    
    const handleLogin = async () => {
        try {
            const response = await fetch(`/api/admin/login`, {
                method: "POST",
                body: JSON.stringify({ password }),
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
    
            if (data.token && typeof data.token === "string") {
                localStorage.setItem("token", data.token);
                setIsAuthenticated(true);
            } else {
                alert("Invalid credentials or malformed response");
                console.error("Unexpected response:", data);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again.");
        }
    };
    

    if (!isAuthenticated) {
        return (
            <div className="main-div">
                <div className="form-div centered-form">
                    <h2 className="main-title">Connexion Admin</h2>
                    <br/>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br/>
                    <br/>
                    <button className="submit-button" onClick={handleLogin}>Se connecter</button>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminAuth;


