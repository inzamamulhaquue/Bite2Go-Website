import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Order.css";
import BackButton from '../components/backButton';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ No token found. Please log in.");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5005/api/orders/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                console.log("✅ Order response data:", response.data);

                if (response.data.orders && response.data.orders.length > 0) {
                    setOrders(response.data.orders);
                } else {
                    console.error("❌ No orders found");
                }
            } catch (error) {
                console.error("❌ Error fetching orders:", error.response?.data || error);
            }
        };

        fetchOrders();
    }, [userId]);

    // Date formatting function
    const formatDate = (dateString) => {
        // console.log("📅 DateString value inside formatDate:", dateString);
        if (!dateString) return "N/A";
        const date = new Date(dateString);

        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })}`;
    };

    return (
        <div className="orders">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <>
                <p>No Orders Found</p>
                <BackButton defaultPath="/profile" />
                </>
                
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id} className="order-card">
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Order Date & Time:</strong> {formatDate(order.orderDate || order.createdAt)}</p>

                            <h4>User Details:</h4>
                            <p><strong>Name:</strong> {order.userDetails?.name || "N/A"}</p>
                            <p><strong>Phone:</strong> {order.userDetails?.phone || "N/A"}</p>

                            <p><strong>Total Price:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                            <p>
                                <strong>Total Discount (10% Off):</strong>
                                ₹{order.offerDiscount > 0 ? order.offerDiscount.toFixed(2) : "N/A"}
                            </p>
                            <p>
                                <strong>Delivery Fee:</strong>
                                ₹{order.deliveryFee > 0 ? order.deliveryFee : "FREE"}
                            </p>
                            <p>
                                <strong>To Pay:</strong> ₹
                                {order.toPay ? order.toPay.toFixed(2) : "N/A"}
                            </p>

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
                            <p>
                                <strong>Delivery Address:</strong>
                                {order.address?.street}, {order.address?.city}, {order.address?.state}
                            </p>
                            {/* <BackButton defaultPath="/profile" /> */}
                        </li>
                    ))}
                </ul>
            )}
            
            {orders.length > 0 && <BackButton defaultPath="/profile" />}
        </div>
    );
};

export default Orders;
