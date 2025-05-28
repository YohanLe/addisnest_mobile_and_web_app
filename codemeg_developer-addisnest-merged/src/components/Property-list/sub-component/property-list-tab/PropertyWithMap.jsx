import React, { useEffect, useRef, useState } from "react";
import { Property1, Property2, Property3 } from "../../../../assets/images";
import {
    SvgClockIcon,
    SvgFavoriteFillIcon,
    SvgFavoriteIcon,
    SvgRightIcon,
    SvgShareIcon,
} from "../../../../assets/svg-files/SvgFiles";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../../../../Apis/Api";
import { useDispatch } from "react-redux";
import { GetHomeData } from "../../../../Redux-store/Slices/HomeSlice";
import { formatDistanceToNow } from "date-fns";

function squareMetersToAcres(squareMeters) {
    const acres = squareMeters * 0.00024710538146717;
    return acres.toFixed(4);
}

const MakeFormat = (data) => {
    if (!data) return "Invalid date";
    const date = new Date(data?.createdAt || data);
    if (isNaN(date)) return "Invalid date";
    return formatDistanceToNow(date, { addSuffix: true });
};

const PropertyWithMap = ({ HomeList }) => {
    const [hoveredProperty, setHoveredProperty] = useState(null);
    const mapRef = useRef(null); 
    const dispatch = useDispatch();
    useEffect(() => {
        if (hoveredProperty) {
            if (mapRef.current && hoveredProperty.location) { 
                const map = mapRef.current;
                const { lat, lng } = hoveredProperty.location;
                map.setCenter({ lat, lng });
            }
        }

    }, [hoveredProperty]);
   
    const getMapUrl = () => {
        if (hoveredProperty?.latitude && hoveredProperty?.longitude) {
            return `https://www.google.com/maps/embed/v1/place?key=AIzaSyAPLM9W6ndildrN7h60z771uZ2NpDNMITc&q=${hoveredProperty.latitude},${hoveredProperty.longitude}`;
        } else if(!hoveredProperty?.latitude && !hoveredProperty?.longitude){
            return `https://www.google.com/maps/embed/v1/place?key=AIzaSyAPLM9W6ndildrN7h60z771uZ2NpDNMITc&q=New+York`
        }
        return "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4367.72861979461!2d-117.88957903262664!3d34.08192671308415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1733726578959!5m2!1sen!2sin"; // Default map
    };
   
    const WishlistAddFun = async (item) => {
        let body = {
            propertyId: item?.id,
        };
        try {
            const response = await Api.postWithtoken("wishlist/add-remove", body);
            const { message } = response;
            toast.success(message);
            dispatch(GetHomeData({ type: '' }));
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <div className="property-main" ref={mapRef}>
            <div className="main-flex">
                <div className="inner-flex-55">
                    <div className="property-list">
                        <ul>
                            {HomeList && HomeList.map((item, index) => (
                                <li key={index}>
                                    <div 
                                        className="property-card"
                                        onMouseEnter={() => setHoveredProperty(item)}
                                        onMouseLeave={() => setHoveredProperty(null)}
                                    >
                                        <div className="card">
                                            <Link to={`/property-detail/${item?.id}`}
                                                className="property-img"
                                                style={{ backgroundImage: `url(${item?.media[0]?.filePath})` }}
                                            >
                                                <span>{item?.status}</span>
                                                <p>
                                                    <em><SvgClockIcon /></em>
                                                    {MakeFormat(item?.createdAt)} hrs ago
                                                </p>
                                            </Link>
                                            <div className="property-detail">
                                                <div className="property-title">
                                                    <h3>{item.price}</h3>
                                                    <div className="property-share-icon">
                                                        <span><SvgShareIcon /></span>
                                                        <span onClick={() => WishlistAddFun(item)}>
                                                            {item?.is_wishlist === true ? <SvgFavoriteFillIcon /> : <SvgFavoriteIcon />}
                                                        </span>
                                                    </div>
                                                    <div className="property-area">
                                                        <span>{item.beds} bed</span>
                                                        <span>
                                                            <em></em>
                                                            {item?.bathroom_information?.length} bath
                                                        </span>
                                                        <span>
                                                            <em></em>{item?.property_size} sqm.
                                                        </span>
                                                    </div>
                                                    <p>{item?.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="inner-flex-45">
                    <div className="property-area-map">
                        <iframe
                            src={getMapUrl()}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Property Location Map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyWithMap;
