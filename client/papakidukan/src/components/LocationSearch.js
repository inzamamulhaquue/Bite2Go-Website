import React, { useState } from "react";
import "../styles/LocationSearch.css";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";

const LocationSearch = ({ onLocationSelect }) => {
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);

    const locationsData = {
        Pune: ["Pune Railway Station", "Shivaji Nagar", "Koregaon Park", "Hinjewadi", "Kothrud"],
        Mumbai: ["Dadar", "Bandra", "Andheri", "Nariman Point", "Colaba"],
        Delhi: ["Connaught Place", "Chandni Chowk", "Karol Bagh", "Saket", "Dwarka"]
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setLocation(value);

        const lowerCaseLocations = Object.keys(locationsData).reduce((acc, key) => {
            acc[key.toLowerCase()] = locationsData[key];
            return acc;
        }, {});

        if (lowerCaseLocations[value.toLowerCase()]) {
            setSuggestions(lowerCaseLocations[value.toLowerCase()]);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = (selectedLocation) => {
        setSelectedLocation(selectedLocation);
        setLocation(""); // Clear the search bar after selecting a location
        setSuggestions([]); // Clear suggestions after selection
        // setLocation(selectedLocation);
        setShowOverlay(true); // Show confirmation overlay
        setShowModal(false);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const currentLocation = `Lat: ${latitude}, Lng: ${longitude}`;
                    setSelectedLocation(currentLocation);
                    setLocation(currentLocation);
                    setShowOverlay(true);
                    setShowModal(false);
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    alert("Unable to fetch location. Please enter manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handleConfirm = () => {
        setShowOverlay(false);
        onLocationSelect(selectedLocation);
    };

    return (
        <div className="location-container">
            {/* Search Bar with Selected Location */}
            <div className="search-bar-container">
                <FaMapMarkerAlt className="location-icon" />
                <input
                    type="text"
                    value={selectedLocation ? selectedLocation : "Search for your location..."}
                    className="location-input"
                    onClick={() => setShowModal(true)}
                    readOnly
                />
            </div>

            {/* Location Selection Modal */}
            {showModal && (
                <div className="location-modal">
                    <div className="modal-content">
                        <FaTimes className="close-btn" onClick={() => setShowModal(false)} />
                        <h2>Select Your Location</h2>

                        {/* Search Bar */}
                        <input
                            type="text"
                            value={location}
                            onChange={handleChange}
                            placeholder="Search for your location..."
                            className="location-input"
                        />

                        {/* Location Suggestions */}
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSelect(suggestion)}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Use Current Location Button */}
                        <button className="current-location-btn" onClick={getCurrentLocation}>
                            Use Current Location
                        </button>
                    </div>
                </div>
            )}

            {/* Shadow Overlay with Confirm & Continue */}
            {showOverlay && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h2>Confirm Your Location</h2>
                        <p>{selectedLocation}</p>
                        <button className="confirm-btn" onClick={handleConfirm}>
                            Confirm & Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationSearch;
