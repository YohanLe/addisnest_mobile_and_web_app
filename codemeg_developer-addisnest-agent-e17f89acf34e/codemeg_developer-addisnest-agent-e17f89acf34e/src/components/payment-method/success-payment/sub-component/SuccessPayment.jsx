import React from "react";
import { Link } from "react-router-dom";
import { SvgCheckCircleIcon, SvgLongArrowIcon } from "../../../../assets/svg/Svg";

const SuccessPayment = () => {
    return (
        <div className="success-payment-section">
            <div className="container">
                <div className="progressbar-main">
                    <ul>
                        <li>
                            <div className="progress-step active">
                                <span></span>
                                <p>Choose Promotion</p>
                            </div>
                        </li>
                        <li>
                            <div className="progress-step active">
                                <span></span>
                                <p>Make Payment</p>
                            </div>
                        </li>
                        <li>
                            <div className="progress-step done">
                                <span></span>
                                <p>Confirmation</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="pymt-succes-icon">
                            <SvgCheckCircleIcon />
                        </div>
                        <div className="pymet-success-title">
                            <h3>Thanks for your payment</h3>
                            <p>Congratulations!! Your Ad is now live</p>
                        </div>
                        <div className="pymt-success-btn">
                            <Link to="/property-list" className="btn ">
                                View Listing
                                <span>
                                    <SvgLongArrowIcon />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPayment;
