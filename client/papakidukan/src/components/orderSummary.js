import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSummary = ({ cart, paymentMethod, totalAmount }) => {
    const navigate = useNavigate();
    return(
    <div className="order-summary">
        <h3>Order Summary</h3>
        <ul>
            {cart.items.map((item) => (
                <li key={item.productId._id}>
                    {item.productId.name} - {item.quantity} x ₹{item.productId.price}
                </li>
            ))}
        </ul>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
        <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
    </div>
);
};

export default OrderSummary;
