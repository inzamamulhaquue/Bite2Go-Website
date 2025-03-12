import React, { useContext, useEffect } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { LogOut } from 'lucide-react';
import "../styles/ProfileDashboard.css";

import { X } from 'lucide-react';
import Address from "./Address";
import Orders from "./Order";
import Customer from './Customer'
import Info from "./Info";

const ProfileDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleClose = () => {
        navigate("/");
    };



    return (
        <div className="profile-dashboard">
            <aside className="sidebar">
                <div className="profile-header">
                    {user && (
                        <>
                            <div className="profile-logo">{user.name.charAt(0)}</div>
                            <h3>{user.name}</h3>
                            <p>{user.mobile}</p>
                        </>
                    )}
                </div>
                <nav className="menu">
                    <Link to="info"><button>Info</button></Link>
                    <Link to="customer"><button>Customer</button></Link>
                    <Link to="orders"><button>Orders</button></Link>
                    <Link to="address"><button>Address</button></Link>

                    <button onClick={() => {
                        logout();
                        navigate("/login");
                    }}>
                        <LogOut className="icon" /> Logout
                    </button>


                    <button className="close-button" onClick={handleClose}>
                        <X className="icon" /> Close
                    </button>
                </nav>
            </aside>

            <main className="content">
                <Routes>
                    <Route path="info" element={<Info user={user} />} />
                    <Route path="customer" element={<Customer />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="address" element={<Address />} />
                </Routes>

            </main>
        </div>
    );
};

export default ProfileDashboard;
