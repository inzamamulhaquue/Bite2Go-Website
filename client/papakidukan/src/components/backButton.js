import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/BackButton.css";

const BackButton = ({ defaultPath = "/profile" }) => {
    const navigate = useNavigate();

    return (
        <button
            className="back-button"
            onClick={() => navigate(defaultPath)}
        >
            ⬅️ Go Back
        </button>
    );
};

export default BackButton;
