import React, { useState, useEffect } from "react";
import "../styles/Addresses.css"; 
import {fetchWithTokenRefresh } from '../services/fetchWithTokenRefresh';

const Addresses = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddresses, setShowAddresses] = useState(false);
    const [newAddress, setNewAddress] = useState({
        houseName: "",
        street: "",
        locality: "",
        city: "",
        state: "",
        zip: ""
    });

    // Fetch addresses from the backend
    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem("token")?.trim();
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }
            const response = await fetchWithTokenRefresh("http://localhost:5005/api/addresses", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });


            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(`Failed to fetch addresses: ${data?.message || response.status}`);
            }
            const data = await response.json();
            console.log("Fetched Addresses:", data);
            setAddresses(data.addresses || []);
        } catch (err) {
            console.error("Error fetching addresses:", err);
            setError("Error fetching addresses.");
        }
    };

    // Load addresses when the component mounts
    useEffect(() => {
        fetchAddresses();
    }, []);

    // Handle form field changes
    const handleChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    // Submit new address to the database
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        console.log("Submitting new address:", newAddress);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                setIsSubmitting(false);
                return;
            }

            const response = await fetchWithTokenRefresh("http://localhost:5005/api/addresses", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                // credentials: "include",
                body: JSON.stringify(newAddress)
            });
            console.log("Response Status:", response.status);
            const data = await response.json();
            console.log("Response Data:", data);

            if (response.ok) {
                setNewAddress({ houseName: "", locality: "", street: "", city: "", state: "", zip: "" });
                setShowAddForm(false);
                fetchAddresses();
            } else {
                setError(`Failed to add address. ${data.message || response.statusText}`);
            }
        } catch (err) {
            console.error("Error adding address:", err);
            setError("Error adding address");
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="addresses-container">
            <h2>Saved Addresses</h2>
            {error && <p className="error">{error}</p>}

            <button onClick={() => setShowAddresses(!showAddresses)}>
                {showAddresses ? "Hide Addresses" : "Show Addresses"}
            </button>

            {showAddresses && (
            <ul className="address-list">
                {addresses.length === 0 ? (
                    <p>No addresses found.</p>
                ) : (
                    addresses.map((addr, index) => (
                        <li key={index}>
                            {addr.houseName}, {addr.street}, {addr.locality}, {addr.city}, {addr.state}, {addr.zip}
                        </li>
                    ))
                )}
            </ul>
        )}
        
            <button onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? "Cancel" : "Add New Address"}
            </button>

            {/* Add Address Form */}
            {showAddForm && (
                <form onSubmit={handleSubmit} className="add-address-form">
                    <input
                        type="text"
                        name="houseName"
                        placeholder="House Name"
                        value={newAddress.houseName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="street"
                        placeholder="Street"
                        value={newAddress.street}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="locality"
                        placeholder="Locality"
                        value={newAddress.locality}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="zip"
                        placeholder="Zip Code"
                        value={newAddress.zip}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Save Address</button>
                </form>
            )}
        </div>
    );
};

export default Addresses;
