import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import '../styles/Register.css';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Register = () => {
    const { register } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: "", mobile: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMobileChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric chars here
        if (value.startsWith("91")) {
            value = value.slice(2); // Remove extra 91 if user types manually put
        }
        if (value.length > 10) {
            value = value.slice(0, 10); // Limit to 10 digits only not exceded
        }
        setFormData({ ...formData, mobile: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(formData);

        if(res.error) {
            setMessage(res.error);
        } else {
            setMessage("Registration successful! Redirecting to Home...");
            setTimeout (() =>{
                navigate('/home');
            }, 1000);
        }
        // setMessage(res.error ? res.error : "Registration successful !! Please Login.");
    };

    return (
        <div className="outer-container">
            <div className="register-container">
                <h1 className="name-brand">pApAk!dUK@n</h1>
                <p><h3 className="reg-desc"> Groceries delivered in 10 minutes...</h3></p>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="E_Mail" onChange={handleChange} required />
                    <div className="mobile-input-container">
                        <span className="prefix">+91 </span>
                        <input
                            type="text"
                            name="mobile"
                            placeholder="0123456789"
                            value={formData.mobile}
                            onChange={handleMobileChange}
                            maxLength={10}
                            required
                        />
                    </div>

                    <input type="password" name="password" placeholder="Password" onChange={handleChange} maxLength={8} required />
                    <button type="submit">Register</button>
                </form>

                {message && <p>{message}</p>}

                {/* link to login page */}
                <p className="login-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>

            </div>
        </div>
    );
};

export default Register;