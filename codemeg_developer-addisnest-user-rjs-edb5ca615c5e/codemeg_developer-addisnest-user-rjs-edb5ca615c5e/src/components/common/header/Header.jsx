import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BlackLogo, Logo } from "../../../assets/images";
import LogInpopup from "../../../Helper/LogInpopup";
import ProfileDropdown from "../../../Helper/ProfileDropdown";
import LanguageDropdown from "../../../Helper/LanguageDropdown";
import MobileSidebar from "../../../Helper/MobileSidebar";
import { SvgHeaderLogoutIcon } from "../../../assets/svg-files/SvgFiles";

function Header() {
    const location = useLocation();
    const [type, setUsetype] = useState("");
    const addClass = () => {
        document.body.classList.toggle("open-sidebar");
    };
    const removeClass = () => {
        document.body.classList.remove("open-sidebar");
    };
    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        let UserType = localStorage.getItem("UserType");
        setUsetype(UserType);
    }, []);

    const [showLogInpopup, setLogInpopup] = useState(false);
    const handleLogInpopupToggle = () => {
        setLogInpopup((prev) => !prev);
    };

    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        let isLogged=localStorage.getItem('isLogin')
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100); // Set to true if scrolled past 50px
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header className={isScrolled ? "scrolled" : ""}>
                <div className="container-fluid">
                    <div className="hdr-main hdr-onemain">
                        <div className="logo common-logo">
                            <Link to="/">
                                <img src={BlackLogo} alt="addisnest" />
                            </Link>
                        </div>
                        <div className="logo home-logo">
                            <Link to="/">
                                <img src={Logo} alt="addisnest" />
                            </Link>
                        </div>
                        <div className="hdr-navigation">
                            <nav>
                                <ul>
                                    <li>
                                        <Link
                                            to="/property-list"
                                            className={isActive("/property-list") ? "active" : ""}
                                        >
                                            Buy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/my-list"
                                            className={isActive("/my-list") ? "active" : ""}
                                        >
                                            Sell
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/property-rent-list"
                                            className={isActive("/property-rent-list") ? "active" : ""}
                                        >
                                            Rent
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/mortagage-calcuator"
                                            className={
                                                isActive("/mortagage-calcuator") ? "active" : ""
                                            }
                                        >
                                            Mortgage Calculator
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/find-agent"
                                            className={isActive("/find-agent") ? "active" : ""}
                                        >
                                            Find Agent
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                            <div className="close-menu" onClick={removeClass}>
                                <span></span>
                            </div>
                        </div>

                        <div className="nav-rght">
                            <LanguageDropdown />
                            {localStorage.getItem('isLogin')==='1'&&<ProfileDropdown />}
                         
                            {localStorage.getItem('isLogin')!='1'&&
                            <button
                                className="btn btn-primary"
                                onClick={handleLogInpopupToggle}
                            >
                                Login
                            </button>
                            }
                            
                            <span
                                className="logout-icon"
                                onClick={handleLogInpopupToggle}
                            >
                                <SvgHeaderLogoutIcon />
                            </span>
                            <div className="menu-icon" onClick={addClass}>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <MobileSidebar />
            {showLogInpopup && <LogInpopup handlePopup={handleLogInpopupToggle} />}
        </>
    );
}

export default Header;
