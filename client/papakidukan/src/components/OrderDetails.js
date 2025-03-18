import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/OrderDetails.css";
import Info from '../pages/Info';

const OrderDetails = ({ order }) => {
    const navigate = useNavigate();

    if (!order) {
        return <p>Order details not available.</p>;
    }

    const customer = order.customer || {};

    // Calculate subtotal
    const itemPrice = order.items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
    const discount = order.discount || 0;
    const deliveryFee = order.deliveryFee || 0;
    const totalPayable = itemPrice - discount + deliveryFee;
    const toPay = totalPayable;

    return (
        <div className="order-details">
            {/* <button className="back-button" onClick={() => navigate(-1)}>⬅️ Back</button> */}

            <h2>Order Details</h2>

            {/* Order Information */}
            <div className="order-info">
                <p><strong>Order ID:</strong> {order._id || "N/A"}</p>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString() || "N/A"}</p>
                <p><strong>Status:</strong> {order.status || "N/A"}</p>
            </div>

            {/* Customer Information */}
            <div className="customer-info">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {customer.name || "N/A"}</p>
                <p><strong>Address:</strong> {customer.address || "N/A"}</p>
                <p><strong>Contact:</strong> {customer.contact || "N/A"}</p>
            </div>

            {/* Order Items */}
            <div className="order-items">
                <h3>Ordered Items</h3>
                <ul>
                    {order.items?.map((item, index) => (
                        <li key={index}>
                            {item.name} - {item.quantity} x ₹{item.price}
                        </li>
                    )) || <p>No items found.</p>}
                </ul>
            </div>

            {/* Pricing Summary with Improved Details */}
            <div className="pricing-summary">
                <h3>Payment Summary</h3>
                <p><strong>Item Price:</strong> ₹{order.totalAmount + (order.discount || 0) - (order.deliveryFee || 0)}</p>
                <p><strong>Offer:</strong> ₹{order.discount ? `-${order.discount.toFixed(2)}` : "₹0.00"}</p>
                <p><strong>Delivery Fee:</strong> ₹{order.deliveryFee || 0}</p>
                <hr />
                <p><strong>Total Payable:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                <p><strong>To Pay:</strong> ₹{order.totalAmount.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default OrderDetails;