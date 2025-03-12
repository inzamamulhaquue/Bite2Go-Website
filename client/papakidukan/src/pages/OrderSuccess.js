import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderSuccess.css";

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="order-success">
            <h2>🎉 Order Placed Successfully!</h2>
            <p>Thank you for your order. Your delicious food will be delivered soon!</p>
            <button onClick={() => navigate("/orders")} className="view-orders-btn">
                View Orders
            </button>
            <button onClick={() => navigate("/")} className="back-home-btn">
                Go to Home
            </button>
        </div>
    );
};

export default OrderSuccess;
