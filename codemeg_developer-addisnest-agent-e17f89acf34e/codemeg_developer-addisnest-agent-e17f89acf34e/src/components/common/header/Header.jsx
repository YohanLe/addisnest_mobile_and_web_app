import React from "react";
import ProfileDropdown from "../../../helper/ProfileDropdown";
import Notification from "../../../helper/Notification";
import { SvgSearchIcon } from "../../../assets/svg/Svg";
import LanguageDropdown from "../../../helper/LanguageDropdown";

function Header() {
    const addClass = () => {
        document.body.classList.toggle("open-sidebar");
    };
    const openNotifyPopup = () => {
        document.body.classList.toggle("show-notification-modal");
    };
    return (
        <>
            <header className="header">
                <div className="main-header">
                    <div className="hdrmenu-navicon-search">
                        <div className="navmenu-hdr">
                            <div class="navbar-icon" onClick={addClass}>
                                <span></span>
                            </div>
                        </div>
                        <div className="header-search-main">
                            <input type="text" placeholder="Search here..." />
                            <div className="srch-icon">
                                <SvgSearchIcon />
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <LanguageDropdown />
                        <ProfileDropdown />
                    </div>
                </div>
            </header>
            <Notification />
        </>
    );
}

export default Header;
