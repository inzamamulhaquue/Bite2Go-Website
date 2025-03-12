import React from "react";
import { Link, Outlet } from "react-router-dom";

const Profile = () => {
    return (
        <div>
            <h1>Profile Page</h1>
            <nav>
                <ul>
                    <li><Link to="orders">Orders</Link></li>
                    <li><Link to="customer">Customer</Link></li>
                    <li><Link to="info">Info</Link></li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
};

export default Profile;
