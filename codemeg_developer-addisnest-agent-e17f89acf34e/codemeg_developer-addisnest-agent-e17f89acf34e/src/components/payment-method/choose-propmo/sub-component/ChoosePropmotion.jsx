import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SvgCheckBigIcon } from "../../../../assets/svg/Svg";
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
    const [inputData, setInputData] = useState({ promo_code: "" });

    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const handleActiveClick = (data) => {
        setActivePlan(data);
        setPlanPrice(data.price);
    };

    const handleInputChange = (event) => {
        setInputData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
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
            let Newfeacture = [
                {
                    type: "kitchen_information",
                    value: settypeandvalue(state?.AllData?.kitchen_information)
                },
                {
                    type: 'security_features',
                    value: settypeandvalue(state?.AllData?.security_features)
                },
                {
                    type: 'parking',
                    value: settypeandvalue(state?.AllData?.parking),
                },
                {
                    type: 'laundr_facilities',
                    value: settypeandvalue(state?.AllData?.laundr_facilities),
                },
                {
                    type: 'rooftop_terrace',
                    value: settypeandvalue(state?.AllData?.rooftop_terrace)
                },
                {
                    type: 'conference_facilities',
                    value: settypeandvalue(state?.AllData?.conference_facilities)
                },
                {
                    type: 'underground_water_system',
                    value: state?.AllData?.underground_water_system
                },
                {
                    type: 'barbecue_grills',
                    value: state?.AllData?.barbecue_grills
                },
            ];

            let body = {
                latitude: state?.AllData?.lat,
                longitude: state?.AllData?.lng,
                address: state?.AllData?.property_address,
                status: 'ACTIVE',
                state: state?.AllData?.regional_state,
                city: state?.AllData?.city,
                country: state?.AllData?.country,
                propertyFor: state?.AllData?.property_for,
                price: state?.AllData?.total_price,
                description: state?.AllData?.description,
                property_type: state?.AllData?.property_type?.value,
                readiness: state?.AllData?.property_readiness,
                property_size: state?.AllData?.property_size,
                condition: state?.AllData?.condition?.value,
                furnishing: state?.AllData?.furnishing?.value,
                bathroom_information: state?.AllData?.special_bathroom_features,
                planType: data?.PlanData?.type,
                activeDay: data?.PlanData?.activeDay || 0,
                images: state?.AllData?.media_paths,
                features: Newfeacture,
                cooling_information: {
                    type: 'Central AC',
                    value: state?.AllData?.cooling_information,
                },
                interior: {
                    type: 'interior',
                    value: state?.AllData?.interior
                },
                heating_information: {
                    type: 'Has Heating',
                    value: state?.AllData?.heating_information,
                }
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
            BasicPlan: inputData.promo_code,
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
