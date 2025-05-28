import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  SvgDeleteIcon,
  SvgEditPencelIcon,
  SvgSoldIcon,
} from "../assets/svg-files/SvgFiles";
import DeletePopup from "./DeletePopup";

const ActiveDropdown = () => {
  const [currentItem, setCurrentItem] = useState(null);
  const [position, setPosition] = useState("down"); // Track position of the dropdown (up or down)
  const kebabIconRef = useRef(null); // Ref for kebab-icon
  const dropdownRef = useRef(null); // Ref for the dropdown

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        kebabIconRef.current &&
        !kebabIconRef.current.contains(event.target)
      ) {
        setCurrentItem(null); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setCurrentItem((prev) => (prev === 0 ? null : 0)); // Toggle for single kebab-icon

    setTimeout(() => {
      if (kebabIconRef.current && dropdownRef.current) {
        const kebabRect = kebabIconRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const spaceBelow = window.innerHeight - kebabRect.bottom;
        const spaceAbove = kebabRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setPosition("up");
        } else {
          setPosition("down");
        }
      }
    }, 0); // Wait for DOM to update
  };
  const [showDeletePopup, setDeletePopup] = useState(false);
  const handleDeletePopup = () => {
    setDeletePopup((prev) => !prev);
  };
  return (
    <div className="kebab-main">
      <div className="kebab-icon" ref={kebabIconRef}>
        <span onClick={toggleDropdown}>
          Action
          <svg
            width="11"
            height="7"
            viewBox="0 0 11 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 1.5L5.5 5.5L1.5 1.5"
              stroke="#24292E"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
      {currentItem === 0 && (
        <div
          className={`kebab-dropdown ${position === "up" ? "open-up" : ""}`}
          ref={dropdownRef}
        >
          <ul>
            <li>
              <Link to="#">
                <span>
                  <SvgEditPencelIcon />
                </span>
                Edit
              </Link>
            </li>
            <li>
              <Link to="#" onClick={handleDeletePopup}>
                <span >
                  <SvgDeleteIcon />
                </span>
                Delete Post
              </Link>
            </li>
            <li>
              <Link to="#">
                <span>
                  <SvgSoldIcon />
                </span>
                Sold
              </Link>
            </li>
          </ul>
        </div>
      )}
      {showDeletePopup && <DeletePopup handlePopup={handleDeletePopup} />}
    </div>
  );
};

export default ActiveDropdown;
