import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SvgCheckBigIcon } from "../../../../assets/svg-files/SvgFiles";
import { toast } from "react-toastify";
import Api from "../../../../Apis/Api";

const BasicPlan = [
    { id: 1, name: "Basic Plan", type: "Basic Plan", range: "Free", price: 0, activeDay: 0 },
];

const VipList = [
    { id: 1, name: "VIP",type:'VIP',  range: "15 Days",price:999 },
    { id: 2, name: "VIP",type:'VIP',  range: "28 Days",price:1999 },
];

const DiamondPlan = [
    { id: 1, name: "Diamond Plan",type:'Diamond Plan', range: "1 Month",price:1999 },
    { id: 2, name: "Diamond Plan",type:'Diamond Plan', range: "3 Month",price:4999 },
];

const ChoosePropmotion = () => {

    const [activePlan, setActivePlan] = useState(null);
    const [planPrice, setPlanPrice] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const handleActiveClick = (data) => {
        setActivePlan(data);
        setPlanPrice(data.price);
    };

    const settypeandvalue = (data) => {
        if (data && data.length > 0) {
            let newdata = data.map((item) => item?.value);
            return newdata.toString();
        } else {
            return '';
        }
    };

    const createPropertyForBasicPlan = async (data) => {
        try {
            // Convert amenities object to features array format
            let amenitiesFeatures = [];
            if (state?.AllData?.amenities) {
                Object.keys(state.AllData.amenities).forEach(key => {
                    if (state.AllData.amenities[key]) {
                        amenitiesFeatures.push({
                            type: key,
                            value: "true"
                        });
                    }
                });
            }

            let body = {
                latitude: state?.AllData?.lat || 0,
                longitude: state?.AllData?.lng || 0,
                address: state?.AllData?.property_address,
                status: 'ACTIVE',
                state: state?.AllData?.regional_state,
                city: state?.AllData?.city,
                country: state?.AllData?.country,
                propertyFor: state?.AllData?.property_for,
                price: state?.AllData?.total_price,
                description: state?.AllData?.description,
                property_type: state?.AllData?.property_type?.value || state?.AllData?.property_type?.label,
                property_size: state?.AllData?.property_size,
                condition: state?.AllData?.condition?.value || state?.AllData?.condition?.label,
                furnishing: state?.AllData?.furnishing?.value || state?.AllData?.furnishing?.label,
                bathroom_information: state?.AllData?.number_of_bathrooms,
                planType: data?.PlanData?.type,
                activeDay: data?.PlanData?.activeDay || 0,
                images: state?.AllData?.media_paths,
                features: amenitiesFeatures
            };

            console.log("Creating property with data:", body);
            const response = await Api.postWithtoken("properties/create", body);
            const { message } = response;
            toast.success(message);
            navigate("/success-payment", { state: { AllData: state?.AllData, BasicPlan: data } });
        } catch (error) {
            console.log("Error creating property:", error);
            console.log("Error response:", error?.response?.data);
            
            // Show more specific error message
            const errorMessage = error?.response?.data?.message || 
                               error?.response?.data?.detail || 
                               error?.message || 
                               "Failed to create property listing";
            toast.error(errorMessage);
        }
    };

    const nextPage = () => {
        if (!activePlan) {
            toast.warning("Please Select a Plan Type");
            return;
        }
        const data = {
            BasicPlan: null,
            PlanData: activePlan,
        };
        
        // If Basic Plan (free) is selected, create property and go to success
        if (activePlan.type === "Basic Plan" && activePlan.price === 0) {
            createPropertyForBasicPlan(data);
        } else {
            // For paid plans, go to payment page
            navigate("/payment", { state: { AllData: state?.AllData, BasicPlan: data } });
        }
    };

    return (
        <section className="common-section choosepropmotion-setion">
            <div className="container">
                <div className="choosepropmotion-main">
                    {/* Progress Bar */}
                    <div className="progressbar-main">
                        <ul>
                            <li>
                                <div className="progress-step done">
                                    <span></span>
                                    <p>Choose Promotion</p>
                                </div>
                            </li>
                            <li>
                                <div className="progress-step">
                                    <span></span>
                                    <p>Make Payment</p>
                                </div>
                            </li>
                            <li>
                                <div className="progress-step">
                                    <span></span>
                                    <p>Confirmation</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="choosepropmotion-inner">
                        <div className="card">
                            <div className="card-body">
                                <h3>Boost Your Property Listing</h3>
                                <p>Choose a promotion plan to attract more buyers or renters.</p>

                                {/* Basic Plan */}
                                <div 
                                    className="card" 
                                    style={{ 
                                        borderLeft: '4px solid #28a745', 
                                        backgroundColor: '#f8f9fa',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease-in-out'
                                    }}
                                    onClick={() => handleActiveClick(BasicPlan[0])}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    <div className="card-body">
                                        <h3 style={{ color: '#28a745' }}>Basic Plan - Free</h3>
                                        <div className="vipplan-days">
                                            {BasicPlan.map((item) => (
                                                <span
                                                    key={item.id}
                                                    className={activePlan?.range === item.range ? "active" : ""}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleActiveClick(item);
                                                    }}
                                                >
                                                    {item.range}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="free-icon"><span>Free</span></div>
                                    </div>
                                </div>

                                {/* VIP Plan */}
                                <div 
                                    className="card" 
                                    style={{ 
                                        borderLeft: '4px solid #ffc107', 
                                        backgroundColor: '#fffbf0',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease-in-out'
                                    }}
                                    onClick={() => handleActiveClick(VipList[0])}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    <div className="card-body">
                                        <h3 style={{ color: '#ffc107' }}>VIP Plan</h3>
                                        <p>Select Days</p>
                                        <div className="vipplan-days">
                                            {VipList.map((item) => (
                                                <span
                                                    key={item.id}
                                                    className={activePlan?.range === item.range ? "active" : ""}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleActiveClick(item);
                                                    }}
                                                >
                                                    {item.range}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Diamond Plan */}
                                <div 
                                    className="card" 
                                    style={{ 
                                        borderLeft: '4px solid #6f42c1', 
                                        backgroundColor: '#f8f7fc',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease-in-out'
                                    }}
                                    onClick={() => handleActiveClick(DiamondPlan[0])}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    <div className="card-body">
                                        <h3 style={{ color: '#6f42c1' }}>Diamond Plan / Top Spot</h3>
                                        <p>Select Days</p>
                                        <div className="vipplan-days">
                                            {DiamondPlan.map((item) => (
                                                <span
                                                    key={item.id}
                                                    className={activePlan?.range === item.range ? "active" : ""}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleActiveClick(item);
                                                    }}
                                                >
                                                    {item.range}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Plan Info & Payment Button */}
                                <div className="continue-with-main">
                                    <div className="continue-contant">
                                        <p>Continue with</p>
                                        <div className="continue-pymt">
                                            <span>{activePlan?.range || "No Plan Selected"}</span>
                                            <span>ETB {planPrice}</span>
                                        </div>
                                    </div>
                                    <div className="continue-btn">
                                        <button onClick={nextPage} className="btn btn-primary">
                                            {activePlan?.type === "Basic Plan" && activePlan?.price === 0 ? "Continue" : "Make Payment"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        </section>
    );
};

export default ChoosePropmotion;
