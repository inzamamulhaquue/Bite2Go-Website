import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderData } = location.state || {};

    useEffect (() => {
        console.log("Order Data:", orderData); //debug
        if (!orderData) {
            navigate("/cart");
        }
    }, [orderData, navigate]);
   

    const processPayment = async () => {
        try {
            setTimeout(async () => {
                // const response = await axios.post("http://localhost:5005/api/orders/create", {
                const response = await axios.post("https://bite2go-website.onrender.com/api/orders/create" , {
                    ...orderData,
                    paymentMethod: "Online",
                    paymentStatus: "Paid"
                });

                if (response.data.success) {
                    navigate("/order-success");
                } else {
                    alert("Payment failed. Try again.");
                }
            }, 2000);
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment processing failed.");
        }
    };

    if (!orderData) return null;

    return (
        <div>
            <h2>Processing Payment...</h2>
            <button onClick={processPayment}>Confirm Payment</button>
        </div>
    );
};

export default Payment;
