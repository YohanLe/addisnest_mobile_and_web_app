import React, { useEffect, useRef, useState } from "react";
import { SvgKebab } from "../assets/svg/Svg";
import { Link } from "react-router-dom";

const CommonDropdown = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const kebabRef = useRef(null);

  const actions = [
    { id: 1, label: "Client Info" },
    { id: 2, label: "Survey Setup", link: "/survey-setup" },
    { id: 3, label: "Campaign Template", link: "/campaign-management" },
    { id: 4, label: "Payment History", link: "/payment-list" },
    { id: 5, label: "Franchisee", link: "/franchies-list" },
    { id: 6, label: "Company Logo", link: "/company-logo" },
  ];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (kebabRef.current && !kebabRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="kebab-sec">
        <div className="kebab-wrapper" ref={kebabRef}>
          {/* Kebab Icon */}
          <div
            className="kebab-icon"
            onClick={() => setIsDropdownVisible((prev) => !prev)}
          >
            <span>
              <SvgKebab />
            </span>
          </div>

          {/* Dropdown Menu */}
          {isDropdownVisible && (
            <div className="kebab-dropdown">
              <ul>
                {actions.map((action) => (
                  <li key={action.id}>
                    <Link to={action.link} className="kebab-title">
                      <span>{action.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommonDropdown;
