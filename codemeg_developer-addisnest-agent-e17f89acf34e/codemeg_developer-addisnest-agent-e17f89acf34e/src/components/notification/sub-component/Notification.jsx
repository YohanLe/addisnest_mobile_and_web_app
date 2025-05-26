import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import { SvgCheckBigIcon, SvgCloseIcon, SvgNotifMenuIcon } from "../../../assets/svg/Svg";
import { useDispatch, useSelector } from "react-redux";
import { GetNotificationsList } from "../../../Redux-store/Slices/NotificationsListSlice";

const Notification = () => {
    const dispatch = useDispatch();
    const NotificationsData = useSelector((state) => state.NotificationsList.Data);
    const NotificationsList = NotificationsData?.data?.data;
    console.log('______________PPP',NotificationsList)
    useEffect(() => {
        dispatch(GetNotificationsList());
    }, [])


    return (
        <>
            <div className="notification-main">
                <div className="container">
                    <div className="notification-heading">
                        <h3>Notifications</h3>
                    </div>
                    <div className="notification-list">
                        <ul>
                            <li>
                                <div className="notif-detail">
                                    <div className="notifctn-descp-main">
                                        <div className="notifctn-desp-icon">
                                            <span>
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M11.0002 17L11.0002 14"
                                                        stroke="white"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                    />
                                                    <path
                                                        d="M1.35154 12.2135C0.998524 9.91624 0.822014 8.76763 1.25632 7.74938C1.69062 6.73112 2.65418 6.03443 4.58129 4.64106L6.02114 3.6C8.41844 1.86667 9.61709 1 11.0002 1C12.3832 1 13.5819 1.86667 15.9792 3.6L17.419 4.64106C19.3461 6.03443 20.3097 6.73112 20.744 7.74938C21.1783 8.76763 21.0018 9.91624 20.6488 12.2135L20.3477 14.1724C19.8473 17.4289 19.5971 19.0572 18.4292 20.0286C17.2612 21 15.5538 21 12.139 21H9.86134C6.44649 21 4.73906 21 3.57115 20.0286C2.40324 19.0572 2.15302 17.4289 1.65258 14.1724L1.35154 12.2135Z"
                                                        stroke="white"
                                                        stroke-width="2"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="notifctn-descp">
                                            <h3>Home Tour Scheduled</h3>
                                            <p>
                                                Your home tour is officially set for November 12, 2024,
                                                at 11:00 AM. Mark your calendar, and we’ll be ready to
                                                guide you through the property!{" "}
                                                <Link to="#"> Cancel Anytime</Link>
                                            </p>
                                            <span>5 hrs ago</span>
                                        </div>
                                    </div>
                                    <div className="notifctn-close-icon">
                                        <span>
                                            <SvgCloseIcon />
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="notif-detail">
                                    <div className="notifctn-descp-main">
                                        <div className="notifctn-desp-icon green-bg">
                                            <span>
                                                <SvgCheckBigIcon />
                                            </span>
                                        </div>
                                        <div className="notifctn-descp">
                                            <h3>Pre-Approval Complete</h3>
                                            <p>
                                                <span>Congratulations!</span> Your pre-approval for this
                                                property is complete, giving you a head start in the
                                                buying process. Explore your next steps to secure this
                                                home
                                            </p>
                                            <span>5 hrs ago</span>
                                        </div>
                                    </div>
                                    <div className="notifctn-close-icon">
                                        <span>
                                            <SvgCloseIcon />
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="notif-detail">
                                    <div className="notifctn-descp-main">
                                        <div className="notifctn-desp-icon gray-bg">
                                            <span>
                                                <SvgNotifMenuIcon />
                                            </span>
                                        </div>
                                        <div className="notifctn-descp">
                                            <h3> New Listings Within Your Budget</h3>
                                            <p>
                                                New opportunities await! We found fresh listings that
                                                fit your budget perfectly. Don’t miss out on these
                                                options tailored to your price range!
                                            </p>
                                            <span>5 hrs ago</span>
                                        </div>
                                    </div>
                                    <div className="notifctn-close-icon">
                                        <span>
                                            <SvgCloseIcon />
                                        </span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notification;
