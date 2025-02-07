import React, { useContext, useEffect, useState } from "react";
import "../styles/Home.css";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import LocationSearch from "../components/LocationSearch";
import { useNavigate } from "react-router-dom";
import { LogOut, LogIn, UserCircle } from 'lucide-react';
import AuthContext from "../context/AuthContext";

const Home = () => {
    const [userLocation, setUserLocation] = useState("");
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    // items rotate in search bar every few seconds in placeholder
    const items = ["Banana", "Potato", "Tomato", "Apples", "Milk", "Onions", "Rice", "Ghee", "Ice-Cream", "Coldrink",
        "Apple", "Daal", "Maggie", "Chipps", "Sugar", "VegeTables", "Fruits", "Soap", "Water", "Cake"];
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [fade, setFade] = useState(true); //slow motion change not direct switch

    useEffect(() => {
        // change the place holder every 2 second
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentItemIndex((PrvIndex) => (PrvIndex + 1) % items.length);
                setFade(true);
            }, 500);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home-container">
            <header className="top-nav">
                {/* refresh app name */}
                <h1 className="logo" onClick={() => window.location.reload()} style={{ cursor: "pointer" }}>
                    pApAk!dUK@n
                </h1>


                {/* Location Selection for delivery */}
                <LocationSearch onLocationSelect={setUserLocation} />

                {/* Search Bar always show*/}
                <div className="search-bar">
                    <FaSearch className="icon" />
                    <input
                        type="text"
                        placeholder={`Search for "${items[currentItemIndex]}"`}
                        className={fade ? "fade-in" : "fade-out"}
                        readOnly
                    />
                </div>

                {/* Login & Cart */}
                <div className="user-actions">
                    <a href="/login" className="login-link">
                        <FaUser className="icon" /> Login
                    </a>
                    <a href="/cart" className="cart-link">
                        <FaShoppingCart className="icon" /> Cart
                    </a>
                </div>
            </header>

                {/* Conditionally Render Login/Logout */}
                {/* <div className="user-actions">
                    {user ? (
                        <button onClick={logout} className="logout-link">
                            <LogOut className="icon" /> Logout
                        </button>
                    ) : (
                        <button onClick={() => navigate("/login")} className="login-link">
                            <LogIn className="icon" /> Login
                        </button>
                    )}
                    <a href="/cart" className="cart-link">
                        <FaShoppingCart className="icon" /> Cart
                    </a>
                </div>
            </header> */}

            {/* Hero Section */}
            <section className="hero">
                <h2>Fresh Groceries Delivered in 10 Minutes</h2>
                <p>Order from a wide range of groceries at amazing prices!</p>
                <button className="cta-button">Shop Now</button>
            </section>
        </div>
    );
};

export default Home;