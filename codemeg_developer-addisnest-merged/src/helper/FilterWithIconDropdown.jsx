import React, { useEffect, useRef, useState } from "react";
import { SvgFilterIcon } from "../assets/svg-files/SvgFiles";

const FilterWithIconDropdown = ({
  options = [],
  initialTitle = "All Filter",
  dropdownKey = "defaultKey",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialTitle);
  const selectRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setShowDropdown(false);
  };

  return (
    <div className="filter-dropdown-withicon" ref={selectRef}>
      <div
        className="fltrwthicon-btn"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <span>
          <SvgFilterIcon />
        </span>
        <p>{selectedOption}</p>
      </div>
      {showDropdown && (
        <div className="filter-dropdown-box">
          <ul>
            {options.map((option, index) => (
              <li
                key={`${dropdownKey}-${index}`}
                onClick={() => handleOptionClick(option)}
              >
                <a>{option.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterWithIconDropdown;
