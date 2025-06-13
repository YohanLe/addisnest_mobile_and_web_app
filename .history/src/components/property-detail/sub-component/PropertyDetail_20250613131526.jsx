import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaymentModal from "../PaymentModal";
import "../../../assets/css/property-detail-enhanced.css";
import "../../../assets/css/about-place.css";
import AboutThisHome from "./AboutThisHome";
import SafetyTipsSection from "./SafetyTipsSection";
import MortgageCalculatorModern from "../../mortgage-calculator/MortgageCalculatorModern";
import {
    SvgArrowLeftIcon,
    SvgArrowRightIcon,
    SvgClockIcon as SvgClock,
    SvgClockIcon,
    SvgFavoriteFillIcon,
    SvgFavoriteIcon,
    SvgShareIcon,
    SvgLocationIcon,
    SvgPhoneIcon,
    SvgMailIcon,
    SvgThermom,
    SvgBulding,
    SvgBounder,
    SvgFinanceIcon,
    SvgCarParking,
} from "../../../assets/svg-files/SvgFiles.jsx";
import { formatDistanceToNow } from "date-fns";
import PhotoPopup from "../PhotoPopup";

// Format date function
const MakeFormat = (data) => {
    if (!data) return "Invalid date";

    const date = new Date(data?.createdAt || data);
    if (isNaN(date)) return "Invalid date";

    return formatDistanceToNow(date, { addSuffix: true });
};

