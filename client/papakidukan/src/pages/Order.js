import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Order.css";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:5005/api/orders/${userId}`);
                if (response.data.success) {
                    setOrders(response.data.orders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    return (
        <div className="orders">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>No Orders Found</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id} className="order-card">
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Total Price:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                            <h4>Items Ordered:</h4>
                            <ul>
                                {order.items.map((item) => (
                                    <li key={item._id}>
                                        <p><strong>Product:</strong> {item.name}</p>
                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                        <p><strong>Price:</strong> ₹{item.price}</p>
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Delivery Address:</strong> {order.address.street}, {order.address.city}, {order.address.state}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;
