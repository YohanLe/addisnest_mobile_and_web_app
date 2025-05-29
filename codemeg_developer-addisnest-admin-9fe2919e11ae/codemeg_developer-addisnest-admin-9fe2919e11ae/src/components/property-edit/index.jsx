import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../../Apis/Api";
import "../../assets/css/property-edit.css";

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

const PropertyEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    
    const [PropertyType, setPropertyType] = useState(null);
    const [ConditionType, setConditionType] = useState(null);
    const [FurnishingType, setFurnishingType] = useState(null);
    const [RegionalStateType, setRegionalStateType] = useState(null);
    const [activeTab, setActiveTab] = useState("rent");
    const [selectedAmenities, setSelectedAmenities] = useState({});
    const [propertyData, setPropertyData] = useState(null);

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

    // Fetch property data on component mount
    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                setFetchingData(true);
                const response = await Api.getWithtoken(`admin/property/${id}`);
                const property = response.data || response;
                
                if (property) {
                    setPropertyData(property);
                    
                    // Set form fields
                    setInps({
                        regional_state: property.regional_state || '',
                        city: property.city || '',
                        country: property.country || 'Ethiopia',
                        property_address: property.address || property.property_address || '',
                        total_price: property.price || property.total_price || '',
                        description: property.description || '',
                        property_size: property.property_size || '',
                        number_of_bathrooms: property.number_of_bathrooms || '',
                    });

                    // Set dropdowns
                    if (property.property_type) {
                        const propertyTypeOption = PropertyTypeList.find(
                            opt => opt.value === property.property_type
                        );
                        setPropertyType(propertyTypeOption || null);
                    }

                    if (property.condition) {
                        const conditionOption = HomeCondition.find(
                            opt => opt.value === property.condition
                        );
                        setConditionType(conditionOption || null);
                    }

                    if (property.furnishing) {
                        const furnishingOption = HomeFurnishing.find(
                            opt => opt.value === property.furnishing
                        );
                        setFurnishingType(furnishingOption || null);
                    }

                    if (property.regional_state) {
                        const regionalStateOption = RegionalStateList.find(
                            opt => opt.value === property.regional_state
                        );
                        setRegionalStateType(regionalStateOption || null);
                    }

                    // Set property type (rent/sell)
                    setActiveTab(property.propertyFor || property.property_for || "rent");

                    // Set amenities
                    if (property.amenities) {
                        setSelectedAmenities(property.amenities);
                    }
                }
                
                setFetchingData(false);
            } catch (error) {
                console.error('Error fetching property data:', error);
                toast.error('Failed to load property data');
                setFetchingData(false);
                navigate('/rent-list'); // Navigate back if error
            }
        };

        if (id) {
            fetchPropertyData();
        }
    }, [id, navigate]);

    const onInpChanged = (event) => {
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
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

    const handleAmenityChange = (amenityId) => {
        setSelectedAmenities(prev => ({
            ...prev,
            [amenityId]: !prev[amenityId]
        }));
    };

    const handleSubmit = async () => {
        // Validation
        const errors = [];
        
        if (!PropertyType) {
            errors.push('Property Type is required');
        }
        
        if (!inps?.property_address || inps.property_address.trim() === '') {
            errors.push('Property Address is required');
        }
        
        if (!inps?.total_price || inps.total_price.trim() === '') {
            errors.push('Price is required');
        }

        if (errors.length > 0) {
            toast.error(
                <div>
                    <strong>Please fix the following errors:</strong>
                    <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                        {errors.map((error, index) => (
                            <li key={index} style={{ marginBottom: '5px' }}>{error}</li>
                        ))}
                    </ul>
                </div>,
                { autoClose: 5000 }
            );
            return;
        }

        try {
            setLoading(true);
            
            const updateData = {
                regional_state: inps?.regional_state,
                city: inps?.city,
                country: inps?.country,
                address: inps?.property_address,
                property_address: inps?.property_address,
                number_of_bathrooms: inps.number_of_bathrooms,
                property_size: inps?.property_size,
                price: inps?.total_price,
                total_price: inps?.total_price,
                description: inps?.description,
                property_for: activeTab,
                property_type: PropertyType?.value,
                condition: ConditionType?.value,
                furnishing: FurnishingType?.value,
                amenities: selectedAmenities
            };

            const response = await Api.putWithtoken(`admin/property/${id}`, updateData);
            
            setLoading(false);
            toast.success('Property updated successfully!');
            
            // Navigate back to appropriate list
            if (activeTab === 'rent') {
                navigate('/rent-list');
            } else {
                navigate('/sell-list');
            }
            
        } catch (error) {
            setLoading(false);
            console.error('Error updating property:', error);
            
            let errorMessage = 'Failed to update property';
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        }
    };

    if (fetchingData) {
        return (
            <div className="container">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="mt-3">Loading property data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="common-section property-form-section">
            <div className="container">
                <div className="property-heading-form">
                    <h3>Edit Property</h3>
                    <div className="breadcrumb-nav">
                        <Link to="/rent-list" className="back-link">
                            ← Back to Properties
                        </Link>
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
                                />
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

                    {/* Step 5: Property Amenities */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">5</span>
                            </div>
                            <h4>Property Amenities</h4>
                        </div>
                        
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
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions">
                        <div className="action-buttons">
                            <Link 
                                to={activeTab === 'rent' ? '/rent-list' : '/sell-list'} 
                                className="cancel-btn"
                            >
                                Cancel
                            </Link>
                            <button 
                                className="submit-btn" 
                                onClick={handleSubmit}
                                disabled={loading}
                                type="button"
                            >
                                {loading ? 'Updating...' : 'Update Property'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PropertyEditPage;
