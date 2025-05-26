import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { UserLocationadd } from "../../Redux-store/Slices/LocationaddSlice";

const LocationPopupMain = () => {
    const dispatch = useDispatch();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [locationData, setLocationData] = useState({});

    console.log("Location Data:", locationData);

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleStateChange = (e) => {
        setState(e.target.value);
    };

    const handleCountryChange = (e) => {
        setCountry(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newData = { 
            city, 
            state, 
            country, 
            lat: 0, // Default values since we're not using maps
            lng: 0, 
            address 
        };
        setLocationData(newData);
        dispatch(UserLocationadd(newData));
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Set a generic address based on coordinates
                    setAddress(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
                    setCity("Current Location");
                    setState("");
                    setCountry("");
                    
                    const newData = { 
                        city: "Current Location", 
                        state: "", 
                        country: "", 
                        lat, 
                        lng, 
                        address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}` 
                    };
                    setLocationData(newData);
                    dispatch(UserLocationadd(newData));
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Error getting your location. Please enter manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    return (
        <div className="crntloc-main">
            <div className="location-form-container" style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                <h3 style={{ marginBottom: "20px", color: "#333" }}>Enter Location Details</h3>
                
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Address:</label>
                        <input
                            type="text"
                            placeholder="Enter full address"
                            value={address}
                            onChange={handleAddressChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontSize: "14px"
                            }}
                        />
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>City:</label>
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={handleCityChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>State:</label>
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={handleStateChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Country:</label>
                            <input
                                type="text"
                                placeholder="Country"
                                value={country}
                                onChange={handleCountryChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <button 
                            type="submit"
                            style={{
                                flex: 1,
                                padding: "12px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "16px",
                                cursor: "pointer"
                            }}
                        >
                            Save Location
                        </button>
                        
                        <button 
                            type="button"
                            onClick={getCurrentLocation}
                            style={{
                                flex: 1,
                                padding: "12px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "16px",
                                cursor: "pointer"
                            }}
                        >
                            📍 Use Current Location
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocationPopupMain;
