import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  SvgRightIcon
} from "../../../assets/svg-files/SvgFiles.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
// ValidatePropertyForm is not exported from Validation.js
import Api from "../../../Apis/Api";
import "../property-list-form.css";

const PropertyTypeList = [
    { value: 'House', label: 'House' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' },
    { value: 'Villa', label: 'Villa' }
]

const HomeFurnishing = [
    { value: 'Furnished', label: 'Furnished' },
    { value: 'Fully Furnished', label: 'Fully Furnished' },
    { value: 'Semi Furnished', label: 'Semi Furnished' }
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

// Property Amenities Data (organized in three categories for 3-column layout)
// IDs updated to use hyphens to match backend schema enum for features.amenities
const amenitiesData = {
    basicFeatures: [
        { id: 'parking-space', label: 'Parking Space' },
        { id: 'garage', label: 'Garage' },
        { id: 'garden-yard', label: 'Garden/Yard' },
        { id: 'balcony-terrace', label: 'Balcony/Terrace' },
        { id: 'elevator', label: 'Elevator' },
        { id: 'internet', label: 'Internet/WiFi' }, // Matched to schema: 'internet'
        { id: 'electricity', label: 'Electricity' }, // Not directly in schema amenities, but in features.utilities
        { id: 'water-supply', label: 'Water Supply' }, // Not directly in schema amenities
        { id: 'backup-generator', label: 'Backup Generator' }, // Not in schema
        { id: 'solar-panels', label: 'Solar Power' }, // Matched to schema: 'solar-panels'
        { id: 'laundry', label: 'Laundry Room/Service' }, // Matched to schema: 'laundry'
        { id: 'air-conditioning', label: 'Air Conditioning' },
        { id: 'heating', label: 'Heating System' }, // Matched to schema: 'heating'
        { id: 'ceiling-fans', label: 'Ceiling Fans' }, // Not in schema
        { id: 'equipped-kitchen', label: 'Fully Equipped Kitchen' }, // Not in schema
        { id: 'kitchen-appliances', label: 'Kitchen Appliances' }, // Not in schema
        { id: 'furnished', label: 'Furnished' }, // This is also a top-level property 'furnishingStatus'
        { id: 'storage', label: 'Storage Space' } // Matched to schema: 'storage'
    ],
    securityComfort: [
        { id: '24-7-security', label: '24/7 Security' },
        { id: 'cctv-surveillance', label: 'CCTV Surveillance' },
        { id: 'security-alarm', label: 'Security Alarm' },
        { id: 'gated-community', label: 'Gated Community' },
        { id: 'intercom-system', label: 'Intercom System' },
        { id: 'security-guard', label: 'Security Guard' }, // Not in schema
        { id: 'cleaning-service', label: 'Cleaning Service' }, // Not in schema
        { id: 'maid-room', label: 'Maid\'s Room' }, // Not in schema
        { id: 'guest-room', label: 'Guest Room' }, // Not in schema
        { id: 'home-office', label: 'Home Office/Study' }, // Not in schema
        { id: 'built-in-wardrobes', label: 'Built-in Wardrobes' }, // Not in schema
        { id: 'dining-area', label: 'Dining Area' }, // Not in schema
        { id: 'pantry-storage', label: 'Pantry/Storage' }, // Not in schema
        { id: 'rooftop-access', label: 'Rooftop Access' }, // Not in schema
        { id: 'courtyard', label: 'Courtyard' }, // Not in schema
        { id: 'covered-parking', label: 'Covered Parking' }, // Not in schema (parking-space is)
        { id: 'bbq-area', label: 'BBQ Area' }, // Not in schema
        { id: 'wheelchair-accessible', label: 'Wheelchair Accessible' }
    ],
    recreationLocation: [
        { id: 'gym-fitness-center', label: 'Gym/Fitness Center' },
        { id: 'swimming-pool', label: 'Swimming Pool' },
        { id: 'playground', label: 'Playground' },
        { id: 'sports-facilities', label: 'Sports Facilities' },
        { id: 'clubhouse', label: 'Clubhouse' },
        { id: 'near-transport', label: 'Near Public Transport' }, // Not in schema as amenity
        { id: 'near-shopping', label: 'Near Shopping Centers' }, // Not in schema as amenity
        { id: 'near-schools', label: 'Near Schools' }, // Not in schema as amenity
        { id: 'near-healthcare', label: 'Near Healthcare' }, // Not in schema as amenity
        { id: 'near-mosque', label: 'Near Mosque' }, // Not in schema as amenity
        { id: 'near-church', label: 'Near Church' } // Not in schema as amenity
    ]
};

const PropertyListForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [PropertyType, setPropertyType] = useState(null);
    const [FurnishingType, setFurnishingType] = useState(null);
    const [RegionalStateType, setRegionalStateType] = useState(null);
    
    // Default to "For Sale" when coming from Sell button in header
    const [activeTab, setActiveTab] = useState("For Sale");
    const [images, setImages] = useState([]);
    const [slots, setSlots] = useState(7); // Increased to 7 slots initially (1 main + 6 regular)
    const [Loading, setLoading] = useState(false);
    const [uploadingStates, setUploadingStates] = useState({});
    const [error, setError] = useState({ isValid: false });
    const [validationErrors, setValidationErrors] = useState({});
    const [MediaPaths, setMediaPaths] = useState([]);
    const [networkStatus, setNetworkStatus] = useState('online');
    const [selectedAmenities, setSelectedAmenities] = useState({});
    const [collapsedSections, setCollapsedSections] = useState({
        basicFeatures: false,
        securityComfort: false,
        recreationLocation: false,
        propertyAmenities: true
    });

    const [inps, setInps] = useState({
        title: '',
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

        updateNetworkStatus();
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        return () => {
            window.removeEventListener('online', updateNetworkStatus);
            window.removeEventListener('offline', updateNetworkStatus);
        };
    }, []);

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
        
        // Clear validation error when user starts typing
        if (validationErrors[event.target.name]) {
            setValidationErrors(prev => {
                const updated = { ...prev };
                delete updated[event.target.name];
                return updated;
            });
        }
        
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        
        // Basic validation
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large (max 5MB)');
            return;
        }
        
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
            toast.error('Only JPG, PNG, or WEBP allowed');
            return;
        }

        // Clear validation error
        if (validationErrors.images) {
            setValidationErrors(prev => {
                const updated = { ...prev };
                delete updated.images;
                return updated;
            });
        }

        // Create preview
        const preview = URL.createObjectURL(file);
        const newImages = [...images];
        newImages[index] = preview;
        setImages(newImages);
        
        // Show upload state
        setUploadingStates(prev => ({ ...prev, [index]: true }));
        
        // Upload the image
        ImagesUpload(file, index);
    };

    const ImagesUpload = async (file, index) => {
        try {
            setLoading(true);
            
            const formData = new FormData();
            formData.append('mediaFiles', file);
            
            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error('Authentication required. Please login again.');
                setLoading(false);
                setUploadingStates(prev => ({ ...prev, [index]: false }));
                return;
            }
            
            const response = await Api.postFileWithtoken('media/public', formData);
            console.log('Upload successful:', response);
            
            // Process the response and update MediaPaths
            if (response.images && Array.isArray(response.images)) {
                setMediaPaths(prev => [...prev, ...response.images]);
            } else if (response.files) {
                // Handle legacy response format
                const files = Array.isArray(response.files) ? response.files : [response.files];
                
                const formattedImages = files.map(file => {
                    const filePath = typeof file === 'string' ? file : file.url || file.path || file;
                    const fileCaption = filePath.split('/').pop();
                    
                    // Generate an ID if not present
                    const timestamp = Math.floor(Date.now() / 1000).toString(16);
                    const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
                    const counter = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
                    const id = file._id || `${timestamp}${randomHex}${counter}`;
                    
                    return {
                        url: filePath,
                        caption: fileCaption,
                        _id: id
                    };
                });
                
                setMediaPaths(prev => [...prev, ...formattedImages]);
            }
            
            toast.success('Image uploaded successfully!');
            
        } catch (err) {
            console.error('Upload failed:', err);
            
            // Reset the image
            setImages(prev => {
                const newImages = [...prev];
                newImages[index] = null;
                return newImages;
            });
            
            toast.error(err.response?.data?.message || 'Upload failed');
            
        } finally {
            setLoading(false);
            setUploadingStates(prev => ({ ...prev, [index]: false }));
        }
    };

    const addSlot = () => {
        setSlots(slots + 1);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
        
        if (MediaPaths.length > index) {
            const newMediaPaths = [...MediaPaths];
            newMediaPaths.splice(index, 1);
            setMediaPaths(newMediaPaths);
        }
        
        toast.info("Image removed successfully");
    };
    
    const handleChange = (e, type) => {
        if (type === 'Property') {
            setPropertyType(e);
            // Clear validation error when user selects a property type
            if (validationErrors.property_type) {
                setValidationErrors(prev => {
                    const updated = { ...prev };
                    delete updated.property_type;
                    return updated;
                });
            }
        } else if (type === 'Furnishing') {
            setFurnishingType(e)
        } else if (type === 'RegionalState') {
            setRegionalStateType(e);
            setInps((prevInputs) => ({ ...prevInputs, regional_state: e?.value || '' }));
        }
    };

    // Amenities handling
    const handleAmenityToggle = (amenityId) => {
        setSelectedAmenities(prev => ({
            ...prev,
            [amenityId]: !prev[amenityId]
        }));
    };

    const getSelectedAmenitiesArray = () => {
        return Object.keys(selectedAmenities).filter(key => selectedAmenities[key]);
    };

    const toggleSection = (sectionName) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const validateForm = () => {
        const errors = {};
        const errorMessages = [];
        
        // Validate Title
        if (!inps?.title || inps.title.trim() === '') {
            errors.title = true;
            errorMessages.push('Title is required - Please enter a title for your property');
        }

        // Validate Property Type
        if (!PropertyType) {
            errors.property_type = true;
            errorMessages.push('Property Type is required - Please select the type of property you are offering');
        }

        // Validate Regional State
        if (!RegionalStateType || !inps?.regional_state) {
            errors.regional_state = true; // Use a consistent key for highlighting if needed
            errorMessages.push('Regional State is required - Please select the regional state for the property');
        }
        
        // Validate Property Address
        if (!inps?.property_address || inps.property_address.trim() === '') {
            errors.property_address = true;
            errorMessages.push('Property Address is required - Please provide the complete address of your property');
        }
        
        // Validate Total Price
        if (!inps?.total_price || inps.total_price.trim() === '') {
            const priceLabel = activeTab === "For Rent" ? "Monthly Rent" : "Sale Price";
            errors.total_price = true;
            errorMessages.push(`${priceLabel} is required - Please enter the ${priceLabel.toLowerCase()} for your property`);
        }
        
        // Require at least one image
        if (!MediaPaths || MediaPaths.length === 0) {
            errors.images = true;
            errorMessages.push('At least one property image is required - Please upload at least one image.');
        }

        return { errors, errorMessages };
    };

    const NextPage = async () => {
        // Debug: log all required fields and MediaPaths before validation
        console.log("NextPage called. Current form state:");
        console.log("title:", inps?.title);
        console.log("regional_state:", inps?.regional_state);
        console.log("city:", inps?.city);
        console.log("country:", inps?.country);
        console.log("property_address:", inps?.property_address);
        console.log("number_of_bathrooms:", inps.number_of_bathrooms);
        console.log("number_of_bedrooms:", inps.number_of_bedrooms);
        console.log("property_size:", inps?.property_size);
        console.log("total_price:", inps?.total_price);
        console.log("description:", inps?.description);
        console.log("property_for:", activeTab);
        console.log("property_type:", PropertyType?.value || PropertyType);
        console.log("furnishing:", FurnishingType?.value || FurnishingType);
        console.log("media_paths (MediaPaths):", MediaPaths);
        console.log("amenities:", getSelectedAmenitiesArray());

        const { errors, errorMessages } = validateForm();
        
        // Set validation errors to highlight fields in red
        setValidationErrors(errors);
        
        if (errorMessages.length > 0) {
            // Display a prominent error alert at the top of the form
            const errorAlert = document.createElement('div');
            errorAlert.className = 'property-form-error-alert';
            errorAlert.innerHTML = `
                <div class="error-icon">⚠️</div>
                <div class="error-content">
                    <h3>Property data is missing. Please ensure the property form was completed.</h3>
                    <p>Please fill in the required fields marked with * to continue.</p>
                </div>
            `;
            
            // Add styles for the error alert
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .property-form-error-alert {
                    display: flex;
                    align-items: center;
                    background-color: #ffebee;
                    color: #d32f2f;
                    padding: 15px 20px;
                    border-radius: 8px;
                    margin: 0 auto 20px;
                    max-width: 100%;
                    border: 1px solid #ef9a9a;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    animation: fadeIn 0.3s ease-in-out;
                    font-weight: bold;
                }
                .error-icon {
                    font-size: 28px;
                    margin-right: 15px;
                }
                .error-content h3 {
                    margin: 0 0 5px 0;
                    font-size: 18px;
                }
                .error-content p {
                    margin: 0;
                    font-size: 14px;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(styleElement);
            
            // Find the form element and insert the error alert at the top
            const formElement = document.querySelector('.property-form-main');
            if (formElement && !document.querySelector('.property-form-error-alert')) {
                formElement.insertBefore(errorAlert, formElement.firstChild);
                
                // Scroll to the error alert
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Also show detailed toast message
            const errorMessage = `Please complete the following required fields:\n\n${errorMessages.map((error, index) => `${index + 1}. ${error}`).join('\n')}`;
            
            toast.error(errorMessage, {
                autoClose: 8000,
                hideProgressBar: false,
                style: {
                    whiteSpace: 'pre-line',
                    textAlign: 'left'
                }
            });
            
            // Scroll to first error field if no alert was added
            if (!document.querySelector('.property-form-error-alert')) {
                setTimeout(() => {
                    const firstErrorElement = document.querySelector('.form-group.has-error, .form-step-section.has-error');
                    if (firstErrorElement) {
                        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
            
            return;
        }
    
        let data = {
            title: inps?.title,
            regional_state: inps?.regional_state,
            city: inps?.city,
            country: inps?.country,
            property_address: inps?.property_address,
            number_of_bathrooms: inps.number_of_bathrooms,
            number_of_bedrooms: inps.number_of_bedrooms,
            property_size: inps?.property_size,
            total_price: inps?.total_price,
            description: inps?.description,
            property_for: activeTab, // "For Sale" or "For Rent"
            property_type: PropertyType?.value || PropertyType,
            furnishing: FurnishingType?.value || FurnishingType,
            media_paths: MediaPaths,
            amenities: getSelectedAmenitiesArray()
        };

        try {
            // Remove any existing error alert before proceeding
            const existingAlert = document.querySelector('.property-form-error-alert');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            // Show loading toast to indicate navigation is in progress
            toast.info("Proceeding to promotion selection...", {
                autoClose: 2000,
                position: "top-center"
            });
            
            // Scroll to the top of the page before navigation
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Add a small delay to allow the toast to be visible and scrolling to complete
            setTimeout(() => {
                navigate('/payment-method/choose-promotion', { 
                    state: { AllData: data },
                    replace: true // Use replace to prevent going back to form accidentally
                });
            }, 500);
        } catch (error) {
            console.error("Navigation error:", error);
            toast.error("Failed to proceed to promotion page. Please try again.");
        }
    };

    return (
        <section className="common-section property-form-section">
            <div className="container">
                <div className="property-heading-form">
                    <h3>Property Listing Form</h3>
                </div>
                <div className="property-form-main">
                    
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">1</span>
                            </div>
                            <h4>What are you offering?</h4>
                        </div>
                        
                        <div className="offering-options">
                            <div 
                                className={`offering-card ${activeTab === "For Sale" ? "selected" : ""}`}
                                onClick={() => setActiveTab("For Sale")}
                            >
                                <div className="card-icon">
                                    <div className="icon-circle green">🏠</div>
                                </div>
                                <h5>For Sale</h5>
                                <p>Sell your property</p>
                            </div>
                            
                            <div 
                                className={`offering-card ${activeTab === "For Rent" ? "selected" : ""}`}
                                onClick={() => setActiveTab("For Rent")}
                            >
                                <div className="card-icon">
                                    <div className="icon-circle blue">🔑</div>
                                </div>
                                <h5>For Rent</h5>
                                <p>Rent out your property</p>
                            </div>
                        </div>
                    </div>

                    <div className={`form-step-section ${validationErrors.property_type || validationErrors.total_price ? 'has-error' : ''}`}>
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">2</span>
                            </div>
                            <h4>Complete Property Information</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="form-row-3-cols">
                                <div className="form-col-33">
                                    <div className={`form-group required ${validationErrors.property_type ? 'has-error' : ''}`}>
                                        <label>Property Type *</label>
                                        <div className="select-wrapper">
                                            <Select
                                                options={PropertyTypeList}
                                                placeholder="Select type"
                                                value={PropertyType}
                                                onChange={(e) => handleChange(e, "Property")}
                                                className="react-select"
                                            />
                                        </div>
                                        {validationErrors.property_type && (
                                            <span className="error-msg">Property type is required</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className={`form-group required ${validationErrors.title ? 'has-error' : ''}`}>
                                        <label>Title *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter property title"
                                            name="title"
                                            onChange={onInpChanged}
                                            value={inps?.title}
                                        />
                                        {validationErrors.title && (
                                            <span className="error-msg">Title is required</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className={`form-group required ${validationErrors.total_price ? 'has-error' : ''}`}>
                                        <label>{activeTab === "For Rent" ? "Monthly Rent * /month" : "Sale Price *"}</label>
                                        <div className="price-input">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                name="total_price"
                                                onChange={onInpChanged}
                                                value={inps?.total_price}
                                            />
                                        </div>
                                        {validationErrors.total_price && (
                                            <span className="error-msg">
                                                {activeTab === "For Rent" ? "Monthly rent" : "Sale price"} is required
                                            </span>
                                        )}
                                        {error.errors?.total_price && <p className="error-msg">{error.errors?.total_price}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="form-row-3-cols">
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Number of Bedrooms</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            name="number_of_bedrooms"
                                            onChange={onInpChanged}
                                            value={inps?.number_of_bedrooms}
                                        />
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Number of Bathrooms</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            name="number_of_bathrooms"
                                            onChange={onInpChanged}
                                            value={inps?.number_of_bathrooms}
                                        />
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Furnishing</label>
                                        <div className="select-wrapper">
                                            <Select
                                                options={HomeFurnishing}
                                                placeholder="Select furnishing"
                                                value={FurnishingType}
                                                onChange={(e) => handleChange(e, "Furnishing")}
                                                className="react-select"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-col-100">
                                    <div className="form-group">
                                        <label>Property Description</label>
                                        <textarea
                                            name="description"
                                            placeholder="Describe your property in detail..."
                                            rows="3"
                                            onChange={onInpChanged}
                                            value={inps?.description}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`form-step-section ${validationErrors.property_address ? 'has-error' : ''}`}>
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">3</span>
                            </div>
                            <h4>Property Location</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className={`form-group required ${validationErrors.property_address ? 'has-error' : ''}`}>
                                <label>Property Address *</label>
                                <textarea
                                    name="property_address"
                                    placeholder="Address
