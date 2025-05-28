import React from "react";
import { FooterLogo, SocialApp1, SocialApp2 } from "../../../assets/images";
import {
    SvgFacebookIcon,
    SvgInstagramIcon,
    SvgLinkdinIcon,
    SvgWhatsAppIcon,
    SvgYoutubeIcon,
} from "../../../assets/svg-files/SvgFiles";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <>
            <footer>
                <div className="container">
                    <div className="top-footer">
                        <div className="top-ftr-main">
                            <div className="main-flex">
                                <div className="inner-flex-40">
                                    <div className="top-ftr-lft">
                                        <div className="tpftr-logo">
                                            <img src={FooterLogo} alt="" />
                                        </div>
                                        <p>
                                            Connecting you to the best properties across Ethiopia.
                                            Buy, sell, or rent with confidence and convenience.
                                        </p>
                                        <div className="tpftr-socail">
                                            <ul>
                                                <li>
                                                    <Link to="#" className="socail-icon">
                                                        <span>
                                                            <SvgFacebookIcon />
                                                        </span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="#" className="socail-icon">
                                                        <span>
                                                            <SvgWhatsAppIcon />
                                                        </span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="#" className="socail-icon">
                                                        <span>
                                                            <SvgInstagramIcon />
                                                        </span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="#" className="socail-icon">
                                                        <span>
                                                            <SvgLinkdinIcon />
                                                        </span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="#" className="socail-icon">
                                                        <span>
                                                            <SvgYoutubeIcon />
                                                        </span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="inner-flex-20">
                                    <div className="ftr-link-list">
                                        <h5>Addisnest</h5>
                                        <ul>
                                            <li>
                                                <Link to="/property-list">Buy a house</Link>
                                            </li>
                                            <li>
                                                <Link to="/my-list">Sell a house</Link>
                                            </li>
                                            <li>
                                                <Link to="/property-rent-list">Rent a house</Link>
                                            </li>
                                            <li>
                                                <Link to="/mortagage-calcuator">Mortgage</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="inner-flex-20">
                                    <div className="ftr-link-list">
                                        <h5>Quick Links</h5>
                                        <ul>
                                            <li>
                                                <Link to="#">About Us</Link>
                                            </li>
                                            <li>
                                                <Link to="/contact-us">Contact</Link>
                                            </li>
                                            <li>
                                                <Link to="#">Privacy Policy</Link>
                                            </li>
                                            <li>
                                                <Link to="#">Terms of Service</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="inner-flex-20">
                                    <div className="ftr-link-list">
                                        <h5>For Agents</h5>
                                        <ul>
                                            <li>
                                                <Link to="#">Join as an Agent</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-footer">
                        <div className="main-flex">
                            <div className="inner-flex-50">
                                <div className="bttm-ftr-lft">
                                    <h3>Download the App</h3>
                                    <p>
                                        Experience EthniNest on the go. Search properties, connect
                                        with agents, and manage your listings right from your
                                        mobile.
                                    </p>
                                </div>
                            </div>
                            <div className="inner-flex-50">
                                <div className="bttm-ftr-appstore">
                                    <Link to="#">
                                        <img src={SocialApp1} alt="" />
                                    </Link>
                                    <Link to="#">
                                        <img src={SocialApp2} alt="" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
