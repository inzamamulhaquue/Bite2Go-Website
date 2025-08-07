import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login'
import Home from './pages/Home';
import ProfileDashboard from './pages/ProfileDashboard';
import LocationSearch from './components/LocationSearch';
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProductsList from "./components/ProductsList";
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import CartItem from './components/CartItem';
import ReviewForm from './components/ReviewForm';
import Orders from "./pages/Order";
import OrderSuccess from "./pages/OrderSuccess";
import PaymentPage from './pages/PaymentPage';
import './styles/global.css';


// const App = () => {
const AppRoutes = () => {

    const { user } = useAuth();
    console.log("AuthContext User:", user);

    
    const handleLocationselect = (location) => {
        console.log("Selected Location: ", location);

    };

    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Routes>

                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile/*" element={<ProfileDashboard />} />
                        <Route path="/location" element={<LocationSearch onLocationSelect={handleLocationselect} />} />
                        <Route path="/products" element={<ProductsList />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/cart-item" element={<CartItem />} />
                        <Route path="/review/:productId" element={<ReviewForm />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        <Route path="/payment" element={<PaymentPage />} /> 
                    </Routes>

                </Router>
        const App = () => (
    <AuthProvider>
        <CartProvider>
            <AppRoutes />
        </CartProvider>
    </AuthProvider>
            
        //     </CartProvider>
        // </AuthProvider>
    );
// };

export default App;
