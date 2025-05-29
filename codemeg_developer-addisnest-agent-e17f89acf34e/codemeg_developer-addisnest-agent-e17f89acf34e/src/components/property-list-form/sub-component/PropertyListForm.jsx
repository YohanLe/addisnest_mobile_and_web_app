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
import "../../../assets/css/property-form.css";

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
    const [uploadingStates, setUploadingStates] = useState({});
    const [error, setError] = useState({ isValid: false });
    const [MediaPaths, setMediaPaths] = useState([]);
    const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState({});
    const [networkStatus, setNetworkStatus] = useState('online');

    const [inps, setInps] = useState({
        regional_state: '',
        city: '',
        country: 'Ethiopia',
        property_address: '',
        total_price: '',
        description: '',
        property_size: '',
        number_of_bathrooms: '',
        number_of_bedrooms: '',
    });
    
    // Network status monitoring
    useEffect(() => {
        const updateNetworkStatus = () => {
            setNetworkStatus(navigator.onLine ? 'online' : 'offline');
        };

        // Initial check
        updateNetworkStatus();

        // Listen for online/offline events
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        // Cleanup
        return () => {
            window.removeEventListener('online', updateNetworkStatus);
            window.removeEventListener('offline', updateNetworkStatus);
        };
    }, []);

    // Show network status notification
    useEffect(() => {
        if (networkStatus === 'offline') {
            toast.warning('You are offline. Image uploads will fail until your connection is restored.', {
                autoClose: false,
                closeButton: true
            });
        }
    }, [networkStatus]);

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
            // Show preview immediately
            const newImages = [...images];
            newImages[index] = URL.createObjectURL(file);
            setImages(newImages);
            
            // Set uploading state
            setUploadingStates(prev => ({ ...prev, [index]: true }));
            
            await ImagesUpload(file, index);
        }
    };

    const ImagesUpload = async (file, index, retryCount = 0) => {
        const maxRetries = 2;
        
        try {
            setLoading(true);
            
            // File validation
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            
            if (file.size > maxSize) {
                toast.error("File size too large! Please select an image under 5MB.");
                setUploadingStates(prev => ({ ...prev, [index]: false }));
                setLoading(false);
                return;
            }
            
            if (!allowedTypes.includes(file.type)) {
                toast.error("Invalid file type! Please select a JPG, PNG, or WEBP image.");
                setUploadingStates(prev => ({ ...prev, [index]: false }));
                setLoading(false);
                return;
            }
            
            // Check if user is authenticated
            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error("Authentication required. Please login again.");
                setUploadingStates(prev => ({ ...prev, [index]: false }));
                setLoading(false);
                return;
            }
            
            let formData = new FormData();
            formData.append("mediaFiles", file);
            
            // Add retry indicator if this is a retry attempt
            if (retryCount > 0) {
                toast.info(`Retrying upload... (Attempt ${retryCount + 1}/${maxRetries + 1})`);
            }
            
            const response = await Api.postFileWithtoken("media/public", formData);
            const { files, status, message } = response;
            setLoading(false);
            
            // Clear uploading state
            setUploadingStates(prev => ({ ...prev, [index]: false }));
            
            if (files && Array.isArray(files)) {
                setMediaPaths((prevPaths) => [...prevPaths, ...files]);
            } else if (files) {
                setMediaPaths((prevPaths) => [...prevPaths, files]);
            }
            toast.success(message || "Image uploaded successfully!");
        } catch (error) {
            setLoading(false);
            setUploadingStates(prev => ({ ...prev, [index]: false }));
            
            console.error('Upload Error Details:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
                code: error?.code,
                retryCount
            });
            
            // Check if we should retry
            const shouldRetry = retryCount < maxRetries && (
                error?.code === 'NETWORK_ERROR' || 
                error?.message === 'Network Error' ||
                error?.message?.includes('Network connection failed') ||
                error?.response?.status >= 500 ||
                error?.response?.status === 408 // Request timeout
            );
            
            if (shouldRetry) {
                toast.warning(`Upload failed. Retrying in ${2 * (retryCount + 1)} seconds...`);
                setTimeout(() => {
                    ImagesUpload(file, index, retryCount + 1);
                }, 2000 * (retryCount + 1)); // Progressive delay
                return;
            }
            
            // Final failure - remove preview and show error
            setImages(prev => {
                const newImages = [...prev];
                newImages[index] = null;
                return newImages;
            });
            
            // Enhanced error messaging
            let errorMessage = "Image upload failed!";
            
            if (error?.message?.includes('Authentication failed')) {
                errorMessage = "Authentication failed. Please refresh the page and login again.";
            } else if (error?.message?.includes('Network connection failed')) {
                errorMessage = "Network connection failed. Please check your internet connection and try again.";
            } else if (error?.message?.includes('File too large')) {
                errorMessage = "File is too large. Please select a smaller image (under 5MB).";
            } else if (error?.response?.status === 413) {
                errorMessage = "File is too large for the server. Please select a smaller image.";
            } else if (error?.response?.status === 415) {
                errorMessage = "Unsupported file format. Please select a JPG, PNG, or WEBP image.";
            } else if (error?.response?.status >= 500) {
                errorMessage = "Server error. Please try again in a few moments.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
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
            
            // Scroll to the first error field
            if (!PropertyType) {
                document.querySelector('.react-select')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!inps?.property_address) {
                document.querySelector('textarea[name="property_address"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (!inps?.total_price) {
                document.querySelector('input[name="total_price"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (MediaPaths.length < 2) {
                document.querySelector('.image-upload-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            return;
        }
    
        // FIXED: Extract values from Select objects properly
        let data = {
            regional_state: inps?.regional_state,
            city: inps?.city,
            country: inps?.country,
            property_address: inps?.property_address,
            number_of_bathrooms: inps.number_of_bathrooms,
            number_of_bedrooms: inps.number_of_bedrooms,
            property_size: inps?.property_size,
            total_price: inps?.total_price,
            description: inps?.description,
            property_for: activeTab,
            property_type: PropertyType?.value || PropertyType,
            condition: ConditionType?.value || ConditionType,
            furnishing: FurnishingType?.value || FurnishingType,
            media_paths: MediaPaths,
            amenities: selectedAmenities
        };

        console.log('🚀 Submitting property data:', data);
        console.log('📋 Property for:', activeTab);
        console.log('🏠 Property type:', PropertyType?.value || PropertyType);
    
        navigate('/choose-promotion', { state: { AllData: data } });
    };

    return (
        <section className="common-section property-form-section">
            <div className="container">
                <div className="property-heading-form">
                    <h3>Property Listing Form</h3>
                    <div className="form-progress-indicator">
                        <div className="progress-item">
                            <span className={`step-circle ${PropertyType ? 'completed' : 'pending'}`}>1</span>
                            <span className="step-label">Property Type</span>
                        </div>
                        <div className="progress-item">
                            <span className={`step-circle ${inps.property_address ? 'completed' : 'pending'}`}>2</span>
                            <span className="step-label">Location</span>
                        </div>
                        <div className="progress-item">
                            <span className={`step-circle ${inps.total_price ? 'completed' : 'pending'}`}>3</span>
                            <span className="step-label">Price</span>
                        </div>
                        <div className="progress-item">
                            <span className={`step-circle ${MediaPaths.length >= 2 ? 'completed' : 'pending'}`}>4</span>
                            <span className="step-label">Images</span>
                        </div>
                    </div>
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
                                        <label>Number of Bedrooms</label>
                                        <input
                                            type="number"
                                            placeholder="3"
                                            name="number_of_bedrooms"
                                            onChange={onInpChanged}
                                            value={inps?.number_of_bedrooms}
                                        />
                                    </div>
                                </div>
                                <div className="form-col-50">
                                    {/* Empty column for spacing */}
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
                                                            {uploadingStates[actualIndex] && (
                                                                <div className="upload-overlay">
                                                                    <div className="upload-spinner">⏳</div>
                                                                </div>
                                                            )}
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
                            >
                                {amenitiesExpanded ? '↑ Hide Amenities' : '↓ Show Amenities'}
                            </button>
                        </div>
                        
                        {amenitiesExpanded && (
                            <div className="step-content">
                                <div className="amenities-grid">
                                    <div className="amenity-item">
                                        <input
                                            type="checkbox"
                                            id="parking"
                                            checked={selectedAmenities.parking || false}
                                            onChange={() => handleAmenityChange('parking')}
                                        />
                                        <label htmlFor="parking">🚗 Parking</label>
                                    </div>
                                    
                                    <div className="amenity-item">
                                        <input
                                            type="checkbox"
                                            id="swimming_pool"
                                            checked={selectedAmenities.swimming_pool || false}
                                            onChange={() => handleAmenityChange('swimming_pool')}
                                        />
                                        <label htmlFor="swimming_pool">🏊 Swimming Pool</label>
                                    </div>
                                    
                                    <div className="amenity-item">
                                        <input
                                            type="checkbox"
                                            id="gym"
                                            checked={selectedAmenities.gym || false}
                                            onChange={() => handleAmenityChange('gym')}
                                        />
                                        <label htmlFor="gym">💪 Gym</label>
                                    </div>
                                    
                                    <div className="amenity-item">
                                        <input
                                            type="checkbox"
                                            id="garden"
                                            checked={selectedAmenities.garden || false}
                                            onChange={() => handleAmenityChange('garden')}
                                        />
                                        <label htmlFor="garden">🌳 Garden</label>
                                    </div>
                                    
                                    <div className="amenity-item">
                                        <input
                                            type="checkbox"
                                            id="balcony"
                                            checked={selectedAmenities.balcony || false}
                                            onChange={() => handleAmenityChange('balcony')}
                                        />
                                        <label htmlFor="balcony">🏠 Balcony</label>
                                    </div>
                                    
                                    <div className="amenity-item">
                                        <input
                                            type="checkbox"
                                            id="security"
                                            checked={selectedAmenities.security || false}
                                            onChange={() => handleAmenityChange('security')}
                                        />
                                        <label htmlFor="security">🔒 24/7 Security</label>
                                    </div>
                                    
                                    <div className="amenity-item">
                                        <input
                                            type="checkbox"
                                            id="elevator"
                                            checked={selectedAmenities.elevator || false}
                                            onChange={() => handleAmenityChange('elevator')}
                                        />
                                        <label htmlFor="elevator">🏢 Elevator</label>
                                    </div>
                                    
                                    <div className="amenity-item">
                                        <input
                                            type="checkbox"
                                            id="internet"
                                            checked={selectedAmenities.internet || false}
                                            onChange={() => handleAmenityChange('internet')}
                                        />
                                        <label htmlFor="internet">📶 Internet/WiFi</label>
                                    </div>
                                    
                                    <div className="amenity-item">
                                        <input
                                            type="checkbox"
                                            id="ac"
                                            checked={selectedAmenities.ac || false}
                                            onChange={() => handleAmenityChange('ac')}
                                        />
                                        <label htmlFor="ac">❄️ Air Conditioning</label>
                                    </div>
                                    
                                    <div className="amenity-item">
                                        <input
                                            type="checkbox"
                                            id="laundry"
                                            checked={selectedAmenities.laundry || false}
                                            onChange={() => handleAmenityChange('laundry')}
                                        />
                                        <label htmlFor="laundry">👕 Laundry</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <div className="action-buttons">
                            <Link to="/dashboard" className="btn-cancel">
                                Cancel
                            </Link>
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={NextPage}
                                disabled={Loading}
                            >
                                {Loading ? (
                                    <span className="loading-spinner">⏳ Processing...</span>
                                ) : (
                                    <span>
                                        Continue to Promotion
                                        <SvgLongArrowIcon />
                                    </span>
                                )}
                            </button>
                        </div>
                        
                        <div className="form-summary">
                            <div className="summary-item">
                                <span className="summary-label">Property Type:</span>
                                <span className="summary-value">{PropertyType?.label || 'Not selected'}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Price:</span>
                                <span className="summary-value">
                                    {inps.total_price ? `ETB ${inps.total_price}${activeTab === 'rent' ? '/month' : ''}` : 'Not set'}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Images:</span>
                                <span className="summary-value">{MediaPaths.length} uploaded</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Network Status Indicator */}
                {networkStatus === 'offline' && (
                    <div className="network-status-banner offline">
                        <span className="status-icon">📡</span>
                        <span>You are currently offline. Some features may not work properly.</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PropertyListForm;
