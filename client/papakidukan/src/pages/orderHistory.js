import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/orderService';
import OrderDetails from '../components/OrderDetails';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/backButton';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await getOrders(token);
                setOrders(response.orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="order-history">
             <BackButton defaultPath="/profile" />
            <h2>Your Orders</h2>
            {loading ? (
                <p>Loading orders...</p>
            ) : (
                orders.length > 0 ? (
                    orders.map(order => <OrderDetails key={order._id} order={order} />)
                ) : (
                    <p>No orders found.</p>
                )
            )}
            <BackButton defaultPath="/" />
        </div>
    );
};

export default OrderHistory;
