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
        Delhi: ["Delhi", "Chandni Chowk", "Karol Bagh", "Saket", "Dwarka"]
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

const handleSelect = async (selectedLocation) => {
    setSelectedLocation(selectedLocation);
    setLocation(""); // Clear the search bar after selecting a location
    setSuggestions([]); // Clear suggestions after selection
    setShowOverlay(true); // Show confirmation overlay
    setShowModal(false);
    onLocationSelect(selectedLocation);
    await sendLocationToBackend(null, null, selectedLocation);
};

const getCurrentLocation = () => {
    if (navigator.geolocation) {
        console.log("Geolocation is supported!");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                console.log("Fetched Coordinates:", latitude, longitude);

                const address = await reverseGeocode(latitude, longitude);
                setSelectedLocation(address);
                setLocation(address);
                setShowOverlay(true);//
                setShowModal(false);//
                onLocationSelect(address);
                sendLocationToBackend(latitude, longitude, address);
            },
            (error) => {
                console.error("Error fetching location:", error);
                alert("Unable to fetch location. Please enter manually.");
                console.log("Error Code:", error.code); // Log error code for debugging
                console.log("Error Message:", error.message);
            }
        );
    } else {
        console.log("Geolocation is not supported.");
        alert("Geolocation is not supported by your browser.");
    }
};

// Function to convert coordinates to address
const reverseGeocode = async (lat, lng) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        return data.display_name || `Lat: ${lat}, Lng: ${lng}`;
    } catch (error) {
        console.error("Error with reverse geocoding:", error);
        return `Lat: ${lat}, Lng: ${lng}`;
    }
};


const sendLocationToBackend = async (latitude, longitude, address) => {
    try {
        // const response = await fetch('http://localhost:5005/api/location', {
        const response = await fetch('https://bite2go-website.onrender.com/api/location' , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude, address })
        });

        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error("Error sending location to backend:", error);
    }
};

const handleConfirm = () => {
    setShowOverlay(false);
    onLocationSelect(selectedLocation);
};

// Handle location search box clear after a location is confirmed
const handleLocationSearchClick = () => {
    if (location) {
        setLocation("");  // Reset the location after set
    }
};

return (
    <div className="location-container">
        {/* Search Bar with Selected Location */}
        <div className="search-bar-container" onClick={handleLocationSearchClick}>
            <FaMapMarkerAlt className="location-icon" />
            <input
                type="text"
                value={selectedLocation || "Search for your location..."}
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
