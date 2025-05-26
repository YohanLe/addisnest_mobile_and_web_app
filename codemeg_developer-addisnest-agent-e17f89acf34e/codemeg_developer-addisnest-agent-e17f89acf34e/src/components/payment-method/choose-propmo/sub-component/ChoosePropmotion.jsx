import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SvgCheckBigIcon } from "../../../../assets/svg/Svg";
import { toast } from "react-toastify";
import Api from "../../../../Apis/Api";

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

    const nextPage = () => {
        if (!activePlan) {
            toast.warning("Please Select a Plan Type");
            return;
        }
        const data = {
            BasicPlan: inputData.promo_code,
            PlanData: activePlan,
        };
        navigate("/payment", { state: { AllData: state?.AllData, BasicPlan: data } });
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
                                <div className="card">
                                    <div className="card-body">
                                        <h3>Basic Plan</h3>
                                        <div className="propmotion-field">
                                            <input
                                                type="text"
                                                name="promo_code"
                                                placeholder="Promo Code"
                                                value={inputData.promo_code}
                                                onChange={handleInputChange}
                                            />
                                            <span><SvgCheckBigIcon /></span>
                                        </div>
                                        <div className="free-icon"><span>Free</span></div>
                                    </div>
                                </div>

                                {/* VIP Plan */}
                                <div className="card">
                                    <div className="card-body">
                                        <h3>VIP Plan</h3>
                                        <p>Select Days</p>
                                        <div className="vipplan-days">
                                            {VipList.map((item) => (
                                                <span
                                                    key={item.id}
                                                    className={activePlan?.range === item.range ? "active" : ""}
                                                    onClick={() => handleActiveClick(item)}
                                                >
                                                    {item.range}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Diamond Plan */}
                                <div className="card">
                                    <div className="card-body">
                                        <h3>Diamond Plan / Top Spot</h3>
                                        <p>Select Days</p>
                                        <div className="vipplan-days">
                                            {DiamondPlan.map((item) => (
                                                <span
                                                    key={item.id}
                                                    className={activePlan?.range === item.range ? "active" : ""}
                                                    onClick={() => handleActiveClick(item)}
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
                                            Make Payment
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
