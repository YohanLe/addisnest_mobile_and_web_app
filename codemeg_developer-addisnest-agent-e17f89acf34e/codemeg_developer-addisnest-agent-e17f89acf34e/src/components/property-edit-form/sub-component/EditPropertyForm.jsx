import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  SvgArrowRightIcon,
  SvgCheckBigIcon,
  SvgCheckIcon,
  SvgLongArrowIcon,
} from "../../../assets/svg/Svg";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ValidatePropertyForm } from "../../../utils/Validation";
import Api from "../../../Apis/Api";
import "../../../assets/css/property-form.css";
import { useDispatch } from "react-redux";
import { GetPropertyList } from "../../../Redux-store/Slices/PropertyListSlice";

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

const EditPropertyForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const propertyId = searchParams.get('id');
    
    const [PropertyType, setPropertyType] = useState(null);
    const [ConditionType, setConditionType] = useState(null);
    const [FurnishingType, setFurnishingType] = useState(null);
    const [RegionalStateType, setRegionalStateType] = useState(null);
    
    const [activeTab, setActiveTab] = useState("rent");
    const [images, setImages] = useState([]);
    const [slots, setSlots] = useState(3);
    const [Loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [uploadingStates, setUploadingStates] = useState({});
    const [error, setError] = useState({ isValid: false });
    const [MediaPaths, setMediaPaths] = useState([]);
    const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState({});
    const [networkStatus, setNetworkStatus] = useState('online');
    const [originalData, setOriginalData] = useState(null);

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

    // Function to intelligently determine offering type based on listing data
    const getOfferingType = (item) => {
        console.log('🔍 Determining offering type for item:', item);
        
        // First check if we have explicit data - this should be the primary source
        if (item?.property_for === 'sell' || item?.listing_type === 'sell' || item?.offer_type === 'sell') {
            console.log('✅ Found explicit SELL data');
            return 'sell';
        }
        if (item?.property_for === 'rent' || item?.listing_type === 'rent' || item?.offer_type === 'rent') {
            console.log('✅ Found explicit RENT data');
            return 'rent';
        }

        // Smart detection based on data patterns
        const price = parseFloat(item?.price || item?.total_price) || 0;
        const description = (item?.description || '').toLowerCase();
        const address = (item?.address || item?.property_address || '').toLowerCase();
        
        console.log('📊 Analysis data:', { price, description, address });
        
        // Check for rental keywords in description or address
        const rentalKeywords = ['rent', 'rental', 'monthly', 'lease', 'tenant', 'per month', '/month'];
        const saleKeywords = ['sale', 'buy', 'purchase', 'investment', 'owner'];
        
        const hasRentalKeywords = rentalKeywords.some(keyword => 
            description.includes(keyword) || address.includes(keyword)
        );
        const hasSaleKeywords = saleKeywords.some(keyword => 
            description.includes(keyword) || address.includes(keyword)
        );

        console.log('🔍 Keywords found:', { hasRentalKeywords, hasSaleKeywords });

        // If we find explicit keywords, use them
        if (hasRentalKeywords && !hasSaleKeywords) {
            console.log('✅ RENT detected from keywords');
            return 'rent';
        }
        if (hasSaleKeywords && !hasRentalKeywords) {
            console.log('✅ SALE detected from keywords');
            return 'sell';
        }

        // For properties without clear indicators, use price-based logic
        // Properties over 50,000 ETB are more likely to be for sale
        // Properties under 50,000 ETB are more likely to be for rent
        if (price > 50000) {
            console.log('✅ SALE detected from high price:', price);
            return 'sell';
        } else {
            console.log('✅ RENT detected from low price:', price);
            return 'rent';
        }
    };

    // Fetch property data when component mounts
    useEffect(() => {
        if (propertyId) {
            fetchPropertyData();
        } else {
            toast.error("No property ID provided");
            navigate('/property-list');
        }
    }, [propertyId]);
    
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

    // Show network status notification
    useEffect(() => {
        if (networkStatus === 'offline') {
            toast.warning('You are offline. Image uploads will fail until your connection is restored.', {
                autoClose: false,
                closeButton: true
            });
        }
    }, [networkStatus]);

    const fetchPropertyData = async () => {
        try {
            setFetchingData(true);
            const response = await Api.getWithtoken(`properties/${propertyId}`);
            const propertyData = response?.data || response;
            
            console.log('📋 Fetched property data:', propertyData);
            setOriginalData(propertyData);
            
            // Populate form fields with comprehensive field mapping
            setInps({
                regional_state: propertyData?.regional_state || '',
                city: propertyData?.city || '',
                country: propertyData?.country || 'Ethiopia',
                property_address: propertyData?.property_address || propertyData?.address || '',
                total_price: propertyData?.total_price || propertyData?.price || '',
                description: propertyData?.description || '',
                property_size: propertyData?.property_size || propertyData?.size || '',
                number_of_bathrooms: propertyData?.number_of_bathrooms || propertyData?.bathrooms || '',
                number_of_bedrooms: propertyData?.number_of_bedrooms || propertyData?.bedrooms || '',
            });

            // Set property type
            if (propertyData?.property_type) {
                const propertyType = PropertyTypeList.find(p => p.value === propertyData.property_type);
                if (propertyType) {
                    setPropertyType(propertyType);
                    console.log('✅ Property type set:', propertyType);
                }
            }

            // Set condition
            if (propertyData?.condition) {
                const condition = HomeCondition.find(c => c.value === propertyData.condition);
                if (condition) {
                    setConditionType(condition);
                    console.log('✅ Condition set:', condition);
                }
            }

            // Set furnishing
            if (propertyData?.furnishing) {
                const furnishing = HomeFurnishing.find(f => f.value === propertyData.furnishing);
                if (furnishing) {
                    setFurnishingType(furnishing);
                    console.log('✅ Furnishing set:', furnishing);
                }
            }

            // Enhanced regional state handling
            const regionalStateValue = propertyData?.regional_state;
            console.log('🗺️ Setting regional state:', regionalStateValue);
            if (regionalStateValue) {
                const regionalState = RegionalStateList.find(r => r.value === regionalStateValue);
                if (regionalState) {
                    setRegionalStateType(regionalState);
                    console.log('✅ Regional state set:', regionalState);
                } else {
                    // If exact match not found, try partial match
                    const partialMatch = RegionalStateList.find(r => 
                        r.value.toLowerCase().includes(regionalStateValue.toLowerCase()) ||
                        regionalStateValue.toLowerCase().includes(r.value.toLowerCase())
                    );
                    if (partialMatch) {
                        setRegionalStateType(partialMatch);
                        console.log('✅ Regional state partial match set:', partialMatch);
                    }
                }
            }

            // Enhanced property offering type detection using the same logic as MyListProperty
            const detectedOfferingType = getOfferingType(propertyData);
            setActiveTab(detectedOfferingType);
            console.log('🏷️ Offering type set to:', detectedOfferingType);

            // Enhanced image handling
            console.log('🖼️ Processing property images...');
            if (propertyData?.media && Array.isArray(propertyData.media) && propertyData.media.length > 0) {
                const existingImages = propertyData.media.map(media => {
                    // Handle different media object structures
                    return media.filePath || media.url || media.path || media;
                });
                console.log('✅ Images found:', existingImages);
                setImages(existingImages);
                setMediaPaths(propertyData.media);
                setSlots(Math.max(3, existingImages.length + 1));
            } else {
                console.log('⚠️ No images found in property data');
                setImages([]);
                setMediaPaths([]);
                setSlots(3);
            }

            // Enhanced amenities handling
            console.log('🏠 Processing amenities...');
            if (propertyData?.amenities) {
                console.log('✅ Amenities found:', propertyData.amenities);
                setSelectedAmenities(propertyData.amenities);
                // Auto-expand amenities section if property has amenities
                if (Object.keys(propertyData.amenities).some(key => propertyData.amenities[key])) {
                    setAmenitiesExpanded(true);
                }
            } else {
                console.log('⚠️ No amenities found in property data');
                setSelectedAmenities({});
            }

            toast.success("Property data loaded successfully!");
            
        } catch (error) {
            console.error('❌ Error fetching property:', error);
            toast.error("Failed to load property data. Please try again.");
            navigate('/property-list');
        } finally {
            setFetchingData(false);
        }
    };

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
            
            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error("Authentication required. Please login again.");
                setUploadingStates(prev => ({ ...prev, [index]: false }));
                setLoading(false);
                return;
            }
            
            let formData = new FormData();
            formData.append("mediaFiles", file);
            
            if (retryCount > 0) {
                toast.info(`Retrying upload... (Attempt ${retryCount + 1}/${maxRetries + 1})`);
            }
            
            const response = await Api.postFileWithtoken("media/public", formData);
            const { files, status, message } = response;
            setLoading(false);
            
            setUploadingStates(prev => ({ ...prev, [index]: false }));
            
            if (files && Array.isArray(files)) {
                // Replace the image at the specific index
                setMediaPaths((prevPaths) => {
                    const newPaths = [...prevPaths];
                    newPaths[index] = files[0];
                    return newPaths;
                });
            } else if (files) {
                setMediaPaths((prevPaths) => {
                    const newPaths = [...prevPaths];
                    newPaths[index] = files;
                    return newPaths;
                });
            }
            toast.success(message || "Image uploaded successfully!");
        } catch (error) {
            setLoading(false);
            setUploadingStates(prev => ({ ...prev, [index]: false }));
            
            const shouldRetry = retryCount < maxRetries && (
                error?.code === 'NETWORK_ERROR' || 
                error?.message === 'Network Error' ||
                error?.message?.includes('Network connection failed') ||
                error?.response?.status >= 500 ||
                error?.response?.status === 408
            );
            
            if (shouldRetry) {
                toast.warning(`Upload failed. Retrying in ${2 * (retryCount + 1)} seconds...`);
                setTimeout(() => {
                    ImagesUpload(file, index, retryCount + 1);
                }, 2000 * (retryCount + 1));
                return;
            }
            
            setImages(prev => {
                const newImages = [...prev];
                newImages[index] = null;
                return newImages;
            });
            
            let errorMessage = "Image upload failed!";
            
            if (error?.message?.includes('Authentication failed')) {
                errorMessage = "Authentication failed. Please refresh the page and login again.";
            } else if (error?.message?.includes('Network connection failed')) {
                errorMessage = "Network connection failed. Please check your internet connection and try again.";
            } else if (error?.response?.status === 413) {
                errorMessage = "File is too large for the server. Please select a smaller image.";
            } else if (error?.response?.status === 415) {
                errorMessage = "Unsupported file format. Please select a JPG, PNG, or WEBP image.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
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

    const updateProperty = async () => {
        // Prevent multiple simultaneous submissions
        if (Loading) {
            console.log('Update already in progress, ignoring click');
            return;
        }

        // Validation
        const errors = [];
        
        if (!PropertyType) {
            errors.push('Property Type is required');
        }
        
        if (!inps?.property_address || inps.property_address.trim() === '') {
            errors.push('Property Address is required');
        }
        
        if (!inps?.total_price || inps.total_price.trim() === '') {
            errors.push(`${activeTab === "rent" ? "Monthly Rent" : "Sale Price"} is required`);
        }
        
        if (MediaPaths.length < 2) {
            errors.push(`At least 2 property images are required - Current: ${MediaPaths.length}`);
        }
        
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
                { autoClose: 8000 }
            );
            return;
        }

        try {
            console.log('🚀 Starting property update...');
            setLoading(true);
            
            // Check authentication before proceeding
            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error("Authentication required. Please login again.");
                navigate('/login');
                return;
            }
            
            // Use the exact same data structure as PropertyListForm to ensure compatibility
            const updateData = {
                regional_state: inps?.regional_state,
                city: inps?.city,
                country: inps?.country,
                property_address: inps?.property_address,
                number_of_bathrooms: inps?.number_of_bathrooms || '',
                number_of_bedrooms: inps?.number_of_bedrooms || '',
                property_size: inps?.property_size,
                total_price: inps?.total_price,
                description: inps?.description,
                property_for: activeTab,
                property_type: PropertyType?.value || PropertyType, // Extract value from Select object
                condition: ConditionType?.value || ConditionType, // Extract value from Select object
                furnishing: FurnishingType?.value || FurnishingType, // Extract value from Select object
                media_paths: MediaPaths,
                amenities: selectedAmenities
            };

            console.log('🔄 Updating property with ID:', propertyId);
            console.log('📋 Update data:', updateData);
            
            // Try different API endpoints to find the correct one
            let response;
            let successEndpoint = '';
            
            try {
                // Try agent-specific endpoint first
                response = await Api.putWithtoken(`agent/properties/${propertyId}`, updateData);
                successEndpoint = `agent/properties/${propertyId}`;
                console.log('✅ Updated via agent endpoint');
            } catch (agentError) {
                console.log('❌ Agent endpoint failed:', agentError?.response?.status);
                try {
                    // Try general properties endpoint with PUT
                    response = await Api.putWithtoken(`properties/${propertyId}`, updateData);
                    successEndpoint = `properties/${propertyId}`;
                    console.log('✅ Updated via properties PUT endpoint');
                } catch (putError) {
                    console.log('❌ PUT failed:', putError?.response?.status);
                    try {
                        // Try PATCH method
                        response = await Api.patchWithtoken(`properties/${propertyId}`, updateData);
                        successEndpoint = `properties/${propertyId} (PATCH)`;
                        console.log('✅ Updated via properties PATCH endpoint');
                    } catch (patchError) {
                        console.log('❌ PATCH failed:', patchError?.response?.status);
                        try {
                            // Try agent properties with PATCH
                            response = await Api.patchWithtoken(`agent/properties/${propertyId}`, updateData);
                            successEndpoint = `agent/properties/${propertyId} (PATCH)`;
                            console.log('✅ Updated via agent PATCH endpoint');
                        } catch (agentPatchError) {
                            console.log('❌ All endpoints failed');
                            throw agentPatchError; // Throw the last error
                        }
                    }
                }
            }
            
            console.log('✅ Property update successful via:', successEndpoint);
            console.log('📄 Response:', response);
            
            toast.success("Property listing updated successfully!");
            
            // Refresh the property list to show updated information
            dispatch(GetPropertyList({ type: '' }));
            
            // Navigate back to property list page
            navigate('/property-list');
            
        } catch (error) {
            console.error('❌ Error updating property:', error);
            
            let errorMessage = "Failed to update property listing. Please try again.";
            
            if (error?.response?.status === 401) {
                errorMessage = "Your session has expired. Please login again.";
                // Clear token and redirect to login
                localStorage.removeItem('access_token');
                navigate('/login');
            } else if (error?.response?.status === 403) {
                errorMessage = "You don't have permission to update this property.";
            } else if (error?.response?.status === 404) {
                errorMessage = "Property not found. The property may have been deleted or moved.";
            } else if (error?.response?.status === 400) {
                errorMessage = "Invalid property data. Please check all fields and try again.";
                if (error?.response?.data?.message) {
                    errorMessage += ` Details: ${error.response.data.message}`;
                }
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
            
            // Log detailed error information for debugging
            console.error('🔍 Update error details:', {
                status: error?.response?.status,
                statusText: error?.response?.statusText,
                data: error?.response?.data,
                propertyId: propertyId,
                requestData: updateData,
                timestamp: new Date().toISOString()
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <section className="common-section property-form-section">
                <div className="container">
                    <div className="property-heading-form">
                        <h3>Loading Property Data...</h3>
                        <div className="loading-spinner">⏳ Please wait while we fetch your property information.</div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="common-section property-form-section">
            <div className="container">
                <div className="property-heading-form">
                    <h3>Edit Property Listing</h3>
                    <div className="edit-info">
                        <p>Update your property information below. All fields marked with * are required.</p>
                        {originalData && (
                            <div className="original-listing-info">
                                <small>
                                    📋 Editing: {originalData.property_type} • 
                                    {activeTab === 'rent' ? ' For Rent' : ' For Sale'} • 
                                    {RegionalStateType?.label || originalData.regional_state}
                                </small>
                            </div>
                        )}
                    </div>
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
                            <span className="step-label">Images ({MediaPaths.length})</span>
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
                            
                            <div className="form-row">
                                <div className="form-col-50">
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            placeholder="Ethiopia"
                                            name="country"
                                            onChange={onInpChanged}
                                            value={inps?.country}
                                            readOnly
                                        />
                                    </div>
                                </div>
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
                            <div className="form-row">
                                <div className="form-col-50">
                                    <div className="form-group">
                                        <label>Property Size (sq. meters)</label>
                                        <input
                                            type="number"
                                            placeholder="120"
                                            name="property_size"
                                            onChange={onInpChanged}
                                            value={inps?.property_size}
                                        />
                                    </div>
                                </div>
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
                            </div>
                            
                            <div className="form-row">
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
                                                placeholder="Select furnishing"
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

                    {/* Step 5: Property Description */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">5</span>
                            </div>
                            <h4>Property Description</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Describe your property in detail..."
                                    onChange={onInpChanged}
                                    value={inps?.description}
                                    rows="6"
                                />
                                <small className="form-helper">Tell potential buyers/renters about the property's features, location benefits, and any special amenities.</small>
                            </div>
                        </div>
                    </div>

                    {/* Step 6: Property Images */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">6</span>
                            </div>
                            <h4>Property Images *</h4>
                            <p className="step-description">Upload at least 2 high-quality images of your property</p>
                        </div>
                        
                        <div className="step-content">
                            <div className="image-upload-grid">
                                {Array.from({ length: slots }, (_, index) => (
                                    <div key={index} className="image-upload-slot">
                                        <div className="upload-container">
                                            {images[index] ? (
                                                <div className="image-preview">
                                                    <img src={images[index]} alt={`Property ${index + 1}`} />
                                                    <div className="image-overlay">
                                                        <label htmlFor={`file-${index}`} className="change-image-btn">
                                                            Change Image
                                                        </label>
                                                    </div>
                                                    {uploadingStates[index] && (
                                                        <div className="upload-progress">
                                                            <div className="spinner"></div>
                                                            <span>Uploading...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <label htmlFor={`file-${index}`} className="upload-placeholder">
                                                    <div className="upload-icon">📷</div>
                                                    <p>Add Photo</p>
                                                    <small>{index < 2 ? 'Required' : 'Optional'}</small>
                                                </label>
                                            )}
                                            <input
                                                type="file"
                                                id={`file-${index}`}
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, index)}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="image-upload-actions">
                                <button type="button" onClick={addSlot} className="add-more-btn">
                                    + Add More Photos
                                </button>
                                <div className="upload-info">
                                    <small>
                                        📸 Uploaded: {MediaPaths.length} images | 
                                        ✅ Min required: 2 images | 
                                        📱 Max file size: 5MB
                                    </small>
                                    {networkStatus === 'offline' && (
                                        <div className="offline-warning">
                                            ⚠️ You're offline - image uploads will fail
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 7: Amenities (Optional) */}
                    <div className="form-step-section amenities-compact">
                        <div className="amenities-header">
                            <div className="amenities-header-left">
                                <div className="amenities-step-indicator">
                                    <span className="amenities-step-number">7</span>
                                </div>
                                <h4 className="amenities-title">Property Amenities</h4>
                            </div>
                            <button 
                                type="button" 
                                className="amenities-expand-btn"
                                onClick={toggleAmenities}
                            >
                                + Expand
                            </button>
                        </div>
                        
                        <div className="step-content">
                            <div className="amenities-section">
                                
                                {amenitiesExpanded && (
                                    <div className="amenities-container">
                                        {/* Parking & Transportation */}
                                        <div className="amenity-category">
                                            <div className="category-title">
                                                🚗 Parking & Transportation
                                            </div>
                                            <div className="amenity-grid">
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
                                                        id="covered_parking"
                                                        checked={selectedAmenities.covered_parking || false}
                                                        onChange={() => handleAmenityChange('covered_parking')}
                                                    />
                                                    <label htmlFor="covered_parking">🏠 Covered Parking</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="garage"
                                                        checked={selectedAmenities.garage || false}
                                                        onChange={() => handleAmenityChange('garage')}
                                                    />
                                                    <label htmlFor="garage">🚘 Garage</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="public_transport"
                                                        checked={selectedAmenities.public_transport || false}
                                                        onChange={() => handleAmenityChange('public_transport')}
                                                    />
                                                    <label htmlFor="public_transport">🚌 Near Public Transport</label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Security & Safety */}
                                        <div className="amenity-category">
                                            <div className="category-title">
                                                🔒 Security & Safety
                                            </div>
                                            <div className="amenity-grid">
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="security"
                                                        checked={selectedAmenities.security || false}
                                                        onChange={() => handleAmenityChange('security')}
                                                    />
                                                    <label htmlFor="security">🔒 Security Guard</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="cctv"
                                                        checked={selectedAmenities.cctv || false}
                                                        onChange={() => handleAmenityChange('cctv')}
                                                    />
                                                    <label htmlFor="cctv">📹 CCTV</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="gated_community"
                                                        checked={selectedAmenities.gated_community || false}
                                                        onChange={() => handleAmenityChange('gated_community')}
                                                    />
                                                    <label htmlFor="gated_community">🚪 Gated Community</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="intercom"
                                                        checked={selectedAmenities.intercom || false}
                                                        onChange={() => handleAmenityChange('intercom')}
                                                    />
                                                    <label htmlFor="intercom">📞 Intercom</label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Building Facilities */}
                                        <div className="amenity-category">
                                            <div className="category-title">
                                                🏢 Building Facilities
                                            </div>
                                            <div className="amenity-grid">
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="elevator"
                                                        checked={selectedAmenities.elevator || false}
                                                        onChange={() => handleAmenityChange('elevator')}
                                                    />
                                                    <label htmlFor="elevator">🛗 Elevator</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="gym"
                                                        checked={selectedAmenities.gym || false}
                                                        onChange={() => handleAmenityChange('gym')}
                                                    />
                                                    <label htmlFor="gym">🏋️ Gym</label>
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
                                                        id="community_hall"
                                                        checked={selectedAmenities.community_hall || false}
                                                        onChange={() => handleAmenityChange('community_hall')}
                                                    />
                                                    <label htmlFor="community_hall">🏛️ Community Hall</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="rooftop_access"
                                                        checked={selectedAmenities.rooftop_access || false}
                                                        onChange={() => handleAmenityChange('rooftop_access')}
                                                    />
                                                    <label htmlFor="rooftop_access">🏙️ Rooftop Access</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="concierge"
                                                        checked={selectedAmenities.concierge || false}
                                                        onChange={() => handleAmenityChange('concierge')}
                                                    />
                                                    <label htmlFor="concierge">🛎️ Concierge</label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Outdoor & Recreation */}
                                        <div className="amenity-category">
                                            <div className="category-title">
                                                🌿 Outdoor & Recreation
                                            </div>
                                            <div className="amenity-grid">
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
                                                    <label htmlFor="balcony">🏙️ Balcony</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="terrace"
                                                        checked={selectedAmenities.terrace || false}
                                                        onChange={() => handleAmenityChange('terrace')}
                                                    />
                                                    <label htmlFor="terrace">🌅 Terrace</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="playground"
                                                        checked={selectedAmenities.playground || false}
                                                        onChange={() => handleAmenityChange('playground')}
                                                    />
                                                    <label htmlFor="playground">🛝 Playground</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="barbecue_area"
                                                        checked={selectedAmenities.barbecue_area || false}
                                                        onChange={() => handleAmenityChange('barbecue_area')}
                                                    />
                                                    <label htmlFor="barbecue_area">🔥 BBQ Area</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="jogging_track"
                                                        checked={selectedAmenities.jogging_track || false}
                                                        onChange={() => handleAmenityChange('jogging_track')}
                                                    />
                                                    <label htmlFor="jogging_track">🏃 Jogging Track</label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Utilities & Connectivity */}
                                        <div className="amenity-category">
                                            <div className="category-title">
                                                💡 Utilities & Connectivity
                                            </div>
                                            <div className="amenity-grid">
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="air_conditioning"
                                                        checked={selectedAmenities.air_conditioning || false}
                                                        onChange={() => handleAmenityChange('air_conditioning')}
                                                    />
                                                    <label htmlFor="air_conditioning">❄️ Air Conditioning</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="heating"
                                                        checked={selectedAmenities.heating || false}
                                                        onChange={() => handleAmenityChange('heating')}
                                                    />
                                                    <label htmlFor="heating">🔥 Heating</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="wifi"
                                                        checked={selectedAmenities.wifi || false}
                                                        onChange={() => handleAmenityChange('wifi')}
                                                    />
                                                    <label htmlFor="wifi">📶 WiFi Ready</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="cable_tv"
                                                        checked={selectedAmenities.cable_tv || false}
                                                        onChange={() => handleAmenityChange('cable_tv')}
                                                    />
                                                    <label htmlFor="cable_tv">📺 Cable TV Ready</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="backup_generator"
                                                        checked={selectedAmenities.backup_generator || false}
                                                        onChange={() => handleAmenityChange('backup_generator')}
                                                    />
                                                    <label htmlFor="backup_generator">⚡ Backup Generator</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="solar_power"
                                                        checked={selectedAmenities.solar_power || false}
                                                        onChange={() => handleAmenityChange('solar_power')}
                                                    />
                                                    <label htmlFor="solar_power">☀️ Solar Power</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="water_heater"
                                                        checked={selectedAmenities.water_heater || false}
                                                        onChange={() => handleAmenityChange('water_heater')}
                                                    />
                                                    <label htmlFor="water_heater">🚿 Water Heater</label>
                                                </div>
                                                <div className="amenity-item">
                                                    <input
                                                        type="checkbox"
                                                        id="water_storage"
                                                        checked={selectedAmenities.water_storage || false}
                                                        onChange={() => handleAmenityChange('water_storage')}
                                                    />
                                                    <label htmlFor="water_storage">💧 Water Storage Tank</label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selected Amenities Summary */}
                                        {Object.keys(selectedAmenities).filter(key => selectedAmenities[key]).length > 0 && (
                                            <div className="selected-amenities-summary">
                                                <p><strong>Selected Amenities ({Object.keys(selectedAmenities).filter(key => selectedAmenities[key]).length}):</strong></p>
                                                <div className="selected-tags">
                                                    {Object.keys(selectedAmenities)
                                                        .filter(key => selectedAmenities[key])
                                                        .map(key => (
                                                            <span key={key} className="amenity-tag">
                                                                {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="form-step-section submit-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">✓</span>
                            </div>
                            <h4>Review & Update Property</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="submission-summary">
                                <div className="summary-card">
                                    <h5>Property Summary</h5>
                                    <div className="summary-details">
                                        <div className="summary-row">
                                            <span className="label">Type:</span>
                                            <span className="value">{PropertyType?.label || 'Not selected'}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="label">Offering:</span>
                                            <span className="value">{activeTab === 'rent' ? 'For Rent' : 'For Sale'}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="label">Price:</span>
                                            <span className="value">
                                                {inps.total_price ? `ETB ${parseInt(inps.total_price).toLocaleString()}${activeTab === 'rent' ? '/month' : ''}` : 'Not set'}
                                            </span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="label">Location:</span>
                                            <span className="value">{RegionalStateType?.label || 'Not selected'}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="label">Images:</span>
                                            <span className="value">{MediaPaths.length} uploaded</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <div className="action-buttons">
                                    <Link to="/property-list" className="btn-secondary">
                                        Cancel Changes
                                    </Link>
                                    <button 
                                        type="button" 
                                        className="btn-primary"
                                        onClick={updateProperty}
                                        disabled={Loading}
                                    >
                                        {Loading ? (
                                            <span className="loading-text">
                                                <span className="spinner-small"></span>
                                                Updating Property...
                                            </span>
                                        ) : (
                                            <>
                                                Update Property
                                                <SvgArrowRightIcon />
                                            </>
                                        )}
                                    </button>
                                </div>
                                
                                <div className="form-footer-info">
                                    <small>
                                        💡 Tip: High-quality images and detailed descriptions help attract more potential buyers/renters
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditPropertyForm;
