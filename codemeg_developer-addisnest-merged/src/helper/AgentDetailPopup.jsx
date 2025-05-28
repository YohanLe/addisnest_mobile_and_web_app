import { Link } from "react-router-dom";
import { React, useEffect, useState } from "react";
import { Agent1, LogoIcon } from "../assets/images";
import {
    SvgCloseIcon,
    SvgLocationIcon,
    SvgMassageIcon,
    SvgPhoneIcon,
} from "../assets/svg-files/SvgFiles";
import ReviewSlider from "./ReviewSlider";
import FeedBackReviewPopup from "./FeedBackReviewPopup";
import PropertySlider from "./PropertySlider";
import { useDispatch, useSelector } from "react-redux";
import { GetAgentDetails } from "../Redux-store/Slices/AgentDetailsSlice";

const AgentDetailPopup = ({ handlePopup,ItemData }) => {
    const dispatch = useDispatch();
    const [ItemDatas, setItemData] = useState('');
    const [showFeedBackReviewPopup, setFeedBackReviewPopup] = useState(false);
    const AgentData = useSelector((state) => state.AgentDetails.data);
    const AgentDetails = AgentData?.data?.data;
    console.log('____________LL',AgentDetails)

    useEffect(() => {
        dispatch(GetAgentDetails({ id:ItemData?.id }));
    }, []);
    
    useEffect(() => {
       
    }, [AgentData]);

    const handleFeedBackReviewPopupToggle = () => {
        setFeedBackReviewPopup((prev) => !prev);
    };
    return (
        <>
            <div className="main-popup agent-detail">
                <div className="lm-outer">
                    <div className="lm-inner">
                        <div className="popup-inner">
                            <div className="card agnt-detail-main">
                                <div className="card-body">
                                    <div className="close-icon" onClick={handlePopup}>
                                        <SvgCloseIcon />
                                    </div>
                                    <div className="agntprofle-detail">
                                        <div className="main-flex">
                                            <div className="inner-flex-20">
                                                <div
                                                    className="agentimg"
                                                    style={{ backgroundImage: `url(${AgentDetails?.profile_img})` }}
                                                >
                                                    <span>
                                                        <img src={LogoIcon} alt="" />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="inner-flex-70">
                                                <div className="agent-info-main">
                                                    <div className="agnt-name-info">
                                                        <h3>{AgentDetails?.name}</h3>
                                                        <div className="agentcontect-dtl-list">
                                                            <div className="agntcontect-descp">
                                                                <p>
                                                                    <span>
                                                                        <SvgPhoneIcon />
                                                                    </span>
                                                                    {AgentDetails?.phone}
                                                                </p>
                                                                <p>
                                                                    <span>
                                                                        <SvgMassageIcon />
                                                                    </span>
                                                                    {AgentDetails?.email}
                                                                </p>
                                                            </div>
                                                            <div className="agnt-location">
                                                                <p>
                                                                    <span>
                                                                        <SvgLocationIcon />
                                                                    </span>
                                                                    {AgentDetails?.address}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="agntdetail-rating">
                                                        <ul>
                                                            <li>
                                                                <div className="agntdetail-inner-info">
                                                                    <div className="fidagent-rating">
                                                                        <span>
                                                                            <svg
                                                                                width="16"
                                                                                height="14"
                                                                                viewBox="0 0 16 14"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    d="M7.99994 11.5996L11.4583 13.6913C12.0916 14.0746 12.8666 13.508 12.6999 12.7913L11.7833 8.85797L14.8416 6.20798C15.3999 5.72464 15.0999 4.80798 14.3666 4.74964L10.3416 4.40798L8.76661 0.691309C8.48327 0.0163086 7.51661 0.0163086 7.23327 0.691309L5.65827 4.39964L1.63327 4.74131C0.899939 4.79964 0.599938 5.71631 1.15827 6.19964L4.21661 8.84964L3.29994 12.783C3.13327 13.4996 3.90827 14.0663 4.5416 13.683L7.99994 11.5996Z"
                                                                                    fill="#FFCC00"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                       {AgentDetails?.average_rating}
                                                                    </div>
                                                                    <p>{AgentDetails?.reviews?.length} Reviews</p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="agntdetail-inner-info">
                                                                    <h3>225</h3>
                                                                    <p>Total sales closed</p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="agntdetail-inner-info">
                                                                    <h3>ETB5614</h3>
                                                                    <p>Sales volume</p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="agntdetail-inner-info">
                                                                    <h3>{AgentDetails?.properties?.length}</h3>
                                                                    <p>Total Listing</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="agntpfle-about">
                                            <h3>About</h3>
                                            {AgentDetails?.about==undefined?
                                                <p>
                                                    N/A
                                                </p>:<p>
                                                    {AgentDetails?.about}
                                                </p>
                                            }
                                            <p>
                                               {AgentDetails?.about}
                                            </p>
                                        </div>
                                        {AgentDetails?.properties?.length>0 &&
                                            <div className="property-slider-main">
                                            <PropertySlider PropertyList={AgentDetails}/>
                                            </div>
                                        }
                                       
                                        <div className="testimonial-main">
                                            <div className="testimonial-title">
                                                <h3>Reviews</h3>
                                                <Link to="#" onClick={handleFeedBackReviewPopupToggle}>
                                                    Write a Review
                                                </Link>
                                            </div>
                                            {AgentDetails?.reviews?.length>0 &&
                                                <ReviewSlider ReviewList={AgentDetails?.reviews}/>
                                            }
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="popup-overlay" onClick={handlePopup}></div>
            </div>
            {showFeedBackReviewPopup && (
                <FeedBackReviewPopup handlePopup={handleFeedBackReviewPopupToggle} Data={AgentDetails}/>
            )}
        </>
    );
};

export default AgentDetailPopup;
