import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { UserLocationadd } from "../../Redux-store/Slices/LocationaddSlice";


const mapContainerStyle = {
    width: "100%",
    height: "400px",
};

const defaultCenter = {
    lat: 52.555535427553,
    lng: 13.095297363165,
};

const LocationPopupMain = () => {
    const dispatch = useDispatch();
    const [center, setCenter] = useState(defaultCenter);
    const [markers, setMarkers] = useState([defaultCenter]);
    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);
    const [address, setAddress] = useState("");
    const [locationData, setLocationData] = useState({});

    const Locationadd = useSelector((state) => state.Locationadd.location);

    console.log("Location Data:", locationData);

    const fetchAddress = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAPLM9W6ndildrN7h60z771uZ2NpDNMITc`
            );
            const data = await response.json();
            if (data.results.length > 0) {
                const formattedAddress = data.results[0].formatted_address;
                setAddress(formattedAddress);

                let city = "", state = "", country = "";
                data.results[0].address_components.forEach((component) => {
                    if (component.types.includes("locality")) city = component.long_name;
                    if (component.types.includes("administrative_area_level_1")) state = component.long_name;
                    if (component.types.includes("country")) country = component.long_name;
                });

                let newData = { city, state, country, lat, lng, address: formattedAddress };
                setLocationData(newData);
                dispatch(UserLocationadd(newData));
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    const handleMapClick = async (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const newMarker = { lat, lng };
        setMarkers([...markers, newMarker]);
        setCenter(newMarker);
        await fetchAddress(lat, lng);
    };

    const handleMarkerDragEnd = async (index, e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const updatedMarkers = markers.map((marker, i) => (i === index ? { lat, lng } : marker));
        setMarkers(updatedMarkers);
        setCenter({ lat, lng });
        await fetchAddress(lat, lng);
    };


    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const lat = location.lat();
                const lng = location.lng();
                const newMarker = { lat, lng };
                setMarkers([...markers, newMarker]);
                setCenter(newMarker);
                fetchAddress(lat, lng);
            }
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const newMarker = { lat, lng };
                    setMarkers([...markers, newMarker]);
                    setCenter(newMarker);
                    await fetchAddress(lat, lng);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.log("Geolocation is not supported by your browser.");
        }
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyAPLM9W6ndildrN7h60z771uZ2NpDNMITc" libraries={["places"]}>
            <div className="crntloc-main">
                

                <div className="propertyfrm-map">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={15}
                        onLoad={(map) => (mapRef.current = map)}
                        onClick={handleMapClick}
                    >
                        {markers.map((marker, index) => (
                            <Marker
                                key={index}
                                position={{ lat: marker.lat, lng: marker.lng }}
                                draggable={true}
                                onDragEnd={(e) => handleMarkerDragEnd(index, e)}
                            />
                        ))}

                        <Autocomplete  className="locationsrch-map"
                            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                            onPlaceChanged={onPlaceChanged}
                        >
                            <input
                                type="search"
                                placeholder="Enter a location"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    left: 10,
                                    zIndex: 1000,
                                    padding: "5px",
                                    width: "300px",
                                }}
                            />
                        </Autocomplete>
                        <div className="crntloc-btn">
                            <button onClick={getCurrentLocation} className="crntloc-plain-btn">
                                📍 Use My Current Location
                            </button>
                        </div>
                    </GoogleMap>
                </div>
            </div>
        </LoadScript>
    );
};

export default LocationPopupMain;
