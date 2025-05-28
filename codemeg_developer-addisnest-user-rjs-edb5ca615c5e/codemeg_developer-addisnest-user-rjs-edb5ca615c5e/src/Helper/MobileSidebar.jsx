import React, { useState, useEffect } from "react";
import { Link, } from "react-router-dom";
import LogOutPopup from "./LogOutPopup";

const MobileSidebar = () => {
  const [showLogOutPopup, setLogOutPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogOutPopup = () => {
    setLogOutPopup((p) => !p);
  };

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLogin');
    setIsLoggedIn(loginStatus === '1');
  }, []);

  const removeClass = () => {
    document.body.classList.remove("open-sidebar");
  };
  return (
    <>
      <div className="sm-sidebar">
        <div className="sm-sidebar-inner">
          {/* <div className="sm-sidebar-header">
            <div className="pofile-image">
              <span
                className=""
                style={{
                  backgroundImage: `url(${Agent1})`,
                }}
              ></span>
            </div>
            <div className="prfl-dtls">
              <h3>Mu'adh Ward Kouri</h3>
              <p>ward@mail.com</p>
              <Link to="/my-account" onClick={removeClass}>
                Edit
              </Link>
            </div>
          </div> */}
          <div className="sm-sidebar-navigation">
            <nav>
              <ul>
                <li>
                  <Link
                    to="/"
                    className={location.pathname === "/" ? "active" : ""}
                    onClick={removeClass}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/property-list"
                    className={
                      location.pathname === "/property-list" ? "active" : ""
                    }
                    onClick={removeClass}
                  >
                    Buy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-list"
                    className={location.pathname === "/my-list" ? "active" : ""}
                    onClick={removeClass}
                  >
                    Sell
                  </Link>
                </li>
                <li>
                  <Link
                    to="/property-list"
                    className={
                      location.pathname === "/property-list" ? "active" : ""
                    }
                    onClick={removeClass}
                  >
                    Rent
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mortagage-calcuator"
                    className={
                      location.pathname === "/mortagage-calcuator"
                        ? "active"
                        : ""
                    }
                    onClick={removeClass}
                  >
                    Mortgage Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    to="/find-agent"
                    className={
                      location.pathname === "/find-agent" ? "active" : ""
                    }
                    onClick={removeClass}
                  >
                    Find Agent
                  </Link>
                </li>
                <li>
                  <Link
                    to="/chat"
                    className={location.pathname === "/chat" ? "active" : ""}
                    onClick={removeClass}
                  >
                    Message
                  </Link>
                </li>
                <li>
                  <Link
                    to="/notification"
                    className={
                      location.pathname === "/notification" ? "active" : ""
                    }
                    onClick={removeClass}
                  >
                    Notification
                  </Link>
                </li>
                <li>
                  <Link
                    to="/favorite"
                    className={
                      location.pathname === "/favorite" ? "active" : ""
                    }
                    onClick={removeClass}
                  >
                    Saved
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className={
                      location.pathname === "#" ? "active" : ""
                    }
                    // onClick={removeClass}
                  >
                    {isLoggedIn ? "My listing" : "Become an agent"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account-management"
                    className={
                      location.pathname === "/account-management" ? "active" : ""
                    }
                    onClick={removeClass}
                  >
                    Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help-support"
                    className={
                      location.pathname === "/help-support" ? "active" : ""
                    }
                    onClick={removeClass}
                  >
                    Help Centre
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact-us"
                    className={
                      location.pathname === "/contact-us" ? "active" : ""
                    }
                    onClick={removeClass}
                  >
                    Contact us
                  </Link>
                </li>
                <li>
                  <a
                    onClick={() => {
                      removeClass();
                      handleLogOutPopup();
                    }}
                  >
                    Log Out
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="close-menu" onClick={removeClass}>
            <span></span>
          </div>
        </div>
        <div className="overlay" onClick={removeClass}></div>
      </div>
      {showLogOutPopup && <LogOutPopup handlePopup={handleLogOutPopup} />}
    </>
  );
};

export default MobileSidebar;
