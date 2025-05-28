import React, { useEffect, useState } from "react";
import {
    SvgActionViewIcon,
    SvgAmenitiesIcon,
    SvgArrowLeftIcon,
    SvgArrowRightIcon,
    SvgBackIcon,
    SvgBounder,
    SvgBulding,
    SvgBusinessIcon,
    SvgCarParking,
    SvgClock,
    SvgFillArrowIcon,
    SvgFinanceIcon,
    SvgHouse,
    SvgInteriorIcon,
    SvgLocationDetailIcon,
    SvgLocationIcon,
    SvgOnSiteIcon,
    SvgParkingIcon,
    SvgPublicIcon,
    SvgRating,
    SvgReport,
    SvgSecurityIcon,
    SvgSquare,
    SvgThermom,
    SvgUtilitiesIcon,
    SvgVideoTourIcon,
} from "../../../assets/svg-files/SvgFiles";
import { Link, useNavigate } from "react-router-dom";
import {
    LogoIcon,
    ProfileImg,
    PropertyImage1,
    PropertyImage2,
    PropertyImage3,
    PropertyImage4,
} from "../../../assets/images";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import Api from "../../../Apis/Api";
import { GetHomeData } from "../../../Redux-store/Slices/HomeSlice";
import moment from 'moment'
import LogInpopup from "../../../helper/LogInpopup";

const getWeeksInMonth = (year, month) => {
    const weeks = [];
    let date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        let week = [];

        for (let i = 0; i < 7; i++) {
            if (date.getMonth() === month) {
                week.push({
                    day: date.toLocaleDateString("en-US", { weekday: "short" }),
                    date: date.getDate(), // 1, 2, 3, ...
                    fulldate: date.toLocaleDateString("en-GB"),
                    month: date.toLocaleDateString("en-US", { month: "short" })
                });
                date.setDate(date.getDate() + 1);
            }
        }

        weeks.push(week);
    }

    return weeks;
};

const MakeFormat = (data) => {
    if (!data) return "Invalid date";

    const date = new Date(data?.createdAt || data);
    if (isNaN(date)) return "Invalid date";

    return formatDistanceToNow(date, { addSuffix: true });
};