// Main PropertyDetail component
const PropertyDetail = ({ PropertyDetails, similarProperties }) => {
    const formatFeatureName = (key) => {
        return key
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const featureIcons = {
        'parking-space': '🚗',
        'garage': '🏢',
        '24-7-security': '👮',
        'cctv-surveillance': '📹',
        'gym-fitness-center': '💪',
        'swimming-pool': '🏊',
    };

    const availableFeatures = PropertyDetails?.features && typeof PropertyDetails.features === 'object' ?
        Object.entries(PropertyDetails.features)
            .filter(([key, value]) => value === true || value === 'true' && key !== '_id')
        : [];
    const [activeTab, setActiveTab] = useState('details');
    const [activeImageIndex, setActiveImageIndex] = useState(null);
    const [selectedTourType, setSelectedTourType] = useState('in-person');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    // Create a default array if no similar properties are provided
    const nearbyProperties = similarProperties || [];
    
    // If PropertyDetails is empty or undefined, show a fallback message
    if (!PropertyDetails || Object.keys(PropertyDetails).length === 0) {
        return (
            <div className="property-not-found-container">
                <div className="container">
                    <div className="property-not-found">
                        <h2>Property Not Found</h2>
                        <p>The property you're looking for is not available or doesn't exist.</p>
                        <Link to="/property-list" className="back-to-list">
                            Browse Available Properties
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    // Format price with commas
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };
    
    // Handle image navigation
    const nextImage = () => {
        if (PropertyDetails?.media && PropertyDetails.media.length > 0) {
            setActiveImageIndex((prev) => (prev + 1) % PropertyDetails.media.length);
        }
    };
    
    const prevImage = () => {
        if (PropertyDetails?.media && PropertyDetails.media.length > 0) {
            setActiveImageIndex((prev) => (prev - 1 + PropertyDetails.media.length) % PropertyDetails.media.length);
        }
    };

    return (
        <div className="property-detail-page">
            {/* Property Images Grid (Redfin Style) */}
            <div className="property-images-container">
                {PropertyDetails?.media && PropertyDetails.media.length > 0 ? (
                    <div className="property-photos-grid">
                        {/* Main large photo - left side */}
                        <div className="main-photo">
                            <div 
                                className="property-image main-property-image"
                                onClick={() => {
                                    setActiveImageIndex(0);
                                }}
                                style={{ height: '100%', cursor: 'pointer', position: 'relative' }}
                            >
                                {/* Main image - this span contains the actual property image as background */}
                                <span style={{ 
                                    backgroundImage: `url(${PropertyDetails.media[0]})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '100%',
                                    display: 'block',
                                    borderRadius: '4px',
                                    position: 'relative',
                                    zIndex: 1
                                }}></span>
                                
                                {/* Navigation controls - we keep these visible */}
                                <div className="image-navigation">
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }} className="nav-btn prev-btn">
                                        <SvgArrowLeftIcon />
                                    </button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }} className="nav-btn next-btn">
                                        <SvgArrowRightIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Thumbnail grid - 2x2 layout - right side */}
                        <div className="thumbnail-grid">
                            {PropertyDetails.media.slice(1, 5).map((img, index) => (
                                <div 
                                    key={index} 
                                    className="property-image"
                                    onClick={() => {
                                        setActiveImageIndex(index + 1);
                                    }}
                                    style={{ 
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span style={{ 
                                        backgroundImage: `url(${img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        height: '175px',
                                        display: 'block'
                                    }}></span>
                                    
                                    {/* Show "View all photos" overlay on the last thumbnail if there are more than 5 images */}
                                    {index === 3 && PropertyDetails.media.length > 5 && (
                                        <div 
                                            className="view-all-overlay"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveImageIndex(0);
                                            }}
                                        >
                                            +{PropertyDetails.media.length - 5} more photos
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {/* Fill in empty spots in the grid if there aren't enough images */}
                            {Array.from({ length: Math.max(0, 4 - Math.min(4, PropertyDetails.media.length - 1)) }).map((_, index) => (
                                <div 
                                    key={`empty-${index}`} 
                                    className="property-image"
                                    style={{ 
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <span></span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Photo count badge in bottom right of the grid */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: '15px', 
                            right: '15px', 
                            zIndex: 2
                        }}>
                            <button 
                                onClick={() => setActiveImageIndex(0)}
                                style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: 'white',
                                    border: 'none',
                                    borderRadius: '30px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>📷</span> {PropertyDetails.media.length} photos
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="no-image-placeholder">No images available</div>
                )}
            </div>

            {/* Fullscreen Image Popup */}
            {activeImageIndex !== null && PropertyDetails?.media?.length > 0 && (
                <div 
                    className="fullscreen-image-popup"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* Header with close button */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
                        zIndex: 2
                    }}>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>
                            Property Images
                        </div>
                        <button
                            onClick={() => setActiveImageIndex(null)}
                            style={{
                                background: 'transparent',
                                color: 'white',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px'
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Main image container */}
                    <div style={{
                        width: '100%',
                        height: 'calc(100% - 120px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <img
                            src={PropertyDetails.media[activeImageIndex]}
                            alt={`Property Image ${activeImageIndex + 1}`}
                            style={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'contain'
                            }}
                        />

                        {/* Navigation arrows */}
                        <button
                            onClick={prevImage}
                            style={{
                                position: 'absolute',
                                left: '20px',
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '24px'
                            }}
                        >
                            <SvgArrowLeftIcon />
                        </button>

                        <button
                            onClick={nextImage}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '24px'
                            }}
                        >
                            <SvgArrowRightIcon />
                        </button>
                    </div>

                    {/* Image counter */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '0',
                        right: '0',
                        textAlign: 'center',
                        color: 'white',
                        padding: '10px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
                    }}>
                        {activeImageIndex + 1} OF {PropertyDetails.media.length}
                    </div>
                </div>
            )}

            {/* About this House section and Safety Tips Box side by side */}
            <div className="container" style={{ marginTop: '30px', marginBottom: '30px' }}>
                <div className="row" style={{ display: 'flex', flexDirection: 'row' }}>
                    {/* About this House section - Left Column */}
                    <div className="col-md-7" style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Property Information Box */}
                        <div className="property-info-box" style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            padding: '20px',
                            height: '100%'
                        }}>
                            <div>
                                {/* Title inside the box */}
                                <h2 style={{ 
                                    fontSize: '22px',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    color: '#333'
                                }}>
                                    {PropertyDetails?.title || 'About this House'}
                                </h2>
                                
                                {/* Status indicator */}
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{ 
                                        width: '12px', 
                                        height: '12px', 
                                        backgroundColor: '#4CAF50', 
                                        borderRadius: '50%',
                                        marginRight: '8px'
                                    }}></div>
                                    <span style={{ 
                                        color: '#4D4D4D', 
                                        fontWeight: '600', 
                                        fontSize: '15px'
                                    }}>
                                        {PropertyDetails?.property_for || PropertyDetails?.offeringType || 'FOR SALE'} - <span style={{ 
                                            textDecoration: 'underline', 
                                            textUnderlineOffset: '4px', 
                                            textDecorationStyle: 'dotted' 
                                        }}>ACTIVE</span>
                                    </span>
                                </div>
                                
                                {/* Address */}
                                <h1 style={{ 
                                    margin: '0 0 15px 0',
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#333'
                                }}>
                                    {PropertyDetails?.property_address || 
                                     PropertyDetails?.address || 
                                     (PropertyDetails?.city && PropertyDetails?.regional_state ? 
                                      `${PropertyDetails.city}, ${PropertyDetails.regional_state}, ${PropertyDetails.country || 'Ethiopia'}` : 
                                      '1207 SW 182nd Ave, Beaverton, OR 97003')}
                                </h1>
                                
                                {/* Price */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h2 style={{ 
                                        margin: '0 0 5px 0',
                                        fontSize: '28px',
                                        fontWeight: '700',
                                        color: '#333'
                                    }}>
                                        {formatPrice(PropertyDetails?.total_price || PropertyDetails?.price || 450000)}
                                    </h2>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#666' }}>
                                        Est. {PropertyDetails?.currency || ''}{Math.round(((PropertyDetails?.total_price || PropertyDetails?.price) * 0.005) || 2798)}/mo
                                    </p>
                                </div>
                                
                                {/* Property Description */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ 
                                        fontSize: '15px', 
                                        lineHeight: '1.6', 
                                        color: '#555',
                                        margin: '0'
                                    }}>
                                        {PropertyDetails?.description || 'Welcome to this beautiful family home in the heart of a peaceful neighborhood. This spacious property offers modern living with traditional charm, making it perfect for families looking for comfort and convenience.'}
                                    </p>
                                </div>
                                
                                {/* Property Specifications Grid */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(136px, 1fr))',
                                    gap: '16px',
                                    fontSize: '14px'
                                }}>
                                    {/* Property Type */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>🏠</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Property Type</div>
                                            <div>{
                                              typeof PropertyDetails?.property_type === 'object' && PropertyDetails?.property_type?.label ? 
                                                PropertyDetails?.property_type?.label : 
                                                (typeof PropertyDetails?.propertyType === 'object' && PropertyDetails?.propertyType?.label ? 
                                                  PropertyDetails?.propertyType?.label : 
                                                  (typeof PropertyDetails?.property_type === 'string' ? 
                                                    PropertyDetails?.property_type : 
                                                    (typeof PropertyDetails?.propertyType === 'string' ? 
                                                      PropertyDetails?.propertyType : 'House')))
                                            }</div>
                                        </div>
                                    </div>
                                    
                                    {/* Bedrooms */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>🛏️</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Bedrooms</div>
                                            <div>{PropertyDetails?.number_of_bedrooms || PropertyDetails?.bedrooms || PropertyDetails?.specifications?.bedrooms || 3}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Bathrooms */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>🚿</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Bathrooms</div>
                                            <div>{PropertyDetails?.number_of_bathrooms || PropertyDetails?.bathrooms || PropertyDetails?.specifications?.bathrooms || 2}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Living Area */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>📏</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Living Area</div>
                                            <div>{PropertyDetails?.property_size || PropertyDetails?.size || PropertyDetails?.specifications?.area?.size || 250} sqm</div>
                                        </div>
                                    </div>
                                    
                                    {/* Lot Size */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>🌄</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Lot Size</div>
                                            <div>{PropertyDetails?.lotSize || PropertyDetails?.specifications?.lotSize || 0} sqm</div>
                                        </div>
                                    </div>
                                    
                                    {/* Year Built */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>🏗️</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Year Built</div>
                                            <div>{PropertyDetails?.yearBuilt || 'Not specified'}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Days on Addisnest */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>📅</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Days on Addisnest</div>
                                            <div>1 days</div>
                                        </div>
                                    </div>
                                    
                                    {/* Price per SQ.M */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>💰</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Price per SQ.M</div>
                                            <div>ETB 20,000</div>
                                        </div>
                                    </div>
                                    
                                    {/* Parking */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>🚗</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Parking</div>
                                            <div>{PropertyDetails?.parking || 'Not available'}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Heating & AC */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>🌡️</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Furnishing</div>
                                            <div>{PropertyDetails?.furnishing || 'Not specified'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Property Features Section */}
                                <div style={{ marginTop: '25px' }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '15px',
                                        color: '#333'
                                    }}>
                                        Property Features
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '12px',
                                        fontSize: '14px'
                                    }}>
                                        {availableFeatures.length > 0 ? (
                                            availableFeatures.map(([key]) => (
                                                <div key={key} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    backgroundColor: '#f8f9fa',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px'
                                                }}>
                                                    <span style={{ marginRight: '8px' }}>
                                                        {featureIcons[key.replace(/_/g, '-')] || '✅'}
                                                    </span>
                                                    <span>
                                                        {formatFeatureName(key)}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{
                                                gridColumn: '1 / -1',
                                                padding: '12px',
                                                color: '#666',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '6px',
                                                textAlign: 'center'
                                            }}>
                                                No specific features listed for this property.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Safety Tips Box - Right Column */}
                    <div className="col-md-5" style={{ display: 'flex' }}>
                        <div className="action-safety-box" style={{
                            padding: '24px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            height: '100%'
                        }}>
                            {/* Action Buttons */}
                            <div style={{ marginBottom: '15px', width: '100%' }}>
                                <button 
                                    onClick={() => setShowPaymentModal(true)}
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        padding: '14px 20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                >
                                    <span style={{ fontSize: '18px', marginRight: '8px' }}>💰</span> Buy This Property
                                </button>
                            </div>
                            
                            <div style={{ marginBottom: '15px', width: '100%' }}>
                                <button 
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        padding: '14px 20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#43A047'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                                >
                                    <span style={{ fontSize: '18px', marginRight: '8px' }}>📝</span> Post Ad Like This
                                </button>
                            </div>
                            
                            <div style={{ marginBottom: '15px', width: '100%' }}>
                                <button 
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#2196F3',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '500',
                                        fontSize: '16px',
                                        padding: '12px 20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E88E5'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
                                >
                                    <span style={{ fontSize: '18px', marginRight: '8px' }}>🔒</span> Mark Unavailable
                                </button>
                            </div>
                            
                            <div style={{ marginBottom: '20px', width: '100%' }}>
                                <button 
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#F44336',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '500',
                                        fontSize: '16px',
                                        padding: '12px 20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 10px rgba(244, 67, 54, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E53935'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
                                >
                                    <span style={{ fontSize: '18px', marginRight: '8px' }}>🚩</span> Report Abuse
                                </button>
                            </div>
                            
                            {/* Safety Tips */}
                            <div style={{
                                marginTop: '20px',
                                borderTop: '1px solid #eee',
                                paddingTop: '20px'
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    marginBottom: '15px',
                                    color: '#333'
                                }}>Safety Tips</h3>
                                
                                <ul style={{
                                    listStyleType: 'disc',
                                    paddingLeft: '20px',
                                    marginBottom: '0'
                                }}>
                                    <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                        It's safer not to pay ahead for inspections
                                    </li>
                                    <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                        Ask friends or somebody you trust to accompany you for viewing.
                                    </li>
                                    <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                        Look around the apartment to ensure it meets your expectations
                                    </li>
                                    <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                        Don't pay before hand if they won't let you move in immediately
                                    </li>
                                    <li style={{ marginBottom: '0', fontSize: '14px', color: '#555' }}>
                                        Verify that the account details belong to the right property owner before initiating payment
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Find Your Perfect Time to Visit - Tour Scheduling */}
            <div className="container" style={{ marginBottom: '40px' }}>
                <div className="row">
                    <div className="col-md-7">
                        <div style={{
                            padding: '24px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                        }}>
                            <h2 style={{
                                fontSize: '22px',
                                fontWeight: '600',
                                marginBottom: '20px',
                                color: '#333'
                            }}>Find Your Perfect Time to Visit</h2>
                            
                            {/* Tour Type Selection */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ 
                                    fontSize: '15px', 
                                    fontWeight: '500', 
                                    marginBottom: '10px',
                                    color: '#555'
                                }}>Select tour type:</p>
                                
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '10px'
                                }}>
                                    <div 
                                        onClick={() => setSelectedTourType('in-person')}
                                        style={{
                                            flex: '1',
                                            border: `2px solid ${selectedTourType === 'in-person' ? '#4a6cf7' : '#e0e0e0'}`,
                                            borderRadius: '8px',
                                            padding: '15px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: selectedTourType === 'in-person' ? '#f0f5ff' : 'white',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '24px', marginBottom: '5px', display: 'block' }}>🏠</span>
                                        <span style={{ 
                                            fontWeight: selectedTourType === 'in-person' ? '600' : '500',
                                            color: selectedTourType === 'in-person' ? '#4a6cf7' : '#555'
                                        }}>
                                            In-Person Tour
                                        </span>
                                    </div>
                                    
                                    <div 
                                        onClick={() => setSelectedTourType('video')}
                                        style={{
                                            flex: '1',
                                            border: `2px solid ${selectedTourType === 'video' ? '#4a6cf7' : '#e0e0e0'}`,
                                            borderRadius: '8px',
                                            padding: '15px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: selectedTourType === 'video' ? '#f0f5ff' : 'white',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '24px', marginBottom: '5px', display: 'block' }}>📱</span>
                                        <span style={{ 
                                            fontWeight: selectedTourType === 'video' ? '600' : '500',
                                            color: selectedTourType === 'video' ? '#4a6cf7' : '#555'
                                        }}>
                                            Video Tour
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Date Selection - Enhanced */}
                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ 
                                    fontSize: '16px', 
                                    fontWeight: '600', 
                                    marginBottom: '12px',
                                    color: '#333'
                                }}>Select Date</p>
                                
                                <div style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}>
                                    <span style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        marginRight: '12px',
                                        color: '#4a6cf7',
                                        fontSize: '20px'
                                    }}>📅</span>
                                    
                                    <input 
                                        type="date" 
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: '15px',
                                            fontWeight: '500',
                                            color: '#333',
                                            width: '100%',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </div>
                            
                            {/* Time Selection - Enhanced with visible dropdown */}
                            <div style={{ marginBottom: '30px' }}>
                                <p style={{ 
                                    fontSize: '16px', 
                                    fontWeight: '600', 
                                    marginBottom: '12px',
                                    color: '#333'
                                }}>Select Time</p>
                                
                                <div style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    backgroundColor: 'white',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            border: '2px solid #4a6cf7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '12px',
                                            backgroundColor: '#f0f5ff'
                                        }}>
                                            <span style={{ 
                                                color: '#4a6cf7', 
                                                fontSize: '16px', 
                                                fontWeight: 'bold' 
                                            }}>✓</span>
                                        </div>
                                        
                                        <div style={{ flex: 1 }}>
                                            <div style={{ 
                                                fontSize: '15px', 
                                                fontWeight: '600',
                                                color: '#333'
                                            }}>
                                                Set time
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: '#f0f5ff',
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                        border: '1px solid #e6effd',
                                        height: '50px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            width: '100%'
                                        }}>
                                            <span style={{ 
                                                color: '#2196F3', 
                                                fontSize: '20px' 
                                            }}>⏱️</span>
                                            
                                            <select style={{
                                                width: '100%',
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                                color: '#2196F3',
                                                backgroundColor: 'transparent',
                                                cursor: 'pointer',
                                                WebkitAppearance: 'none',
                                                MozAppearance: 'none',
                                                appearance: 'none',
                                                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232196F3\'%3e%3cpath d=\'M7 10l5 5 5-5z\'/%3e%3c/svg%3e")',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 12px center',
                                                backgroundSize: '20px',
                                                paddingRight: '32px'
                                            }}>
                                                <option value="">Select a time</option>
                                                <option value="09:00">9:00 AM</option>
                                                <option value="09:30">9:30 AM</option>
                                                <option value="10:00">10:00 AM</option>
                                                <option value="10:30">10:30 AM</option>
                                                <option value="11:00">11:00 AM</option>
                                                <option value="11:30">11:30 AM</option>
                                                <option value="12:00">12:00 PM</option>
                                                <option value="12:30">12:30 PM</option>
                                                <option value="13:00">1:00 PM</option>
                                                <option value="13:30">1:30 PM</option>
                                                <option value="14:00">2:00 PM</option>
                                                <option value="14:30">2:30 PM</option>
                                                <option value="15:00">3:00 PM</option>
                                                <option value="15:30">3:30 PM</option>
                                                <option value="16:00">4:00 PM</option>
                                                <option value="16:30">4:30 PM</option>
                                                <option value="17:00">5:00 PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Schedule Button */}
                            <button style={{
                                width: '100%',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '16px',
                                padding: '14px 20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#43A047'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                            >
                                <span style={{ fontSize: '18px', marginRight: '8px' }}>📅</span> Schedule Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Details Section removed as requested */}

            {/* Safety Tips Section - Removed as it's now part of the right sidebar */}

            {/* Mortgage Calculator Section */}
            <div className="container" style={{ marginBottom: '50px' }}>
                <div className="row">
                    <div className="col-md-12">
                        <div style={{
                            padding: '30px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                marginBottom: '25px',
                                color: '#333',
                                textAlign: 'center'
                            }}>Calculate Your Monthly Mortgage Payments</h2>
                            
                            <MortgageCalculatorModern 
                                currency=""
                                initialValues={{
                                    homePrice: PropertyDetails?.price || 15200000,
                                    downPayment: PropertyDetails?.price ? PropertyDetails.price * 0.2 : 100000,
                                    loanTerm: 20,
                                    interestRate: 10,
                                    propertyTax: PropertyDetails?.price ? PropertyDetails.price * 0.015 : 19000,
                                    homeInsurance: 2533.33,
                                    pmi: 250,
                                    hoa: 500
                                }}
                                showAdditionalCosts={true}
                                showAmortizationSchedule={true}
                                customConfig={{
                                    interestRateMax: 100,
                                    downPaymentPercentMax: 100,
                                    homePriceEditable: true
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Featured Properties Section */}
            <div className="container" style={{ marginBottom: '50px' }}>
                <div className="featured-properties">
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ 
                            fontSize: '32px', 
                            fontWeight: '700', 
                            color: '#2d3748',
                            marginBottom: '15px'
                        }}>
                            Featured Properties
                        </h2>
                        <p style={{ 
                            fontSize: '18px', 
                            color: '#4a5568',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            Discover your dream home among our featured listings
                        </p>
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'nowrap', 
                        gap: '30px',
                        justifyContent: 'space-between',
                        overflowX: 'auto',
                        paddingBottom: '10px'
                    }}>
                        {/* Property Card 1 */}
                        <div style={{ 
                            width: '100%', 
                            maxWidth: '380px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                            backgroundColor: 'white'
                        }}>
                            {/* Property Image Container */}
                            <div style={{ 
                                position: 'relative',
                                height: '250px',
                                overflow: 'hidden'
                            }}>
                                {/* Status Tag */}
                                <div style={{ 
                                    position: 'absolute',
                                    top: '15px',
                                    left: '15px',
                                    backgroundColor: '#059669',
                                    color: 'white',
                                    padding: '5px 12px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    zIndex: '2'
                                }}>
                                    OPEN SAT, 1PM TO 3PM
                                </div>
                                
                                {/* Year Tag */}
                                <div style={{ 
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    zIndex: '2'
                                }}>
                                    2023
                                </div>
                                
                                {/* Location Icon */}
                                <div style={{ 
                                    position: 'absolute',
                                    bottom: '15px',
                                    left: '15px',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    color: '#333',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: '2',
                                    cursor: 'pointer'
                                }}>
                                    <SvgLocationIcon />
                                </div>
                                
                                {/* Property Image */}
                                <img 
                                    src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=765&auto=format&fit=crop" 
                                    alt="Property" 
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease',
                                        ":hover": {
                                            transform: 'scale(1.05)'
                                        }
                                    }} 
                                />
                            </div>
                            
                            {/* Property Info */}
                            <div style={{ padding: '20px' }}>
                                {/* Price and Actions */}
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <h3 style={{ 
                                        fontSize: '24px', 
                                        fontWeight: '700',
                                        color: '#1a202c',
                                        margin: '0'
                                    }}>
                                        $2,583,929
                                    </h3>
                                    <div style={{ 
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <button style={{ 
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '50%',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'white',
                                            cursor: 'pointer'
                                        }}>
                                            <SvgShareIcon />
                                        </button>
                                        <button style={{ 
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '50%',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'white',
                                            cursor: 'pointer'
                                        }}>
                                            <SvgFavoriteIcon />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Address */}
                                <p style={{ 
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#4a5568',
                                    marginBottom: '15px'
                                }}>
                                    3135 SE Van Waters St, Milwaukie, OR 97222
                                </p>
                                
                                {/* Specs */}
                                <div style={{ 
                                    display: 'flex',
                                    gap: '15px',
                                    marginBottom: '15px'
                                }}>
                                    <div style={{ 
                                        fontSize: '14px',
                                        color: '#4a5568'
                                    }}>
                                        7 beds
                                    </div>
                                    <div style={{ 
                                        fontSize: '14px',
                                        color: '#4a5568'
                                    }}>
                                        4 baths
                                    </div>
                                    <div style={{ 
                                        fontSize: '14px',
                                        color: '#4a5568'
                                    }}>
                                        9361 sq ft
                                    </div>
                                </div>
                                
                                {/* Agent */}
                                <div style={{ 
                                    fontSize: '14px',
                                    color: '#718096',
                                    borderTop: '1px solid #e2e8f0',
                                    paddingTop: '15px'
                                }}>
                                    Redfin
                                </div>
                            </div>
                        </div>
                        
                        {/* Property Card 2 */}
                        <div style={{ 
                            width: '100%', 
                            maxWidth: '380px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                            backgroundColor: 'white'
                        }}>
                            {/* Property Image Container */}
                            <div style={{ 
                                position: 'relative',
                                height: '250px',
                                overflow: 'hidden'
                            }}>
                                {/* Status Tag */}
                                <div style={{ 
                                    position: 'absolute',
                                    top: '15px',
                                    left: '15px',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    padding: '5px 12px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    zIndex: '2'
                                }}>
                                    NEW 1 HR AGO
                                </div>
                                
                                {/* Year Tag */}
                                <div style={{ 
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    zIndex: '2'
                                }}>
                                    2023
                                </div>
                                
                                {/* Location Icon */}
                                <div style={{ 
                                    position: 'absolute',
                                    bottom: '15px',
                                    left: '15px',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    color: '#333',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: '2',
                                    cursor: 'pointer'
                                }}>
                                    <SvgLocationIcon />
                                </div>
                                
                                {/* Property Image */}
                                <img 
                                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=753&auto=format&fit=crop" 
                                    alt="Property" 
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease',
                                        ":hover": {
                                            transform: 'scale(1.05)'
                                        }
                                    }} 
                                />
                            </div>
                            
                            {/* Property Info */}
                            <div style={{ padding: '20px' }}>
                                {/* Price and Actions */}
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <h3 style={{ 
                                        fontSize: '24px', 
                                        fontWeight: '700',
                                        color: '#1a202c',
                                        margin: '0'
                                    }}>
                                        $510,128
                                    </h3>
                                    <div style={{ 
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <button style={{ 
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '50%',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'white',
                                            cursor: 'pointer'
                                        }}>
                                            <SvgShareIcon />
                                        </button>
                                        <button style={{ 
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '50%',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'white',
                                            cursor: 'pointer'
                                        }}>
                                            <SvgFavoriteIcon />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Address */}
                                <p style={{ 
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#4a5568',
                                    marginBottom: '15px'
                                }}>
                                    8626 SE 28th Pl, Milwaukie, OR 97222
                                </p>
                                
                                {/* Specs */}
                                <div style={{ 
                                    display: 'flex',
                                    gap: '15px',
                                    marginBottom: '15px'
                                }}>
                                    <div style={{ 
                                        fontSize: '14px',
                                        color: '#4a5568'
                                    }}>
                                        2 beds
                                    </div>
                                    <div style={{ 
                                        fontSize: '14px',
                                        color: '#4a5568'
                                    }}>
                                        2 baths
                                    </div>
                                    <div style={{ 
                                        fontSize: '14px',
                                        color: '#4a5568'
                                    }}>
                                        1002 sq ft
                                    </div>
                                </div>
                                
                                {/* Agent */}
                                <div style={{ 
                                    fontSize: '14px',
                                    color: '#718096',
                                    borderTop: '1px solid #e2e8f0',
                                    paddingTop: '15px'
                                }}>
                                    Tedi McKnight-Heikes • Engel & Volkers West Portland
                                </div>
                            </div>
                        </div>
                        
                        {/* Property Card 3 */}
                        <div style={{ 
                            width: '100%', 
                            maxWidth: '380px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                            backgroundColor: 'white'
                        }}>
                            {/* Property Image Container */}
                            <div style={{ 
                                position: 'relative',
                                height: '250px',
                                overflow: 'hidden'
                            }}>
                                {/* Status Tag */}
                                <div style={{ 
                                    position: 'absolute',
                                    top: '15px',
                                    left: '15px',
                                    backgroundColor: '#e53e3e',
                                    color: 'white',
                                    padding: '5px 12px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    zIndex: '2'
                                }}>
                                    LISTED BY REDFIN 29 MINS AGO
                                </div>
                                
                                {/* Year Tag */}
                                <div style={{ 
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    zIndex: '2'
                                }}>
                                    2023
                                </div>
                                
                                {/* Location Icon */}
                                <div style={{ 
                                    position: 'absolute',
                                    bottom: '15px',
                                    left: '15px',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    color: '#333',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: '2',
                                    cursor: 'pointer'
                                }}>
                                    <SvgLocationIcon />
                                </div>
                                
                                {/* Property Image */}
                                <img 
                                    src="https://images.unsplash.com/photo-1628133287860-41dd6e266500?q=80&w=870&auto=format&fit=crop" 
                                    alt="Property" 
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease',
                                        ":hover": {
                                            transform: 'scale(1.05)'
                                        }
                                    }} 
                                />
                            </div>
                            
                            {/* Property Info */}
                            <div style={{ padding: '20px' }}>
                                {/* Price and Actions */}
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <h3 style={{ 
                                        fontSize: '24px', 
                                        fontWeight: '700',
                                        color: '#1a202c',
                                        margin: '0'
                                    }}>
                                        $624,502
                                    </h3>
                                    <div style={{ 
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <button style={{ 
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '50%',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'white',
                                            cursor: 'pointer'
                                        }}>
                                            <SvgShareIcon />
                                        </button>
                                        <button style={{ 
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '50%',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'white',
                                            cursor: 'pointer'
                                        }}>
                                            <SvgFavoriteIcon />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Address */}
                                <p style={{ 
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#4a5568',
                                    marginBottom: '15px'
                                }}>
                                    10410 SE 55th Ave, Milwaukie, OR 97222
                                </p>
                                
                                {/* Specs */}
                                <div style={{ 
                                    display: 'flex',
                                    gap: '15px',
                                    marginBottom: '15px'
                                }}>
                                    <div style={{ 
                                        fontSize: '14px',
                                        color: '#4a5568'
                                    }}>
                                        3 beds
                                    </div>
                                    <div style={{ 
                                        fontSize: '14px',
                                        color: '#4a5568'
                                    }}>
                                        2 baths
                                    </div>
                                    <div style={{ 
                                        fontSize: '14px',
                                        color: '#4a5568'
                                    }}>
                                        2261 sq ft
                                    </div>
                                </div>
                                
                                {/* Agent */}
                                <div style={{ 
                                    fontSize: '14px',
                                    color: '#718096',
                                    borderTop: '1px solid #e2e8f0',
                                    paddingTop: '15px'
                                }}>
                                    Kristen Downer • The Agency Portland
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Payment Modal */}
            {showPaymentModal && (
              <PaymentModal 
                isOpen={showPaymentModal} 
                onClose={() => setShowPaymentModal(false)}
                property={PropertyDetails}
              />
            )}
        </div>
    );
};

