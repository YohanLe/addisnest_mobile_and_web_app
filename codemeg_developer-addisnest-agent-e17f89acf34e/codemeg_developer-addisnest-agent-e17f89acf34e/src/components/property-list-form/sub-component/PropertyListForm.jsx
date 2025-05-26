import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  SvgArrowRightIcon,
  SvgCheckBigIcon,
  SvgCheckIcon,
  SvgLongArrowIcon,
} from "../../../assets/svg/Svg";
import { Link, useNavigate } from "react-router-dom";
import { ValidatePropertyForm } from "../../../utils/Validation";
import Api from "../../../Apis/Api";

const PropertyTypeList = [
    { value: 'House', label: 'House' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' },
    { value: 'Villa', label: 'Villa' }
]

const HomeCondition = [
    { value: 'Newly Built', label: 'Newly Built' },
    { value: 'Old Built', label: 'Old Built' },
]

const HomeFurnishing = [
    { value: 'Furnished', label: 'Furnished' },
    { value: 'Fully Furnished', label: 'Fully Furnished' },
    { value: 'Semi Furnished', label: 'Semi Furnished' }
]

const ParkingList = [
    { value: 'Garage Parking', label: 'Garage Parking' },
    { value: 'Open Parking', label: 'Open Parking' },
    { value: 'No Parking', label: 'No Parking' },
    { value: 'Visitor Parking', label: 'Visitor Parking' }
]

const RegionalStateList = [
    { value: 'Addis Ababa City Administration', label: 'Addis Ababa City Administration' },
    { value: 'Afar Region', label: 'Afar Region' },
    { value: 'Amhara Region', label: 'Amhara Region' },
    { value: 'Benishangul-Gumuz Region', label: 'Benishangul-Gumuz Region' },
    { value: 'Dire Dawa City Administration', label: 'Dire Dawa City Administration' },
    { value: 'Gambela Region', label: 'Gambela Region' },
    { value: 'Harari Region', label: 'Harari Region' },
    { value: 'Oromia Region', label: 'Oromia Region' },
    { value: 'Sidama Region', label: 'Sidama Region' },
    { value: 'Somali Region', label: 'Somali Region' },
    { value: 'South Ethiopia Region', label: 'South Ethiopia Region' },
    { value: 'South West Ethiopia Peoples\' Region', label: 'South West Ethiopia Peoples\' Region' },
    { value: 'Tigray Region', label: 'Tigray Region' },
    { value: 'Central Ethiopia Region', label: 'Central Ethiopia Region' }
]

const PropertyListForm = () => {
    const navigate = useNavigate();
    const [PropertyType, setPropertyType] = useState(null);
    const [ConditionType, setConditionType] = useState(null);
    const [FurnishingType, setFurnishingType] = useState(null);
    const [RegionalStateType, setRegionalStateType] = useState(null);
    
    const [activeTab, setActiveTab] = useState("rent");
    const [images, setImages] = useState([]);
    const [slots, setSlots] = useState(3);
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const [MediaPaths, setMediaPaths] = useState([]);
    const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState({});

    const [inps, setInps] = useState({
        regional_state: '',
        city: '',
        country: 'Ethiopia',
        property_address: '',
        total_price: '',
        description: '',
        property_size: '',
        number_of_bathrooms: '',
    });
    
    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        })
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const handleFileChange = async (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const newImages = [...images];
            newImages[index] = URL.createObjectURL(file);
            setImages(newImages);
            await ImagesUpload(file);
        }
    };

    const ImagesUpload = async (file) => {
        try {
            setLoading(true);
            let formData = new FormData();
            formData.append("mediaFiles", file);
            const response = await Api.postWithtoken("media/public", formData);
            const { files, status, message } = response;
            setLoading(false);
            if (files && Array.isArray(files)) {
                setMediaPaths((prevPaths) => [...prevPaths, ...files]);
            } else if (files) {
                setMediaPaths((prevPaths) => [...prevPaths, files]);
            }
            toast.success(message);
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || "Image upload failed!");
        }
    };

    const addSlot = () => {
        setSlots(slots + 1);
    };
    
    const toggleAmenities = () => {
        setAmenitiesExpanded(!amenitiesExpanded);
    };
    
    const handleAmenityChange = (amenityId) => {
        setSelectedAmenities(prev => ({
            ...prev,
            [amenityId]: !prev[amenityId]
        }));
    };
    
    const handleChange = (e, type) => {
        if (type === 'Property') {
            setPropertyType(e);
        } else if (type === 'Condition') {
            setConditionType(e)
        } else if (type === 'Furnishing') {
            setFurnishingType(e)
        } else if (type === 'RegionalState') {
            setRegionalStateType(e);
            setInps((prevInputs) => ({ ...prevInputs, regional_state: e?.value || '' }));
        }
    };

    const NextPage = async () => {
        // Collect all validation errors
        const errors = [];
        
        // Validate required fields
        if (!PropertyType) {
            errors.push('Property Type is required - Please select the type of property you are offering');
        }
        
        if (!inps?.property_address || inps.property_address.trim() === '') {
            errors.push('Property Address is required - Please provide the complete address of your property');
        }
        
        if (!inps?.total_price || inps.total_price.trim() === '') {
            const priceLabel = activeTab === "rent" ? "Monthly Rent" : "Sale Price";
            errors.push(`${priceLabel} is required - Please enter the ${priceLabel.toLowerCase()} for your property`);
        }
        
        if (MediaPaths.length < 2) {
            if (MediaPaths.length === 0) {
                errors.push('Property Images are required - Please upload at least 2 high-quality photos of your property');
            } else {
                errors.push(`At least 2 property images are required - You have uploaded ${MediaPaths.length} image(s), please add ${2 - MediaPaths.length} more`);
            }
        }
        
        // If there are validation errors, display them
        if (errors.length > 0) {
            toast.error(
                <div>
                    <strong>Please complete the following required fields:</strong>
                    <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                        {errors.map((error, index) => (
                            <li key={index} style={{ marginBottom: '5px' }}>{error}</li>
                        ))}
                    </ul>
                </div>,
                {
                    autoClose: 8000,
                    hideProgressBar: false,
                }
            );
            return;
        }
    
        let data = {
            regional_state: inps?.regional_state,
            city: inps?.city,
            country: inps?.country,
            property_address: inps?.property_address,
            number_of_bathrooms: inps.number_of_bathrooms,
            property_size: inps?.property_size,
            total_price: inps?.total_price,
            description: inps?.description,
            property_for: activeTab,
            property_type: PropertyType,
            condition: ConditionType,
            furnishing: FurnishingType,
            media_paths: MediaPaths
        };
    
        navigate('/choose-promotion', { state: { AllData: data } });
    };

    return (
        <section className="common-section property-form-section">
            <div className="container">
                <div className="property-heading-form">
                    <h3>Property Listing Form</h3>
                </div>
                <div className="property-form-main">
                    
                    {/* Step 1: What are you offering? */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">1</span>
                            </div>
                            <h4>What are you offering?</h4>
                        </div>
                        
                        <div className="offering-options">
                            <div 
                                className={`offering-card ${activeTab === "sell" ? "selected" : ""}`}
                                onClick={() => setActiveTab("sell")}
                            >
                                <div className="card-icon">
                                    <div className="icon-circle green">🏠</div>
                                </div>
                                <h5>For Sale</h5>
                                <p>Sell your property</p>
                            </div>
                            
                            <div 
                                className={`offering-card ${activeTab === "rent" ? "selected" : ""}`}
                                onClick={() => setActiveTab("rent")}
                            >
                                <div className="card-icon">
                                    <div className="icon-circle blue">🔑</div>
                                </div>
                                <h5>For Rent</h5>
                                <p>Rent out your property</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Property Type & Price */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">2</span>
                            </div>
                            <h4>Property Type & Price</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="form-row">
                                <div className="form-col-50">
                                    <div className="form-group">
                                        <label>Property Type *</label>
                                        <div className="select-wrapper">
                                            <Select
                                                options={PropertyTypeList}
                                                placeholder="Select property type"
                                                value={PropertyType}
                                                onChange={(e) => handleChange(e, "Property")}
                                                className="react-select"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-col-50">
                                    <div className="form-group">
                                        <label>{activeTab === "rent" ? "Monthly Rent *" : "Sale Price *"}</label>
                                        <div className="price-input">
                                            <span className="currency-prefix">ETB</span>
                                            <input
                                                type="number"
                                                placeholder={activeTab === "rent" ? "3,500" : "500,000"}
                                                name="total_price"
                                                onChange={onInpChanged}
                                                value={inps?.total_price}
                                            />
                                            {activeTab === "rent" && <span className="period-suffix">/month</span>}
                                        </div>
                                        {error.errors?.total_price && <p className="error-msg">{error.errors?.total_price}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Property Location */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">3</span>
                            </div>
                            <h4>Property Location</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="form-group">
                                <label>Property Address *</label>
                                <textarea
                                    name="property_address"
                                    placeholder="Address, House number, Street"
                                    onChange={onInpChanged}
                                    value={inps?.property_address}
                                    rows="3"
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-col-50">
                                    <div className="form-group">
                                        <label>Regional State</label>
                                        <div className="select-wrapper">
                                            <Select
                                                options={RegionalStateList}
                                                placeholder="Select regional state"
                                                value={RegionalStateType}
                                                onChange={(e) => handleChange(e, "RegionalState")}
                                                className="react-select"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-col-50">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Your City"
                                            name="city"
                                            onChange={onInpChanged}
                                            value={inps?.city}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    type="text"
                                    placeholder="Enter Your Country"
                                    name="country"
                                    onChange={onInpChanged}
                                    value={inps?.country}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Property Details */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">4</span>
                            </div>
                            <h4>Property Details</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="form-group">
                                <label>Property Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Describe your property in detail..."
                                    onChange={onInpChanged}
                                    value={inps?.description}
                                    rows="4"
                                    className={error.errors?.description ? "error" : ""}
                                />
                                {error.errors?.description && <p className="error-msg">{error.errors?.description}</p>}
                            </div>
                            
                            <div className="form-row">
                                <div className="form-col-50">
                                    <div className="form-group">
                                        <label>Property Size (sqm)</label>
                                        <div className="input-with-unit">
                                            <input
                                                type="text"
                                                placeholder="150"
                                                name="property_size"
                                                onChange={onInpChanged}
                                                value={inps?.property_size}
                                            />
                                            <span className="unit">sqm</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-col-50">
                                    <div className="form-group">
                                        <label>Number of Bathrooms</label>
                                        <input
                                            type="number"
                                            placeholder="2"
                                            name="number_of_bathrooms"
                                            onChange={onInpChanged}
                                            value={inps?.number_of_bathrooms}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-col-50">
                                    <div className="form-group">
                                        <label>Property Condition</label>
                                        <div className="select-wrapper">
                                            <Select
                                                options={HomeCondition}
                                                placeholder="Select condition"
                                                value={ConditionType}
                                                onChange={(e) => handleChange(e, "Condition")}
                                                className="react-select"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-col-50">
                                    <div className="form-group">
                                        <label>Furnishing Status</label>
                                        <div className="select-wrapper">
                                            <Select
                                                options={HomeFurnishing}
                                                placeholder="Select furnishing type"
                                                value={FurnishingType}
                                                onChange={(e) => handleChange(e, "Furnishing")}
                                                className="react-select"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 5: Property Images */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">5</span>
                            </div>
                            <h4>Property Images *</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="image-upload-section">
                                <div className="upload-info">
                                    <h5>📸 Upload Property Photos</h5>
                                    <p>Add high-quality photos to showcase your property. At least 2 images are required. The first image will be the main photo.</p>
                                </div>
                                
                                <div className="main-upload-area">
                                    {images[0] ? (
                                        <div className="main-image-preview">
                                            <img src={images[0]} alt="Main property" />
                                            <div className="main-image-badge">Main Photo</div>
                                        </div>
                                    ) : (
                                        <label className="main-upload-dropzone">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 0)}
                                                style={{ display: "none" }}
                                            />
                                            <div className="dropzone-content">
                                                <div className="upload-icon-large">📷</div>
                                                <h6>Drop your main photo here</h6>
                                                <p>or click to browse</p>
                                                <span className="file-formats">JPG, PNG, WEBP (Max 5MB)</span>
                                            </div>
                                        </label>
                                    )}
                                </div>

                                <div className="additional-images">
                                    <div className="additional-images-header">
                                        <h6>Additional Photos</h6>
                                        <button 
                                            className="add-more-photos-btn" 
                                            onClick={addSlot} 
                                            type="button"
                                        >
                                            + Add More
                                        </button>
                                    </div>
                                    
                                    <div className="thumbnail-grid">
                                        {Array.from({ length: slots - 1 }).map((_, index) => {
                                            const actualIndex = index + 1;
                                            return (
                                                <div className="thumbnail-slot" key={actualIndex}>
                                                    {images[actualIndex] ? (
                                                        <div className="thumbnail-preview">
                                                            <img
                                                                src={images[actualIndex]}
                                                                alt={`Property ${actualIndex + 1}`}
                                                            />
                                                            <div className="image-number">{actualIndex + 1}</div>
                                                        </div>
                                                    ) : (
                                                        <label className="thumbnail-upload">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleFileChange(e, actualIndex)}
                                                                style={{ display: "none" }}
                                                            />
                                                            <div className="thumbnail-content">
                                                                <div className="plus-icon">+</div>
                                                                <span>Photo {actualIndex + 1}</span>
                                                            </div>
                                                        </label>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="upload-tips">
                                    <h6>📋 Photo Tips</h6>
                                    <ul>
                                        <li>Include exterior and interior shots</li>
                                        <li>Show key rooms: living room, kitchen, bedrooms</li>
                                        <li>Capture unique features and amenities</li>
                                        <li>Use good lighting for best results</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 6: Property Amenities */}
                    <div className="form-step-section">
                        <div className="step-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="step-indicator">
                                    <span className="step-number">6</span>
                                </div>
                                <h4>Property Amenities</h4>
                            </div>
                            <button 
                                type="button"
                                className="amenities-toggle-btn"
                                onClick={toggleAmenities}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                {amenitiesExpanded ? '− Collapse' : '+ Expand'}
                            </button>
                        </div>
                        
                        {amenitiesExpanded && (
                            <div className="step-content">
                            <div className="amenities-section">
                                <div className="amenity-category">
                                    <h5 className="category-title">🚗 Parking & Transportation</h5>
                                    <div className="amenity-grid">
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="garage_parking" 
                                                checked={selectedAmenities.garage_parking || false}
                                                onChange={() => handleAmenityChange('garage_parking')}
                                            />
                                            <label htmlFor="garage_parking">Garage Parking</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="covered_parking" 
                                                checked={selectedAmenities.covered_parking || false}
                                                onChange={() => handleAmenityChange('covered_parking')}
                                            />
                                            <label htmlFor="covered_parking">Covered Parking</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="street_parking" 
                                                checked={selectedAmenities.street_parking || false}
                                                onChange={() => handleAmenityChange('street_parking')}
                                            />
                                            <label htmlFor="street_parking">Street Parking</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="visitor_parking" 
                                                checked={selectedAmenities.visitor_parking || false}
                                                onChange={() => handleAmenityChange('visitor_parking')}
                                            />
                                            <label htmlFor="visitor_parking">Visitor Parking</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="amenity-category">
                                    <h5 className="category-title">🔒 Security & Safety</h5>
                                    <div className="amenity-grid">
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="security_guard" 
                                                checked={selectedAmenities.security_guard || false}
                                                onChange={() => handleAmenityChange('security_guard')}
                                            />
                                            <label htmlFor="security_guard">24/7 Security Guard</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="cctv_surveillance" 
                                                checked={selectedAmenities.cctv_surveillance || false}
                                                onChange={() => handleAmenityChange('cctv_surveillance')}
                                            />
                                            <label htmlFor="cctv_surveillance">CCTV Surveillance</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="gated_community" 
                                                checked={selectedAmenities.gated_community || false}
                                                onChange={() => handleAmenityChange('gated_community')}
                                            />
                                            <label htmlFor="gated_community">Gated Community</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="intercom_system" 
                                                checked={selectedAmenities.intercom_system || false}
                                                onChange={() => handleAmenityChange('intercom_system')}
                                            />
                                            <label htmlFor="intercom_system">Intercom System</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="alarm_system" 
                                                checked={selectedAmenities.alarm_system || false}
                                                onChange={() => handleAmenityChange('alarm_system')}
                                            />
                                            <label htmlFor="alarm_system">Alarm System</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="fire_safety" 
                                                checked={selectedAmenities.fire_safety || false}
                                                onChange={() => handleAmenityChange('fire_safety')}
                                            />
                                            <label htmlFor="fire_safety">Fire Safety Equipment</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="amenity-category">
                                    <h5 className="category-title">🏢 Building Facilities</h5>
                                    <div className="amenity-grid">
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="elevator" 
                                                checked={selectedAmenities.elevator || false}
                                                onChange={() => handleAmenityChange('elevator')}
                                            />
                                            <label htmlFor="elevator">Elevator</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="generator" 
                                                checked={selectedAmenities.generator || false}
                                                onChange={() => handleAmenityChange('generator')}
                                            />
                                            <label htmlFor="generator">Generator/Backup Power</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="water_tank" 
                                                checked={selectedAmenities.water_tank || false}
                                                onChange={() => handleAmenityChange('water_tank')}
                                            />
                                            <label htmlFor="water_tank">Water Storage Tank</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="concierge" 
                                                checked={selectedAmenities.concierge || false}
                                                onChange={() => handleAmenityChange('concierge')}
                                            />
                                            <label htmlFor="concierge">Concierge Service</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="maintenance" 
                                                checked={selectedAmenities.maintenance || false}
                                                onChange={() => handleAmenityChange('maintenance')}
                                            />
                                            <label htmlFor="maintenance">Maintenance Service</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="cleaning_service" 
                                                checked={selectedAmenities.cleaning_service || false}
                                                onChange={() => handleAmenityChange('cleaning_service')}
                                            />
                                            <label htmlFor="cleaning_service">Cleaning Service</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="amenity-category">
                                    <h5 className="category-title">🌿 Outdoor & Recreation</h5>
                                    <div className="amenity-grid">
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="garden" 
                                                checked={selectedAmenities.garden || false}
                                                onChange={() => handleAmenityChange('garden')}
                                            />
                                            <label htmlFor="garden">Garden/Landscaping</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="balcony" 
                                                checked={selectedAmenities.balcony || false}
                                                onChange={() => handleAmenityChange('balcony')}
                                            />
                                            <label htmlFor="balcony">Balcony/Terrace</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="swimming_pool" 
                                                checked={selectedAmenities.swimming_pool || false}
                                                onChange={() => handleAmenityChange('swimming_pool')}
                                            />
                                            <label htmlFor="swimming_pool">Swimming Pool</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="gym" 
                                                checked={selectedAmenities.gym || false}
                                                onChange={() => handleAmenityChange('gym')}
                                            />
                                            <label htmlFor="gym">Gym/Fitness Center</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="playground" 
                                                checked={selectedAmenities.playground || false}
                                                onChange={() => handleAmenityChange('playground')}
                                            />
                                            <label htmlFor="playground">Children's Playground</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="rooftop_access" 
                                                checked={selectedAmenities.rooftop_access || false}
                                                onChange={() => handleAmenityChange('rooftop_access')}
                                            />
                                            <label htmlFor="rooftop_access">Rooftop Access</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="amenity-category">
                                    <h5 className="category-title">💡 Utilities & Connectivity</h5>
                                    <div className="amenity-grid">
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="wifi_ready" 
                                                checked={selectedAmenities.wifi_ready || false}
                                                onChange={() => handleAmenityChange('wifi_ready')}
                                            />
                                            <label htmlFor="wifi_ready">WiFi Ready</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="cable_tv" 
                                                checked={selectedAmenities.cable_tv || false}
                                                onChange={() => handleAmenityChange('cable_tv')}
                                            />
                                            <label htmlFor="cable_tv">Cable TV Ready</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="air_conditioning" 
                                                checked={selectedAmenities.air_conditioning || false}
                                                onChange={() => handleAmenityChange('air_conditioning')}
                                            />
                                            <label htmlFor="air_conditioning">Air Conditioning</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="heating" 
                                                checked={selectedAmenities.heating || false}
                                                onChange={() => handleAmenityChange('heating')}
                                            />
                                            <label htmlFor="heating">Central Heating</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="solar_power" 
                                                checked={selectedAmenities.solar_power || false}
                                                onChange={() => handleAmenityChange('solar_power')}
                                            />
                                            <label htmlFor="solar_power">Solar Power</label>
                                        </div>
                                        <div className="amenity-item">
                                            <input 
                                                type="checkbox" 
                                                id="inverter" 
                                                checked={selectedAmenities.inverter || false}
                                                onChange={() => handleAmenityChange('inverter')}
                                            />
                                            <label htmlFor="inverter">Power Inverter</label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button 
                            className="submit-btn" 
                            onClick={NextPage}
                            type="button"
                        >
                            Next Page <SvgLongArrowIcon />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PropertyListForm;
