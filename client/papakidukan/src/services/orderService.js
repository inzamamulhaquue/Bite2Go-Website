import axios from 'axios';

const API_URL = 'http://localhost:5005/api/orders';

export const createOrder = async (orderData, token) => {
    const response = await axios.post(`${API_URL}/checkout`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getOrders = async (token) => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
