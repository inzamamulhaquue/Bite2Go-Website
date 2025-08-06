import React, { useState, useEffect } from "react";
import "../styles/Addresses.css";
import { fetchWithTokenRefresh } from '../services/fetchWithTokenRefresh';
import BackButton from "../components/backButton";

const Addresses = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddresses, setShowAddresses] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);

    const baseUrl = process.env.REACT_APP_API_BASE_URL; //.env file 

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

            // const response = await fetchWithTokenRefresh("http://localhost:5005/api/addresses", {
            const response = await fetchWithTokenRefresh(`${baseUrl}/api/addresses`, {
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

    useEffect(() => {
        fetchAddresses();
    }, []);

    // Handle input field changes
    const handleChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    // Handle address submission (Add or Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        // const endpoint = editAddressId
        //     ? `http://localhost:5005/api/addresses/${editAddressId}`
        //     : "http://localhost:5005/api/addresses";

        const endpoint = editAddressId
            ? `${baseUrl}/api/addresses/${editAddressId}`
            : `${baseUrl}/api/addresses`;


        const method = editAddressId ? "PUT" : "POST";

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                setIsSubmitting(false);
                return;
            }

            const response = await fetchWithTokenRefresh(endpoint, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newAddress,
                    isDefault: true})
            });

            const data = await response.json();
            console.log("Response Data:", data);

            if (response.ok) {
                setNewAddress({ houseName: "", locality: "", street: "", city: "", state: "", zip: "" });
                setShowAddForm(false);
                setEditAddressId(null);
                fetchAddresses();
            } else {
                setError(`Failed to ${editAddressId ? "update" : "add"} address. ${data.message || response.statusText}`);
            }
        } catch (err) {
            console.error("Error adding/updating address:", err);
            setError("Error saving address");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Edit Button Click
    const handleEditClick = (address) => {
        setNewAddress(address);
        setEditAddressId(address._id);
        setShowAddForm(true);
    };

    // Handle Address Deletion
    const handleDelete = async () => {
        if (!editAddressId) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            // const response = await fetchWithTokenRefresh(`http://localhost:5005/api/addresses/${editAddressId}`, {
            const response = await fetchWithTokenRefresh(`${baseUrl}/api/addresses/${editAddressId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                setShowAddForm(false);
                setEditAddressId(null);
                fetchAddresses();
            } else {
                setError(`Failed to delete address. ${data.message || response.statusText}`);
            }
        } catch (err) {
            console.error("Error deleting address:", err);
            setError("Error deleting address");
        }
    };

    return (
        <div className="addresses-container">
            <h2>Saved Addresses</h2>
            {error && <p className="error">{error}</p>}

            <button onClick={() => setShowAddresses(!showAddresses)}
                className={`toggle-address-button ${showAddresses ? 'hide' : ''}`}
                >
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
                                <button onClick={() => handleEditClick(addr)} className="edit-button">Edit</button>
                            </li>
                        ))
                    )}
                </ul>
            )}

            <button onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? "Cancel" : "Add New Address"}
            </button>

            {/* Add or Edit Address Form */}
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
                    <button type="submit">
                        {editAddressId ? "Update Address" : "Save Address"}
                    </button>

                    {/* Show Delete Button When Editing */}
                    {editAddressId && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="delete-button"
                        >
                            Delete Address
                        </button>
                    )}
                </form>
            )}

            <BackButton defaultPath="/profile" />
        </div>
    );
};

export default Addresses;