// Separate component for Nearby Properties slider
const NearbyPropertiesSlider = ({ HomeList }) => {
    const navigate = useNavigate();
    const GotoDetail = (item) => {
        navigate(`/property-detail/${item?.id}`);
        // Use setTimeout to ensure navigation completes before scrolling
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    };
    
    return (
        <div className="container">
            <div className="property-slider">
                <div className="property-slider-title">
                    <div className="property-slider-header">
                        <h4>Other Nearby Homes to Explore</h4>
                        <p>
                            Nearby listings with similar features and price range in the area.
                        </p>
                    </div>
                    <div className="all-view">
                        <Link to="/property-list">View all</Link>
                    </div>
                </div>
                <div className="property-list">
                    <div className="property-slider-aroow">
                        <span>
                            <SvgArrowLeftIcon />
                        </span>
                        <span>
                            <SvgArrowRightIcon />
                        </span>
                    </div>
                    <ul>
                        {HomeList && HomeList.slice(0, 3).map((item, index) => (
                            <li key={index}>
                                <a 
                                    onClick={() => { GotoDetail(item) }} 
                                    className="property-card"
                                >
                                    <div className="card">
                                        <div
                                            className="property-img"
                                            style={{ backgroundImage: `url(${item?.media?.[0]?.filePath || item?.media?.[0]})` }}
                                        >
                                            <span>{item.status || 'For Sale'}</span>
                                            <p>
                                                <em>
                                                    <SvgClockIcon />
                                                </em>
                                                {MakeFormat(item?.createdAt)}
                                            </p>
                                        </div>
                                        <div className="property-detail">
                                            <div className="property-title">
                                                <h3>{new Intl.NumberFormat('en-US').format(item.price || 0)}</h3>
                                                <div className="property-share-icon">
                                                <span>
                                                    <SvgShareIcon />
                                                </span>
                                                <span>
                                                    {item?.is_wishlist === true ? <SvgFavoriteFillIcon /> : <SvgFavoriteIcon />}
                                                </span>
                                                </div>
                                            </div>
                                            <div className="property-area">
                                                <span>{item?.beds || 0} bed</span>
                                                <span>
                                                    <em></em>
                                                    {item?.bathroom_information?.length || item?.specifications?.bathrooms || 0} bath
                                                </span>
                                                <span>
                                                    <em></em>
                                                    {item?.property_size || item?.specifications?.area?.size || 0} sq.m
                                                </span>
                                            </div>
                                            <div className="property-location">
                                                <SvgLocationIcon />
                                                <span>{item?.address || item?.location?.address || 'Address not available'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}

                        {/* If no nearby properties are available, show placeholder */}
                        {(!HomeList || HomeList.length === 0) && (
                            <div className="no-properties-message">
                                <p>No nearby properties found at this time.</p>
                                <Link to="/property-list" className="view-all-link">Browse all properties</Link>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Safety tips section for the property
const SafetyTips = () => {
    return (
        <div className="safety-tips-container">
            <SafetyTipsSection />
        </div>
    );
};

export default PropertyDetail;
