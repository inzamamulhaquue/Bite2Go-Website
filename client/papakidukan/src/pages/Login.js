import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import '../styles/Login.css';

const Login = () => {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5005/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save user data in context
            login(data.user);

            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };


    // +91 show always
    const handleMobileChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); //remove non numeric chars
        if (value.startsWith("91")) {
            value = value.slice(2); //remove extra 91 if user type manually
        }
        if (value.length > 10) {
            value = value.slice(0, 10); // user not given more than 10 digit here 
        }
        setMobile(value);
    }

    return (
        <div className="login-container">
            <h1 className="name-brand">pApAk!dUK@n</h1>
            <p> <h2 className="name-des">Groceries delivered in 10 minutes ... </h2></p>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="mobile-input-container">
                    <span className="prefix">+91 </span>
                    <input
                        type="text"
                        value={mobile}
                        onChange={handleMobileChange}
                        maxLength={10}
                        placeholder="1234567890"
                        required
                    />

                    </div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={8}
                        required
                    />
                    <button type="submit">Login</button>
            </form>
            <p>Not registered? <a href="/register">Register here</a></p>
        </div>
    );
};

export default Login;
