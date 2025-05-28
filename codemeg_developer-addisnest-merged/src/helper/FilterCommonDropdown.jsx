import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FilterCommonDropdown = ({ initialTitle, options, showEm = true, dropdownKey }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitialSelectedOption = () => {
    const savedOption = localStorage.getItem(dropdownKey);
    return savedOption ? savedOption : initialTitle;
  };

  const [selectedOption, setSelectedOption] = useState(getInitialSelectedOption);

  const goToNext = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  const selectRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    localStorage.setItem(dropdownKey, option.label); 
    if (option.path) {
      goToNext(option.path);
    }
    setShowDropdown(false);
  };

  return (
    <div className="common-dropdown" ref={selectRef}>
      <div
        className={`common-dropdown-title ${showDropdown ? 'active' : ''}`}
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {selectedOption}
      </div>
      {showDropdown && (
        <div className="common-dropdown-submenu">
          <ul>
            {options.map((option, index) => (
              <li
                key={index}>
                <a  onClick={() => handleOptionClick(option)}
                className={option.label === selectedOption ? 'active' : ''}>
                  {showEm && <em class="ticket-badge"></em>} {option.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterCommonDropdown;