const PropertyDetail = ({ PropertyDetails }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("on-site");
    const [activeSection, setActiveSection] = useState(null);
    const Featurelist = PropertyDetails?.features
    const [Loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [viewCount, setViewCount] = useState(PropertyDetails?.views || 0);
    const [showLoginPopup, setShowLoginPopup] = useState(false);


    const today = new Date();
    const [year, month] = [today.getFullYear(), today.getMonth()];
    const [weeks, setWeeks] = useState([]);
    const [selectedTime, setSelectedTime] = useState("00:00 AM");

    const [InputData, setInputData] = useState({
        comment: "",
    });
    const [activeIndex, setActiveIndex] = useState(null);
    const handleClick = (index) => {
        setActiveIndex(index);
    };

    const featureMapping = {
        kitchen_information: "Interior",
        security_features: "Security",
        parking: "Parking",
        laundr_facilities: "Utilities",
        rooftop_terrace: "Amenities",
        conference_facilities: "Business",
        underground_water_system: "Utilities",
        barbecue_grills: "Amenities"
    };
    const groupedFeatures = Featurelist?.reduce((acc, feature) => {
        const sectionTitle = featureMapping[feature.type] || "Other";
        if (!acc[sectionTitle]) {
            acc[sectionTitle] = [];
        }

        acc[sectionTitle].push(feature);
        return acc;
    }, {});

    const sections = [
        { title: "Interior", icon: <SvgInteriorIcon /> },
        { title: "Security", icon: <SvgSecurityIcon /> },
        { title: "Parking", icon: <SvgParkingIcon /> },
        { title: "Utilities", icon: <SvgUtilitiesIcon /> },
        { title: "Amenities", icon: <SvgAmenitiesIcon /> },
        { title: "Business", icon: <SvgBusinessIcon /> }
    ];

    const dates = [
        { day: "Mon", date: 14, month: "Nov" },
        { day: "Tue", date: 15, month: "Nov" },
        { day: "Wed", date: 16, month: "Nov" },
        { day: "Thu", date: 17, month: "Nov" },
    ];

    const toggleSection = (section) => {
        setActiveSection((prevSection) =>
            prevSection === section ? null : section
        );
    };

    const handleInputChange = (event) => {
        setInputData((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
        setIsValid(event.target.value);
    };


    const SendCommentFun = async () => {
        if (InputData.comment == '') {
            setIsValid(false)
        } else if (isValid) {
            let body = {
                propertyId:PropertyDetails?.id,
                agentId:PropertyDetails?.user?.id,
                comment: InputData.comment,
            }
            try {
                setLoading(true)
                const response = await Api.postWithtoken("send-comment", body);
                const { data, status, message } = response;
                setLoading(false)
                setInputData({
                    comment: "",
                });
                toast.success(message);
            } catch (error) {
                setLoading(false)
                toast.error(error.response.data.message);
            }
        }
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('access_token');
        const isLogin = localStorage.getItem('isLogin');
        return token && isLogin === '1';
    };

    // Handle login popup close and successful login
    const handleLoginSuccess = () => {
        setShowLoginPopup(false);
        // After successful login, navigate to property listing form
        toast.success("Login successful! Redirecting to property listing form...");
        setTimeout(() => {
            navigate('/property-form');
        }, 1500);
    };

    // Main function for "Post Ad Like This" button
    const handlePostAdLikeThis = () => {
        if (!isAuthenticated()) {
            // User is not logged in, show login popup
            setShowLoginPopup(true);
        } else {
            // User is logged in, navigate directly to property listing form
            toast.info("Redirecting to property listing form...");
            navigate('/property-form');
        }
    };

    const WishlistAddFun = async () => {
        let body = {
            propertyId: PropertyDetails?.id,
        };
        try {
            const response = await Api.postWithtoken("wishlist/add-remove", body);
            const { user, message, data, token } = response;
            toast.success(message);
        } catch (error) {
            console.log('error', error)
        }
    }

    const ScheduleVigitFun = async () => {
        if(activeIndex?.data.fulldate=='Invalid date' || activeIndex?.data.fulldate==undefined){
            toast.error('Please Select Date');
        }else if(selectedTime==''){
            toast.error('Please select time');
        }
        else{
        let body = {
            propertyId: PropertyDetails?.id,
            visitType: activeTab,
            date: moment(activeIndex?.data.fulldate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            time: selectedTime,
            status: 'scheduled',
        };
        try {
            const response = await Api.postWithtoken("properties/property-visit", body);
            const { user, message, data, token } = response;
            toast.success(message);
        } catch (error) {
            console.log('error', error)
        }
    }
    }

    // Function to increment view count
    const incrementViewCount = async () => {
        try {
            const response = await Api.postWithtoken("properties/increment-view", {
                propertyId: PropertyDetails?.id
            });
            if (response.success) {
                setViewCount(prev => prev + 1);
            }
        } catch (error) {
            console.log('Error incrementing view count:', error);
            // Still increment locally even if API fails
            setViewCount(prev => prev + 1);
        }
    };

    useEffect(() => {
        setWeeks(getWeeksInMonth(year, month));
    }, [year, month]);

    // Increment view count when component mounts
    useEffect(() => {
        if (PropertyDetails?.id) {
            incrementViewCount();
        }
    }, [PropertyDetails?.id]);

    const handleDateClick = (data, weekIndex, dayIndex) => {
        setActiveIndex({ data, weekIndex, dayIndex });
    };

    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };



    return (
        <>
            <div className="propertysec-detail-main">
                <div className="propertydetail-top">
                    <div className="container">
                        <div className="propertydetail-tp-inner">
                            <div className="property-detailleft">
                                <div className="back-btn">
                                    <span>
                                        <SvgBackIcon />
                                        Back
                                    </span>
                                </div>
                                <div className="propertysec-detail-nav">
                                    <ul>
                                        <li>
                                            <Link to="#">Overview</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Property Details</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Payment Calc.</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Agent</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="property-detailright">
                                <div className="propertyrght-title">
                                    <h3>ETB {PropertyDetails?.price}</h3>
                                    <p>{PropertyDetails?.address} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="property-detail-inner">
                        <div className="property-img-list">
                            <div className="main-flex">
                                <div className="inner-flex-50">
                                    <div className="property-image prpty-img1">
                                        <span
                                            style={{ backgroundImage: `url(${PropertyDetails?.media[0]})` }}
                                        ></span>
                                    </div>
                                </div>
                                <div className="inner-flex-50">
                                    {PropertyDetails?.media[1] &&
                                        <div className="property-image prpty-img2">
                                            <span
                                                style={{ backgroundImage: `url(${PropertyDetails?.media[1]})` }}
                                            ></span>
                                        </div>
                                    }
                                    <div className="main-flex mt-20">
                                        {PropertyDetails?.media[2] &&
                                            <div className="inner-flex-50">
                                                <div className="property-image prpty-img3">
                                                    <span
                                                        style={{ backgroundImage: `url(${PropertyDetails?.media[2]})` }}
                                                    ></span>
                                                </div>
                                            </div>
                                        }
                                        {PropertyDetails?.media[3] &&
                                            <div className="inner-flex-50">
                                                <div className="property-image prpty-img3">
                                                    <span
                                                        style={{ backgroundImage: `url(${PropertyDetails?.media[3]})` }}
                                                    ></span>
                                                </div>
                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="property-img-list">
                            <div className="main-flex">
                                {PropertyDetails?.media.map((imageUrl, index) => (
                                    <div key={index} className="inner-flex-50">
                                        <div className={`property-image prpty-img${index + 1}`}>
                                            <span
                                                style={{ backgroundImage: `url(${imageUrl})` }}
                                            ></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                        <div className="property-locationdetail">
                            <div className="main-flex">
                                <div className="inner-flex-60">
                                    <div className="property-detail-status">
                                        <div className="house-status">
                                            <span className="text-title">{PropertyDetails?.propertyFor}</span>
                                            <span className="badge success-badge f-12 dot-icon">
                                                Active
                                            </span>
                                        </div>
                                        <div className="posted-status">
                                            <SvgClock />
                                            <p>
                                                Posted <span>{MakeFormat(PropertyDetails?.createdAt)}</span>
                                            </p>
                                        </div>
                                        <div className="posted-status">
                                            <SvgActionViewIcon />
                                            <p>{viewCount} views</p>
                                        </div>
                                    </div>
                                    <div className="prpty-content-inner">
                                        <div className="prpty-content-heading">
                                            <h3>ETB {PropertyDetails?.price}</h3>
                                            <div className="prptey-loction">
                                                <div className="prpty-loction-adress">
                                                    <span>
                                                        <SvgLocationIcon />
                                                    </span>
                                                    <p>
                                                        {PropertyDetails?.address}
                                                        {/* <span> Illinois {PropertyDetails?.zipcode} </span> */}
                                                    </p>
                                                </div>
                                                <div className="prptey-fecility">
                                                    <span>3 bed</span>
                                                    <span>
                                                        <em></em>{PropertyDetails?.bathroom_information?.length} bath
                                                    </span>
                                                    <span>
                                                        <em></em>{PropertyDetails?.property_size}
                                                        {/* sqm (on 1.95 acres) */}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="propty-desc-detl">
                                                <p>
                                                    {PropertyDetails?.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="proptydetil-abt-main">
                                        <div className="proptydetail-abtheading">
                                            <h5>About Place</h5>
                                        </div>
                                        <ul>
                                            <li>
                                                <div className="abt-inner-list">
                                                    <span>
                                                        <SvgClock />
                                                    </span>
                                                    <p>Posted {MakeFormat(PropertyDetails?.createdAt)}</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="abt-inner-list">
                                                    <span>
                                                        <SvgHouse />
                                                    </span>
                                                    <p>{PropertyDetails?.property_type?.value || PropertyDetails?.property_type?.label || PropertyDetails?.property_type}</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="abt-inner-list">
                                                    <span>
                                                        <SvgSquare />
                                                    </span>
                                                    <p>{PropertyDetails?.property_size} sqft</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="inner-flex-40">
                                    <div className="safety-main">
                                        <div className="card">
                                            <div className="post-like">
                                                <button onClick={handlePostAdLikeThis} className="btn btn-primary">
                                                    Post Ad Like This
                                                </button>
                                            </div>
                                            <div className="card-body">
                                                <div className="unavailable-btn">
                                                    <button className="btn btn-info">
                                                        Mark Unavailable
                                                    </button>
                                                </div>
                                                <div className="report-btn">
                                                    <button className="btn btn-danger">
                                                        <span>
                                                            <SvgReport />
                                                        </span>
                                                        Report Abuse
                                                    </button>
                                                </div>
                                                <div className="safety-tips">
                                                    <div className="saftery-tips-heading">
                                                        <h3>Safety Tips</h3>
                                                    </div>
                                                    <p>It’s safer not to pay ahead for inspections</p>
                                                    <p>
                                                        Ask friends or somebody you trust to accompany you
                                                        for viewing.
                                                    </p>
                                                    <p>
                                                        Look around the apartment to ensure it meets your
                                                        expectations
                                                    </p>
                                                    <p>
                                                        Don’t pay before hand if they won’t let you move in
                                                        immediately
                                                    </p>
                                                    <p>
                                                        Verify that the account details belong to the right
                                                        property owner before initiating payment
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="property-agent-main">
                            <div className="main-flex">
                                <div className="inner-flex-30">
                                    <div className="property-agent-profile">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="agent-profile-main">
                                                    <div className="agent-profile-img">
                                                        <span
                                                            style={{ backgroundImage: `url(${PropertyDetails?.user?.profile_img})` }}
                                                        >
                                                            <img src={LogoIcon} alt="" />
                                                        </span>
                                                    </div>
                                                    <div className="profile-agent-title">
                                                        <p>Addisnest Agent</p>
                                                        <h3>{PropertyDetails?.user?.name}</h3>
                                                        <span>
                                                            <SvgRating />
                                                            4.5
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="inner-flex-70">
                                    <div className="agent-description">
                                        <div className="agent-experience-list">
                                            <ul>
                                                <li>
                                                    <div className="agent-experience-title">
                                                        <h3>
                                                            <span>6+</span>Experience
                                                        </h3>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="agent-experience-title">
                                                        <h3>
                                                            <span>15+</span>Total sales closed
                                                        </h3>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="agent-experience-title">
                                                        <h3>
                                                            <span>ETB 65M+</span>Sales volume
                                                        </h3>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="agent-peragh">
                                            <p>
                                                Experienced in the Addisnest market, Polar Denis is
                                                dedicated to making your buying or selling journey
                                                seamless and successful.
                                            </p>
                                        </div>
                                        <div className="agent-experience-filed">
                                            <h4>Still have questions? Message the Host</h4>
                                            <textarea
                                                type="text"
                                                cols={4}
                                                rows={3}
                                                name="comment"
                                                placeholder="write here"
                                                value={InputData?.comment}
                                                onChange={handleInputChange}
                                                className={`form-control ${!isValid == true ? "alert-input" : ""}`}
                                            />
                                            {!isValid && <p style={{ color: 'red' }}>Please enter Discription</p>}
                                        </div>
                                        <div className="agent-experience-btn">
                                            <button onClick={SendCommentFun} className="btn btn-secondary">
                                                Message Agent
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="visiting-field">
                            <div className="card">
                                <div className="card-body">
                                    <div className="visiting-field-main">
                                        <div className="visiting-field-title">
                                            <h3>Find Your Perfect Time to Visit</h3>
                                        </div>
                                        <div className="main-flex">
                                            <div className="inner-flex-50">
                                                <div className="tour-all-main">
                                                    <div className="tour-type-main">
                                                        <h5>Select Tour Type</h5>
                                                        <div className="tour-select">
                                                            <span
                                                                className={
                                                                    activeTab === "on-site" ? "active" : ""
                                                                }
                                                                onClick={() => setActiveTab("on-site")}
                                                            >
                                                                <em>
                                                                    <SvgOnSiteIcon />
                                                                </em>
                                                                On-Site
                                                            </span>

                                                            <span
                                                                className={
                                                                    activeTab === "video-tour" ? "active" : ""
                                                                }
                                                                onClick={() => setActiveTab("video-tour")}
                                                            >
                                                                <em>
                                                                    <SvgVideoTourIcon />
                                                                </em>
                                                                Video Tour
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="tour-type-main">
                                                        <h5>Select Date</h5>
                                                        <div className="tour-date-main">
                                                            <div className="left-arrow">
                                                                <span>
                                                                    <SvgArrowLeftIcon />
                                                                </span>
                                                            </div>
                                                            <ul>
                                                                {dates.map((item, index) => (
                                                                    <li
                                                                        key={index}
                                                                        onClick={() => handleClick(index)}
                                                                    >
                                                                        <div
                                                                            className={`tour-dateinner ${activeIndex === index ? "active" : ""
                                                                                }`}
                                                                        >
                                                                            <div className="tour-date-desp">
                                                                                <p>{item.day}</p>
                                                                                <h5>{item.date}</h5>
                                                                                <span>{item.month}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <div className="left-arrow right-arrow">
                                                                <span>
                                                                    <SvgArrowRightIcon />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="tour-type-main">
                                                        <h5>Select Time</h5>
                                                        <div className="tour-time">
                                                            <span>
                                                                <SvgClock />
                                                            </span>
                                                            <div className="time-tour-title">
                                                                <p>Set time</p>
                                                                <h4>00:00 AM</h4>
                                                            </div>
                                                            <em>
                                                                <SvgBackIcon />
                                                            </em>
                                                        </div>
                                                    </div>
                                                    <div className="tour-type-btn">
                                                        <button onClick={ScheduleVigitFun} className="btn btn-primary">
                                                            Schedule Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="inner-flex-50"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="visiting-field">
                            <div className="card">
                                <div className="card-body">
                                    <div className="visiting-field-main">
                                        <div className="visiting-field-title">
                                            <h3>Find Your Perfect Time to Visit</h3>
                                        </div>
                                        <div className="main-flex">
                                            <div className="inner-flex-100">
                                                <div className="tour-all-main">
                                                    {/* Select Tour Type */}
                                                    <div className="tour-type-main">
                                                        <h5>Select Tour Type</h5>
                                                        <div className="tour-select">
                                                            <span
                                                                className={activeTab === "on-site" ? "active" : ""}
                                                                onClick={() => setActiveTab("on-site")}
                                                            >
                                                                <em><SvgOnSiteIcon /></em> On-Site
                                                            </span>
                                                            <span
                                                                className={activeTab === "video-tour" ? "active" : ""}
                                                                onClick={() => setActiveTab("video-tour")}
                                                            >
                                                                <em><SvgVideoTourIcon /></em> Video Tour
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Select Date (Weekly View) */}
                                                    <div className="tour-type-main">
                                                        <h5>Select Date</h5>
                                                        <div className="tour-date-main">
                                                            {weeks.map((week, weekIndex) => (
                                                                <div key={weekIndex} className="week-container">
                                                                    <ul>
                                                                        {week.map((item, dayIndex) => (
                                                                            <li key={dayIndex} onClick={() => handleDateClick(item, weekIndex, dayIndex)}>
                                                                                <div
                                                                                    className={`tour-dateinner ${activeIndex?.weekIndex === weekIndex &&
                                                                                            activeIndex?.dayIndex === dayIndex ? "active" : ""
                                                                                        }`}
                                                                                >
                                                                                    <div className="tour-date-desp">
                                                                                        <p>{item.day}</p>
                                                                                        <h5>{item.date}</h5>
                                                                                        <span>{item.month}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Select Time */}
                                                    <div className="tour-type-main">
                                                        <h5>Select Time</h5>
                                                        <div className="tour-time">
                                                            <span><SvgClock /></span>
                                                            <div className="time-tour-title">
                                                                <p>Set time</p>
                                                                <input type="time" value={selectedTime} onChange={handleTimeChange} />
                                                            </div>
                                                            {/* <em><SvgBackIcon /></em> */}
                                                        </div>
                                                    </div>

                                                    {/* Schedule Button */}
                                                    <div className="tour-type-btn">
                                                        <button onClick={ScheduleVigitFun} className="btn btn-primary">
                                                            Schedule Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="inner-flex-50"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="property-facilities-main">
                            <div className="property-facilitis-title">
                                <h3>Property Details</h3>
                            </div>

                            {/* {[
                                {
                                    title: "Interior",
                                    icon: <SvgInteriorIcon />,
                                    details: (
                                        <>
                                            <div className="prpty-fclislist-descrp">
                                                <h3>Bedrooms & bathrooms</h3>
                                                <ul>
                                                    <li>
                                                        <div className="prpty-fclislist-info">
                                                            <span>
                                                                <SvgFillArrowIcon />
                                                            </span>
                                                            <p>Bedrooms Total: 4</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="prpty-fclislist-info">
                                                            <span>
                                                                <SvgFillArrowIcon />
                                                            </span>
                                                            <p>Upper Level Bedrooms: 3</p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="prpty-fclislist-descrp">
                                                <h3>Interior Features</h3>
                                                <ul>
                                                    <li>
                                                        <div className="prpty-fclislist-info">
                                                            <span>
                                                                <SvgFillArrowIcon />
                                                            </span>
                                                            <p>
                                                                Appliances: Dishwasher, Dryer, Disposal,
                                                                Freezer, Microwave, Oven, Range, Refrigerator
                                                            </p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </>
                                    ),
                                },
                                {
                                    title: "Financial",
                                    icon: <SvgFinanceIcon />,
                                    details: (
                                        <div className="prpty-fclislist-descrp">
                                            <h3>Financial Information</h3>
                                            <ul>
                                                <li>
                                                    <div className="prpty-fclislist-info">
                                                        <span>
                                                            <SvgFillArrowIcon />
                                                        </span>
                                                        <p>Property Taxes: $5000/year</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    ),
                                },
                                {
                                    title: "Utilities",
                                    icon: <SvgUtilitiesIcon />,
                                    details: (
                                        <div className="prpty-fclislist-descrp">
                                            <h3>Utilities Information</h3>
                                            <ul>
                                                <li>
                                                    <div className="prpty-fclislist-info">
                                                        <span>
                                                            <SvgFillArrowIcon />
                                                        </span>
                                                        <p>Water: Public</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    ),
                                },
                            ].map((section, index) => (
                                <div key={index} className="property-facilitis-list">
                                    <div
                                        className="prpty-fclislist-tiltle"
                                        onClick={() => toggleSection(section.title)}
                                    >
                                        <h3>
                                            <span>{section.icon}</span>
                                            {section.title}
                                        </h3>
                                        <SvgArrowRightIcon />
                                    </div>
                                    {activeSection === section.title && section.details}
                                </div>
                            ))} */}

                            {sections.map((section, index) => (
                                <div key={index} className="property-facilitis-list">
                                    <div
                                        className="prpty-fclislist-tiltle"
                                        onClick={() => toggleSection(section.title)}
                                    >
                                        <h3>
                                            <span>{section.icon}</span>
                                            {section.title}
                                        </h3>
                                        <SvgArrowRightIcon />
                                    </div>

                                    {activeSection === section.title && groupedFeatures[section.title]?.length > 0 && (
                                        <div className="prpty-fclislist-descrp">
                                            <h3>{section.title} Features</h3>
                                            <ul>
                                                {groupedFeatures[section.title].map((feature, i) => (
                                                    feature.value ? (  // Only display if value exists
                                                        <li key={feature.id || i}>
                                                            <div className="prpty-fclislist-info">
                                                                <span><SvgFillArrowIcon /></span>
                                                                <p>
                                                                    {feature.value.split(",").map((val, idx) => (
                                                                        <span key={idx}>{val.trim()}{idx < feature.value.split(",").length - 1 ? ", " : ""}</span>
                                                                    ))}
                                                                </p>
                                                            </div>
                                                        </li>
                                                    ) : null
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Login Popup */}
            {showLoginPopup && (
                <LogInpopup 
                    handlePopup={() => setShowLoginPopup(false)} 
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </>
    );
};

export default PropertyDetail;
