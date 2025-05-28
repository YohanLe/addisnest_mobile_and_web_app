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
    const [showPhotoTipsPopup, setShowPhotoTipsPopup] = useState(false);
    const [networkStatus, setNetworkStatus] = useState('online');

    const [inps, setInps] = useState({
        regional_state: '',
        city: '',
        country: 'Ethiopia',
        property_address: '',
        total_price: '0',
        description: '',
        property_size: '0',
        number_of_bathrooms: '0',
        number_of_bedrooms: '0',
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
    
    const togglePhotoTipsPopup = () => {
        setShowPhotoTipsPopup(!showPhotoTipsPopup);
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
            property_type: PropertyType,
            condition: ConditionType,
            furnishing: FurnishingType,
            media_paths: MediaPaths,
            amenities: selectedAmenities
        };
    
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
                    <div className="form-step-section" style={{ padding: '16px 0' }}>
                        <div className="step-header" style={{ marginBottom: '12px' }}>
                            <div className="step-indicator">
                                <span className="step-number">1</span>
                            </div>
                            <h5 style={{ margin: 0, fontSize: '16px' }}>What are you offering?</h5>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px', maxWidth: '400px' }}>
                            <div 
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: activeTab === "sell" ? '3px solid #28a745' : '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    backgroundColor: activeTab === "sell" ? '#e8f5e8' : '#fafafa',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    boxShadow: activeTab === "sell" ? '0 4px 12px rgba(40, 167, 69, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    transform: activeTab === "sell" ? 'translateY(-2px)' : 'none'
                                }}
                                onClick={() => setActiveTab("sell")}
                            >
                                <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏠</div>
                                <div style={{ 
                                    fontSize: '14px', 
                                    fontWeight: 'bold', 
                                    color: activeTab === "sell" ? '#28a745' : '#333', 
                                    marginBottom: '2px' 
                                }}>For Sale</div>
                                <div style={{ fontSize: '12px', color: activeTab === "sell" ? '#28a745' : '#666' }}>Sell your property</div>
                            </div>
                            
                            <div 
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: activeTab === "rent" ? '3px solid #007bff' : '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    backgroundColor: activeTab === "rent" ? '#e3f2fd' : '#fafafa',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    boxShadow: activeTab === "rent" ? '0 4px 12px rgba(0, 123, 255, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    transform: activeTab === "rent" ? 'translateY(-2px)' : 'none'
                                }}
                                onClick={() => setActiveTab("rent")}
                            >
                                <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔑</div>
                                <div style={{ 
                                    fontSize: '14px', 
                                    fontWeight: 'bold', 
                                    color: activeTab === "rent" ? '#007bff' : '#333', 
                                    marginBottom: '2px' 
                                }}>For Rent</div>
                                <div style={{ fontSize: '12px', color: activeTab === "rent" ? '#007bff' : '#666' }}>Rent out your property</div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Property Type & Price */}
                    <div className="form-step-section" style={{ padding: '16px 0' }}>
                        <div className="step-header" style={{ marginBottom: '12px' }}>
                            <div className="step-indicator">
                                <span className="step-number">2</span>
                            </div>
                            <h5 style={{ margin: 0, fontSize: '16px' }}>Property Type & Price</h5>
                        </div>
                        
                        <div className="step-content">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '14px', marginBottom: '4px' }}>Property Type *</label>
                                    <div className="select-wrapper">
                                        <Select
                                            options={PropertyTypeList}
                                            placeholder="Select property type"
                                            value={PropertyType}
                                            onChange={(e) => handleChange(e, "Property")}
                                            className="react-select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: '36px',
                                                    fontSize: '14px'
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '14px', marginBottom: '4px' }}>
                                        {activeTab === "rent" ? "Monthly Rent *" : "Sale Price *"}
                                    </label>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <span style={{ 
                                            padding: '8px', 
                                            backgroundColor: '#f8f9fa', 
                                            fontSize: '14px', 
                                            fontWeight: '500',
                                            borderRight: '1px solid #ccc'
                                        }}>ETB</span>
                                        <input
                                            type="number"
                                            placeholder={activeTab === "rent" ? "3,500" : "500,000"}
                                            name="total_price"
                                            onChange={onInpChanged}
                                            value={inps?.total_price}
                                            style={{ 
                                                border: 'none', 
                                                outline: 'none', 
                                                padding: '8px', 
                                                fontSize: '14px',
                                                flex: 1
                                            }}
                                        />
                                        {activeTab === "rent" && (
                                            <span style={{ 
                                                padding: '8px', 
                                                backgroundColor: '#f8f9fa', 
                                                fontSize: '12px', 
                                                color: '#666',
                                                borderLeft: '1px solid #ccc'
                                            }}>/month</span>
                                        )}
                                    </div>
                                    {error.errors?.total_price && <p className="error-msg" style={{ fontSize: '12px', margin: '4px 0 0 0' }}>{error.errors?.total_price}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Property Location */}
                    <div className="form-step-section" style={{ padding: '16px 0' }}>
                        <div className="step-header" style={{ marginBottom: '12px' }}>
                            <div className="step-indicator">
                                <span className="step-number">3</span>
                            </div>
                            <h5 style={{ margin: 0, fontSize: '16px' }}>Property Location</h5>
                        </div>
                        
                        <div className="step-content">
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '14px', marginBottom: '4px' }}>Property Address *</label>
                                <input
                                    type="text"
                                    name="property_address"
                                    placeholder="Address, House number, Street"
                                    onChange={onInpChanged}
                                    value={inps?.property_address}
                                    style={{ fontSize: '14px', padding: '8px' }}
                                />
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '14px', marginBottom: '4px' }}>Regional State</label>
                                    <div className="select-wrapper">
                                        <Select
                                            options={RegionalStateList}
                                            placeholder="Select state"
                                            value={RegionalStateType}
                                            onChange={(e) => handleChange(e, "RegionalState")}
                                            className="react-select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: '36px',
                                                    fontSize: '14px'
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '14px', marginBottom: '4px' }}>City</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Your City"
                                        name="city"
                                        onChange={onInpChanged}
                                        value={inps?.city}
                                        style={{ fontSize: '14px', padding: '8px' }}
                                    />
                                </div>
                                
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '14px', marginBottom: '4px' }}>Country</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Your Country"
                                        name="country"
                                        onChange={onInpChanged}
                                        value={inps?.country}
                                        style={{ fontSize: '14px', padding: '8px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Property Details */}
                    <div className="form-step-section" style={{ padding: '12px 0' }}>
                        <div className="step-header" style={{ marginBottom: '8px' }}>
                            <div className="step-indicator">
                                <span className="step-number">4</span>
                            </div>
                            <h6 style={{ margin: 0, fontSize: '15px' }}>Property Details</h6>
                        </div>
                        
                        <div className="step-content">
                            <div className="form-group" style={{ marginBottom: '6px' }}>
                                <label style={{ fontSize: '13px', marginBottom: '2px', display: 'block' }}>Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Brief property description..."
                                    onChange={onInpChanged}
                                    value={inps?.description}
                                    rows="1"
                                    style={{ fontSize: '14px', padding: '4px', width: '100%', resize: 'none' }}
                                    className={error.errors?.description ? "error" : ""}
                                />
                                {error.errors?.description && <p className="error-msg" style={{ fontSize: '11px', margin: '2px 0 0 0' }}>{error.errors?.description}</p>}
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '13px', marginBottom: '3px', display: 'block' }}>Size</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="150"
                                            name="property_size"
                                            onChange={onInpChanged}
                                            value={inps?.property_size}
                                            style={{ fontSize: '13px', padding: '6px', paddingRight: '35px', width: '100%' }}
                                        />
                                        <span style={{ 
                                            position: 'absolute', 
                                            right: '6px', 
                                            top: '50%', 
                                            transform: 'translateY(-50%)', 
                                            fontSize: '11px', 
                                            color: '#666' 
                                        }}>sqm</span>
                                    </div>
                                </div>
                                
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '13px', marginBottom: '3px', display: 'block' }}>Beds</label>
                                    <input
                                        type="number"
                                        placeholder="3"
                                        name="number_of_bedrooms"
                                        onChange={onInpChanged}
                                        value={inps?.number_of_bedrooms}
                                        style={{ fontSize: '13px', padding: '6px', width: '100%' }}
                                    />
                                </div>
                                
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '13px', marginBottom: '3px', display: 'block' }}>Baths</label>
                                    <input
                                        type="number"
                                        placeholder="2"
                                        name="number_of_bathrooms"
                                        onChange={onInpChanged}
                                        value={inps?.number_of_bathrooms}
                                        style={{ fontSize: '13px', padding: '6px', width: '100%' }}
                                    />
                                </div>
                                
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '13px', marginBottom: '3px', display: 'block' }}>Condition</label>
                                    <div className="select-wrapper">
                                        <Select
                                            options={HomeCondition}
                                            placeholder="Select"
                                            value={ConditionType}
                                            onChange={(e) => handleChange(e, "Condition")}
                                            className="react-select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: '30px',
                                                    fontSize: '13px'
                                                }),
                                                valueContainer: (base) => ({
                                                    ...base,
                                                    padding: '0 6px'
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '13px', marginBottom: '3px', display: 'block' }}>Furnishing</label>
                                    <div className="select-wrapper">
                                        <Select
                                            options={HomeFurnishing}
                                            placeholder="Select"
                                            value={FurnishingType}
                                            onChange={(e) => handleChange(e, "Furnishing")}
                                            className="react-select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: '30px',
                                                    fontSize: '13px'
                                                }),
                                                valueContainer: (base) => ({
                                                    ...base,
                                                    padding: '0 6px'
                                                })
                                            }}
                                        />
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
                            <div className="image-upload-section" style={{ padding: '16px 0' }}>
                                <div className="upload-info" style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h6 style={{ margin: 0, fontSize: '16px' }}>📸 Upload Property Photos</h6>
                                        <button 
                                            type="button"
                                            onClick={togglePhotoTipsPopup}
                                            style={{
                                                background: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                fontSize: '10px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="Photo Tips"
                                        >
                                            ℹ️
                                        </button>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>At least 2 images required. First image will be the main photo.</p>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '0 0 200px', height: '140px' }}>
                                        {images[0] ? (
                                            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                                                <img src={images[0]} alt="Main property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <div style={{ 
                                                    position: 'absolute', 
                                                    top: '8px', 
                                                    left: '8px', 
                                                    background: 'rgba(0,123,255,0.9)', 
                                                    color: 'white', 
                                                    padding: '2px 6px', 
                                                    borderRadius: '4px', 
                                                    fontSize: '11px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    Main
                                                </div>
                                            </div>
                                        ) : (
                                            <label style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                height: '100%',
                                                border: '2px dashed #007bff',
                                                borderRadius: '8px',
                                                backgroundColor: '#f8f9fa',
                                                cursor: 'pointer',
                                                textAlign: 'center'
                                            }}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, 0)}
                                                    style={{ display: "none" }}
                                                />
                                                <div style={{ fontSize: '24px', marginBottom: '4px' }}>📷</div>
                                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#007bff' }}>Main Photo</span>
                                                <span style={{ fontSize: '10px', color: '#666' }}>Click to upload</span>
                                            </label>
                                        )}
                                    </div>
                                    
                                    <div style={{ flex: '1', minWidth: '200px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Additional Photos</span>
                                            <button 
                                                onClick={addSlot} 
                                                type="button"
                                                style={{
                                                    background: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                + Add More
                                            </button>
                                        </div>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                                            {Array.from({ length: slots - 1 }).map((_, index) => {
                                                const actualIndex = index + 1;
                                                return (
                                                    <div key={actualIndex} style={{ aspectRatio: '1', position: 'relative' }}>
                                                        {images[actualIndex] ? (
                                                            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '6px', overflow: 'hidden' }}>
                                                                <img
                                                                    src={images[actualIndex]}
                                                                    alt={`Property ${actualIndex + 1}`}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                                <div style={{ 
                                                                    position: 'absolute', 
                                                                    top: '4px', 
                                                                    right: '4px', 
                                                                    background: 'rgba(0,0,0,0.7)', 
                                                                    color: 'white', 
                                                                    width: '16px', 
                                                                    height: '16px', 
                                                                    borderRadius: '50%', 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    justifyContent: 'center', 
                                                                    fontSize: '10px' 
                                                                }}>
                                                                    {actualIndex + 1}
                                                                </div>
                                                                {uploadingStates[actualIndex] && (
                                                                    <div style={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}>
                                                                        <span style={{ fontSize: '16px' }}>⏳</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <label style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '100%',
                                                                height: '100%',
                                                                border: '1px dashed #ccc',
                                                                borderRadius: '6px',
                                                                backgroundColor: '#fafafa',
                                                                cursor: 'pointer',
                                                                textAlign: 'center'
                                                            }}>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleFileChange(e, actualIndex)}
                                                                    style={{ display: "none" }}
                                                                />
                                                                <div style={{ fontSize: '16px', marginBottom: '2px' }}>+</div>
                                                                <span style={{ fontSize: '9px', color: '#999' }}>{actualIndex + 1}</span>
                                                            </label>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Photo Tips Popup */}
                                {showPhotoTipsPopup && (
                                    <div 
                                        style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 1000
                                        }}
                                        onClick={togglePhotoTipsPopup}
                                    >
                                        <div 
                                            style={{
                                                backgroundColor: 'white',
                                                padding: '24px',
                                                borderRadius: '8px',
                                                maxWidth: '500px',
                                                width: '90%',
                                                maxHeight: '80vh',
                                                overflow: 'auto',
                                                position: 'relative',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                <h4 style={{ margin: 0, color: '#333' }}>📋 Photo Tips</h4>
                                                <button 
                                                    onClick={togglePhotoTipsPopup}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        fontSize: '24px',
                                                        cursor: 'pointer',
                                                        color: '#666',
                                                        padding: '0',
                                                        width: '30px',
                                                        height: '30px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <div>
                                                <p style={{ marginBottom: '16px', color: '#666' }}>
                                                    Follow these tips to capture the best photos of your property:
                                                </p>
                                                <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#555' }}>
                                                    <li style={{ marginBottom: '8px' }}>Include exterior and interior shots</li>
                                                    <li style={{ marginBottom: '8px' }}>Show key rooms: living room, kitchen, bedrooms</li>
                                                    <li style={{ marginBottom: '8px' }}>Capture unique features and amenities</li>
                                                    <li style={{ marginBottom: '8px' }}>Use good lighting for best results</li>
                                                    <li style={{ marginBottom: '8px' }}>Take photos from different angles</li>
                                                    <li style={{ marginBottom: '8px' }}>Ensure images are clear and high resolution</li>
                                                    <li style={{ marginBottom: '8px' }}>Clean and declutter spaces before photographing</li>
                                                    <li style={{ marginBottom: '8px' }}>Avoid using flash - natural light works best</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                                    id="alarm_system" 
                                                    checked={selectedAmenities.alarm_system || false}
                                                    onChange={() => handleAmenityChange('alarm_system')}
                                                />
                                                <label htmlFor="alarm_system">Alarm System</label>
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
