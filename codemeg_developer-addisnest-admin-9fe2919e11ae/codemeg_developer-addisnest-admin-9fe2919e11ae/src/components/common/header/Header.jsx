import React from "react";
import ProfileDropdown from "../../../helper/ProfileDropdown";
import Notification from "../../../helper/Notification";
import { SvgBellIcon } from "../../../assets/svg/Svg";

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
          <div className="navmenu-hdr">
            <div class="navbar-icon" onClick={addClass}>
              <span></span>
            </div>
          </div>
          <div className="header-actions">
            <div className="notification-icon" onClick={openNotifyPopup}>
              <span>
                <SvgBellIcon />
              </span>
            </div>
            <ProfileDropdown />
          </div>
        </div>
      </header>
      <Notification />
    </>
  );
}

export default Header;
