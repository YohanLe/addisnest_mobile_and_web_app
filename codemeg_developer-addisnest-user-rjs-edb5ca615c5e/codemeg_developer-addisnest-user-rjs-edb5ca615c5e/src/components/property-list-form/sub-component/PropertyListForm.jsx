import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
    SvgArrowRightIcon,
    SvgCheckBigIcon,
    SvgCheckIcon,
    SvgLongArrowIcon,
} from "../../../assets/svg-files/SvgFiles";
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
const LaundryFacilitiesList = [
    { value: 'In-Unit', label: 'In-Unit' },
    { value: 'On-Site Laundry Room', label: 'On-Site Laundry Room' },
]
const ConferenceList = [
    { value: 'Meeting Rooms', label: 'Meeting Rooms' },
    { value: 'High-Speed Internet', label: 'High-Speed Internet' },
]
const RooftopTerraceList = [
    { value: 'Lounge', label: 'Lounge' },
    { value: 'Garden', label: 'Garden' },
]

const SecurityFeaturesList = [
    { value: '24/7 Security', label: '24/7 Security' },
    { value: 'Access Control', label: 'Access Control' },
]

const PropertyListForm = () => {

    const [Bath_Features_List, setBath_Features_List] = useState([
        { value: 'Bathtub', label: 'Bathtub' },
        { value: 'Double Vanity', label: 'Double Vanity' },
        { value: 'Modern Fixtures', label: 'Modern Fixtures' },
        { value: 'Walk-In Shower', label: 'Walk-In Shower' },
    ]);
    
    const [KeyFeaturesOtherList, setKeyFeaturesOtherList] = useState([
        { value: 'Balcony', label: 'Balcony' },
        { value: 'Garden', label: 'Garden' },
        { value: 'Gym', label: 'Gym' },
        { value: 'Swimming Pool', label: 'Swimming Pool' },
        { value: 'Security', label: 'Security' },
        { value: 'Lift/Elevator', label: 'Lift/Elevator' },
        { value: 'A/C', label: 'A/C' },
    ]);
    const navigate = useNavigate();
    
    const [PropertyType, setPropertyType] = useState(null);
    const [ConditionType, setConditionType] = useState(null);
    const [FurnishingType, setFurnishingType] = useState(null);

    const [activeTab, setActiveTab] = useState("rent");
    const [images, setImages] = useState([]);
    const [slots, setSlots] = useState(3);
    const [Loading, setLoading] = useState(false);
    const SelectClient = [{ value: "Select", label: "Select" }];
    const [error, setError] = useState({ isValid: false });
    const [interestRate, setInterestRate] = useState(10);
    const [InpuBathAdd, setInpuBathAdd] = useState('')
    const [MediaPaths, setMediaPaths] = useState([]);

    const [SelectBathFeatures, setSelectBathFeatures] = useState([]);
    const [SelectParking, setSelectParking] = useState([]);
    const [SelectOtherFeatures, setSelectOtherFeatures] = useState([]);
    const [LaundryFacilities, setLaundryFacilities] = useState([]);
    const [ConferenceFacilities, setConferenceFacilities] = useState([]);
    const [RooftopTerrace, setRooftopTerrace] = useState([]);
    const [SecurityFeatures, setSecurityFeatures] = useState([]);

    const [CoolingInfo, setCoolingInfo] = useState("");
    const [HeatingInfo, setHeatingInfo] = useState("");
    const [KitchenInfo, setKitchenInfo] = useState("");
    const [InteriorInfo, setInteriorInfo] = useState("");
    const [CommunityInfo, setCommunityInfo] = useState("");
    const [PlaygroundInfo, setPlaygroundInfo] = useState("");
    const [EvStationsInfo, setEvStationsInfo] = useState("");
    const [InternetInfo, setInternetInfo] = useState("");
    const [BarbecueInfo, setBarbecueInfo] = useState("");
    const [WaterSysInfo, setWaterSysInfo] = useState("");

    const handleFileChange = async (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const newImages = [...images];
            newImages[index] = URL.createObjectURL(file); // Preview URL
            setImages(newImages);
            // Upload file
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
            console.error("Upload Error:", error);
            toast.error(error?.response?.data?.message || "Image upload failed!");
        }
    };
    const handleRangeChange = (setter, maxValue) => (e) => {
        const newValue = Number(e.target.value);
        setter(newValue);
        const fillPercentage = (newValue / maxValue) * 100;
        e.target.style.background = `linear-gradient(to right, #a6f255 ${fillPercentage}%, #e0e0e0 ${fillPercentage}%)`;
    };

    const addSlot = () => {
        setSlots(slots + 1);
    };

    const [inps, setInps] = useState({
        property_address: '',
        regional_state: '',
        city: '',
        country: '',
        property_for: '',
        total_price: '',
        description: '',
        property_readiness: '',
        property_size: '',
        interior: '',
        has_appliances: '',
        number_of_bathrooms: '',
        special_bathroom_features: '',
        cooling_information: '',
        heating_information: '',
        condition: '',
        furnishing: '',
        parking: '',
        laundr_facilities: '',
        community_center: '',
        playground: '',
        conference_facilities: '',
        rooftop_terrace: '',
        electric_vehicle: '',
        internet: '',
        barbecue_grills: '',
        security_features: '',
        underground_water_system: '',
        property_pictures: '',
    })
    
    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        })
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const handleInputAddBath = (e) => {
        setInpuBathAdd(e.target.value);
    };

    const handleAddFeature = () => {
        if (InpuBathAdd.trim() !== '') {
            const newFeature = {
                value: Bath_Features_List.length + 1,
                label: InpuBathAdd.trim(),
            };
            setBath_Features_List([...Bath_Features_List, newFeature]);
            setInpuBathAdd('');
        }
    };


    const handleChange = (e, type) => {
        if (type === 'Property') {
            setPropertyType(e);
        } else if (type === 'Condition') {
            setConditionType(e)
        } else {
            setFurnishingType(e)
        }
    };

    const handleCoolingInfoChange = (e) => {
        const { name, value } = e.target;
        if (name === "CoolingInfo") {
            setCoolingInfo(value);
        } else if (name === "HeatingInfo") {
            setHeatingInfo(value);
        } else if (name === 'KitchenInfo') {
            setKitchenInfo(value)
        } else if (name === 'InteriorInfo') {
            setInteriorInfo(value)
        } else if (name === 'CommunityInfo') {
            setCommunityInfo(value)
        } else if (name === 'PlaygroundInfo') {
            setPlaygroundInfo(value)
        } else if (name === 'EvStationsInfo') {
            setEvStationsInfo(value)
        } else if (name === 'InternetInfo') {
            setInternetInfo(value)
        } else if (name === 'BarbecueInfo') {
            setBarbecueInfo(value)
        } else if (name === 'WaterSysInfo') {
            setWaterSysInfo(value)
        }
    };

    const handleCheckboxChange = (e, data, type) => {
        if (type === 'Bathroom') {
            if (e.target.checked) {
                setSelectBathFeatures((prevSelected) => [
                    ...prevSelected,
                    { value: data.value, label: data.label }
                ]);
            } else {
                setSelectBathFeatures((prevSelected) =>
                    prevSelected.filter((item) => item.value !== data.value)
                );
            }
        } else {
            if (e.target.checked) {
                setSelectParking((prevSelected) => [
                    ...prevSelected,
                    { value: data.value, label: data.label }
                ]);
            } else {
                setSelectParking((prevSelected) =>
                    prevSelected.filter((item) => item.value !== data.value)
                );
            }
        }

    };

    const handleKeyFeaturesCheckboxChange = (e, data, type) => {
        const { name, value } = e.target.checked;
        if (type==='Other') {
            if (e.target.checked) {
                setSelectOtherFeatures((prevSelected) => [
                    ...prevSelected,
                    { value: data.value, label: data.label }
                ]);
            } else {
                setSelectOtherFeatures((prevSelected) =>
                    prevSelected.filter((item) => item.value !== data.value)
                );
            }
        } else if (type==='Laundry Facilities') {
            if (e.target.checked) {
                setLaundryFacilities((prevSelected) => [
                    ...prevSelected,
                    { value: data.value, label: data.label }
                ]);
            } else {
                setLaundryFacilities((prevSelected) =>
                    prevSelected.filter((item) => item.value !== data.value)
                );
            }
        } else if (type === 'Conference Facilities') {
            if (e.target.checked) {
                setConferenceFacilities((prevSelected) => [
                    ...prevSelected,
                    { value: data.value, label: data.label }
                ]);
            } else {
                setConferenceFacilities((prevSelected) =>
                    prevSelected.filter((item) => item.value !== data.value)
                );
            }
        } else if (type === 'Rooftop Terrace') {
            if (e.target.checked) {
                setRooftopTerrace((prevSelected) => [
                    ...prevSelected,
                    { value: data.value, label: data.label }
                ]);
            } else {
                setRooftopTerrace((prevSelected) =>
                    prevSelected.filter((item) => item.value !== data.value)
                );
            }
        } else if (type === 'Security Features') {
            if (e.target.checked) {
                setSecurityFeatures((prevSelected) => [
                    ...prevSelected,
                    { value: data.value, label: data.label }
                ]);
            } else {
                setSecurityFeatures((prevSelected) =>
                    prevSelected.filter((item) => item.value !== data.value)
                );
            }
        }
    };
    
    const NextPage = async () => {
        const errorMessage = ValidatePropertyForm(inps);
        
        if (!errorMessage.isValid) {
            setError(errorMessage);
            return;
        }
        if (!PropertyType) {
            toast.warning('Please select property type');
            return;
        }
    
        if (!InteriorInfo) {
            toast.warning('Please provide interior details');
            return;
        }
    
        if (!KitchenInfo) {
            toast.warning('Please specify appliance details');
            return;
        }
    
        if (!SelectBathFeatures || SelectBathFeatures.length === 0) {
            toast.warning('Please select special bathroom features');
            return;
        }
    
        if (!CoolingInfo) {
            toast.warning('Please provide cooling information');
            return;
        }
    
        if (!HeatingInfo) {
            toast.warning('Please provide heating information');
            return;
        }
    
        if (!ConditionType) {
            toast.warning('Please select condition type');
            return;
        }
    
        if (!FurnishingType) {
            toast.warning('Please select furnishing type');
            return;
        }
    
        if (!SelectParking || SelectParking.length === 0) {
            toast.warning('Please provide parking details');
            return;
        }
    
        if (!SelectOtherFeatures || SelectOtherFeatures.length === 0) {
            toast.warning('Please provide kitchen information');
            return;
        }
    
        if (!LaundryFacilities || LaundryFacilities.length === 0) {
            toast.warning('Please provide laundry facilities details');
            return;
        }
    
        if (!CommunityInfo) {
            toast.warning('Please provide community center details');
            return;
        }
    
        if (!PlaygroundInfo) {
            toast.warning('Please specify playground details');
            return;
        }
    
        if (!ConferenceFacilities || ConferenceFacilities.length === 0) {
            toast.warning('Please provide conference facilities details');
            return;
        }
    
        if (!RooftopTerrace || RooftopTerrace.length === 0) {
            toast.warning('Please specify rooftop terrace details');
            return;
        }
    
        if (!EvStationsInfo) {
            toast.warning('Please provide electric vehicle station details');
            return;
        }
    
        if (!InternetInfo) {
            toast.warning('Please specify internet information');
            return;
        }
    
        if (!BarbecueInfo) {
            toast.warning('Please provide barbecue grills details');
            return;
        }
    
        if (!SecurityFeatures || SecurityFeatures.length === 0) {
            toast.warning('Please provide security features');
            return;
        }
    
        if (!WaterSysInfo) {
            toast.warning('Please provide underground water system details');
            return;
        }
    
        if (!MediaPaths || MediaPaths.length === 0) {
            toast.warning('Please upload at least one media file');
            return;
        }
    
        let data = {
            property_address: inps?.property_address,
            regional_state: inps?.regional_state,
            city: inps?.city,
            country: inps?.country,
            number_of_bathrooms: inps.number_of_bathrooms,
            property_size: inps?.property_size,
            total_price: inps?.total_price,
            description: inps?.description,
            property_for: activeTab,
            property_type: PropertyType,
            property_readiness: interestRate,
            interior: InteriorInfo,
            has_appliances: KitchenInfo,
            special_bathroom_features: SelectBathFeatures,
            cooling_information: CoolingInfo,
            heating_information: HeatingInfo,
            condition: ConditionType,
            furnishing: FurnishingType,
            parking: SelectParking,
            kitchen_information: SelectOtherFeatures,
            laundr_facilities: LaundryFacilities,
            community_center: CommunityInfo,
            playground: PlaygroundInfo,
            conference_facilities: ConferenceFacilities,
            rooftop_terrace: RooftopTerrace,
            electric_vehicle: EvStationsInfo,
            internet: InternetInfo,
            barbecue_grills: BarbecueInfo,
            security_features: SecurityFeatures,
            underground_water_system: WaterSysInfo,
            media_paths: MediaPaths
        };
    
        navigate('/choose-promotion', { state: { AllData: data } });
    };

    return (
        <>
            <section className="common-section property-form-section">
                <div className="container">
                    <div className="property-heading-form">
                        <h3>Property Listing form</h3>
                    </div>
                    <div className="property-form-main">
                        <div className="property-form-title">
                            <h5>
                                Property Address
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-100">
                                <div className="single-input">
                                    <label htmlFor="">Property Address</label>
                                    <textarea
                                        type="text"
                                        placeholder="Address, House number, Street"
                                        name="property_address"
                                        onChange={onInpChanged}
                                        value={inps?.property_address}
                                        className={`${error.errors?.property_address ? "alert-input" : ""}`}
                                    />
                                    {error.errors?.property_address && <p className="error-input-msg">{error.errors?.property_address}</p>}
                                </div>
                            </div>
                            <div className="form-inner-flex-33">
                                <div className="single-input">
                                    <label htmlFor="">Regional State</label>
                                    <input
                                        type="text"
                                        placeholder="Enter regional state"
                                        name="regional_state"
                                        onChange={onInpChanged}
                                        value={inps?.regional_state}
                                        className={`${error.errors?.regional_state ? "alert-input" : ""}`}
                                    />
                                    {error.errors?.regional_state && <p className="error-input-msg">{error.errors?.regional_state}</p>}
                                </div>
                            </div>
                            <div className="form-inner-flex-33">
                                <div className="single-input">
                                    <label htmlFor="">City</label>
                                    <input
                                        type="text"
                                        placeholder="Enter city"
                                        name="city"
                                        onChange={onInpChanged}
                                        value={inps?.city}
                                        className={`${error.errors?.city ? "alert-input" : ""}`}
                                    />
                                    {error.errors?.city && <p className="error-input-msg">{error.errors?.city}</p>}
                                </div>
                            </div>
                            <div className="form-inner-flex-33">
                                <div className="single-input">
                                    <label htmlFor="">Country</label>
                                    <input
                                        type="text"
                                        placeholder="Enter country"
                                        name="country"
                                        onChange={onInpChanged}
                                        value={inps?.country}
                                        className={`${error.errors?.country ? "alert-input" : ""}`}
                                    />
                                    {error.errors?.country && <p className="error-input-msg">{error.errors?.country}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Property For
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="property-tab-section">
                            <ul className="nav nav-pills">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "rent" ? "active" : ""}`}
                                        onClick={() => setActiveTab("rent")}
                                    >
                                        Rent
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "sale" ? "active" : ""}`}
                                        onClick={() => setActiveTab("sale")}
                                    >
                                        Sale
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Property Information
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-33">
                                <div className="single-input">
                                    <label htmlFor="">Property Type</label>
                                    <Select
                                        value={PropertyType}
                                        onChange={(e) => handleChange(e, 'Property')}
                                        options={PropertyTypeList}
                                        placeholder="Select property type"
                                        isSearchable={false}
                                    />
                                </div>
                            </div>
                            <div className="form-inner-flex-33">
                                <div className="single-input">
                                    <label htmlFor="">Total Price</label>
                                    <input
                                        type="number"
                                        placeholder="Enter total price"
                                        name="total_price"
                                        onChange={onInpChanged}
                                        value={inps?.total_price}
                                        className={`${error.errors?.total_price ? "alert-input" : ""}`}
                                    />
                                    {error.errors?.total_price && <p className="error-input-msg">{error.errors?.total_price}</p>}
                                </div>
                            </div>
                            <div className="form-inner-flex-33">
                                <div className="single-input">
                                    <label htmlFor="">Property Size (sq ft)</label>
                                    <input
                                        type="number"
                                        placeholder="Enter property size"
                                        name="property_size"
                                        onChange={onInpChanged}
                                        value={inps?.property_size}
                                        className={`${error.errors?.property_size ? "alert-input" : ""}`}
                                    />
                                    {error.errors?.property_size && <p className="error-input-msg">{error.errors?.property_size}</p>}
                                </div>
                            </div>
                            <div className="form-inner-flex-100">
                                <div className="single-input">
                                    <label htmlFor="">Description</label>
                                    <textarea
                                        placeholder="Enter property description"
                                        name="description"
                                        onChange={onInpChanged}
                                        value={inps?.description}
                                        className={`${error.errors?.description ? "alert-input" : ""}`}
                                    />
                                    {error.errors?.description && <p className="error-input-msg">{error.errors?.description}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Property Readiness
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="single-range-slider">
                                <label htmlFor="">Property Readiness ({interestRate}%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={interestRate}
                                    onChange={handleRangeChange(setInterestRate, 100)}
                                    className="slider"
                                />
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Interior Details
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-50">
                                <div className="single-input">
                                    <label htmlFor="">Interior</label>
                                    <textarea
                                        placeholder="Describe interior details"
                                        name="InteriorInfo"
                                        onChange={handleCoolingInfoChange}
                                        value={InteriorInfo}
                                    />
                                </div>
                            </div>
                            <div className="form-inner-flex-50">
                                <div className="single-input">
                                    <label htmlFor="">Has Appliances</label>
                                    <textarea
                                        placeholder="Specify appliance details"
                                        name="KitchenInfo"
                                        onChange={handleCoolingInfoChange}
                                        value={KitchenInfo}
                                    />
                                </div>
                            </div>
                            <div className="form-inner-flex-50">
                                <div className="single-input">
                                    <label htmlFor="">Number of Bathrooms</label>
                                    <input
                                        type="number"
                                        placeholder="Enter number of bathrooms"
                                        name="number_of_bathrooms"
                                        onChange={onInpChanged}
                                        value={inps?.number_of_bathrooms}
                                        className={`${error.errors?.number_of_bathrooms ? "alert-input" : ""}`}
                                    />
                                    {error.errors?.number_of_bathrooms && <p className="error-input-msg">{error.errors?.number_of_bathrooms}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Special Bathroom Features
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="feature-checkbox-section">
                                {Bath_Features_List.map((feature, index) => (
                                    <div key={index} className="feature-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`bath_feature_${index}`}
                                            onChange={(e) => handleCheckboxChange(e, feature, 'Bathroom')}
                                        />
                                        <label htmlFor={`bath_feature_${index}`}>{feature.label}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="add-feature-section">
                                <input
                                    type="text"
                                    placeholder="Add custom bathroom feature"
                                    value={InpuBathAdd}
                                    onChange={handleInputAddBath}
                                />
                                <button type="button" onClick={handleAddFeature}>Add Feature</button>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Heating & Cooling
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-50">
                                <div className="single-input">
                                    <label htmlFor="">Cooling Information</label>
                                    <textarea
                                        placeholder="Describe cooling system"
                                        name="CoolingInfo"
                                        onChange={handleCoolingInfoChange}
                                        value={CoolingInfo}
                                    />
                                </div>
                            </div>
                            <div className="form-inner-flex-50">
                                <div className="single-input">
                                    <label htmlFor="">Heating Information</label>
                                    <textarea
                                        placeholder="Describe heating system"
                                        name="HeatingInfo"
                                        onChange={handleCoolingInfoChange}
                                        value={HeatingInfo}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Condition & Furnishing
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-50">
                                <div className="single-input">
                                    <label htmlFor="">Condition</label>
                                    <Select
                                        value={ConditionType}
                                        onChange={(e) => handleChange(e, 'Condition')}
                                        options={HomeCondition}
                                        placeholder="Select condition"
                                        isSearchable={false}
                                    />
                                </div>
                            </div>
                            <div className="form-inner-flex-50">
                                <div className="single-input">
                                    <label htmlFor="">Furnishing</label>
                                    <Select
                                        value={FurnishingType}
                                        onChange={(e) => handleChange(e, 'Furnishing')}
                                        options={HomeFurnishing}
                                        placeholder="Select furnishing"
                                        isSearchable={false}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Parking
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="feature-checkbox-section">
                                {ParkingList.map((parking, index) => (
                                    <div key={index} className="feature-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`parking_${index}`}
                                            onChange={(e) => handleCheckboxChange(e, parking, 'Parking')}
                                        />
                                        <label htmlFor={`parking_${index}`}>{parking.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Kitchen Information
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="feature-checkbox-section">
                                {KeyFeaturesOtherList.map((feature, index) => (
                                    <div key={index} className="feature-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`kitchen_feature_${index}`}
                                            onChange={(e) => handleKeyFeaturesCheckboxChange(e, feature, 'Other')}
                                        />
                                        <label htmlFor={`kitchen_feature_${index}`}>{feature.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Laundry Facilities
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="feature-checkbox-section">
                                {LaundryFacilitiesList.map((facility, index) => (
                                    <div key={index} className="feature-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`laundry_${index}`}
                                            onChange={(e) => handleKeyFeaturesCheckboxChange(e, facility, 'Laundry Facilities')}
                                        />
                                        <label htmlFor={`laundry_${index}`}>{facility.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Community Center
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-100">
                                <div className="single-input">
                                    <label htmlFor="">Community Center Details</label>
                                    <textarea
                                        placeholder="Describe community center facilities"
                                        name="CommunityInfo"
                                        onChange={handleCoolingInfoChange}
                                        value={CommunityInfo}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Playground
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-100">
                                <div className="single-input">
                                    <label htmlFor="">Playground Details</label>
                                    <textarea
                                        placeholder="Describe playground facilities"
                                        name="PlaygroundInfo"
                                        onChange={handleCoolingInfoChange}
                                        value={PlaygroundInfo}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Conference Facilities
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="feature-checkbox-section">
                                {ConferenceList.map((facility, index) => (
                                    <div key={index} className="feature-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`conference_${index}`}
                                            onChange={(e) => handleKeyFeaturesCheckboxChange(e, facility, 'Conference Facilities')}
                                        />
                                        <label htmlFor={`conference_${index}`}>{facility.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Rooftop Terrace
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="feature-checkbox-section">
                                {RooftopTerraceList.map((terrace, index) => (
                                    <div key={index} className="feature-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`rooftop_${index}`}
                                            onChange={(e) => handleKeyFeaturesCheckboxChange(e, terrace, 'Rooftop Terrace')}
                                        />
                                        <label htmlFor={`rooftop_${index}`}>{terrace.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Electric Vehicle Stations
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-100">
                                <div className="single-input">
                                    <label htmlFor="">Electric Vehicle Station Details</label>
                                    <textarea
                                        placeholder="Describe electric vehicle charging facilities"
                                        name="EvStationsInfo"
                                        onChange={handleCoolingInfoChange}
                                        value={EvStationsInfo}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Internet
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-100">
                                <div className="single-input">
                                    <label htmlFor="">Internet Information</label>
                                    <textarea
                                        placeholder="Describe internet connectivity and speeds"
                                        name="InternetInfo"
                                        onChange={handleCoolingInfoChange}
                                        value={InternetInfo}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Barbecue Grills
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-100">
                                <div className="single-input">
                                    <label htmlFor="">Barbecue Grill Details</label>
                                    <textarea
                                        placeholder="Describe barbecue and grilling facilities"
                                        name="BarbecueInfo"
                                        onChange={handleCoolingInfoChange}
                                        value={BarbecueInfo}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Security Features
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="feature-checkbox-section">
                                {SecurityFeaturesList.map((security, index) => (
                                    <div key={index} className="feature-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`security_${index}`}
                                            onChange={(e) => handleKeyFeaturesCheckboxChange(e, security, 'Security Features')}
                                        />
                                        <label htmlFor={`security_${index}`}>{security.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Underground Water System
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="form-inner-flex-100">
                                <div className="single-input">
                                    <label htmlFor="">Underground Water System Details</label>
                                    <textarea
                                        placeholder="Describe underground water system and facilities"
                                        name="WaterSysInfo"
                                        onChange={handleCoolingInfoChange}
                                        value={WaterSysInfo}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="property-form-title">
                            <h5>
                                Property Pictures
                                <span>
                                    <SvgCheckIcon />
                                </span>
                            </h5>
                            <em>
                                <SvgArrowRightIcon />
                            </em>
                        </div>
                        <div className="form-flex">
                            <div className="property-image-upload-section">
                                {Array.from({ length: slots }, (_, index) => (
                                    <div key={index} className="property-image-upload">
                                        {images[index] ? (
                                            <img src={images[index]} alt={`Property ${index + 1}`} />
                                        ) : (
                                            <div className="upload-placeholder">
                                                <span>Upload Image {index + 1}</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, index)}
                                            style={{ display: 'none' }}
                                            id={`file-input-${index}`}
                                        />
                                        <label htmlFor={`file-input-${index}`} className="upload-btn">
                                            Choose File
                                        </label>
                                    </div>
                                ))}
                                <button type="button" onClick={addSlot} className="add-more-btn">
                                    Add More Images
                                </button>
                            </div>
                        </div>

                        <div className="property-form-submit">
                            <button
                                type="button"
                                onClick={NextPage}
                                className="submit-btn"
                                disabled={Loading}
                            >
                                {Loading ? 'Processing...' : 'Next: Choose Promotion'}
                                <SvgLongArrowIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PropertyListForm;
