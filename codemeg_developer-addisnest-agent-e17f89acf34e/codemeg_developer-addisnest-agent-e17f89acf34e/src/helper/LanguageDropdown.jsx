import React, { useState } from "react";
import { SvgLanguageHeaderIcon } from "../assets/svg/Svg";
const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown state
  const [selectedLang, setSelectedLang] = useState("Eng"); // Selected Language

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const selectLanguage = (lang) => {
    setSelectedLang(lang); // Update selected language
    setIsOpen(false); // Close dropdown
  };

  return (
    <>
      <div className="language-selector">
        <div className="lang-display" onClick={toggleDropdown}>
          <span>{selectedLang}</span>
          <div className="lang-icon">
            <SvgLanguageHeaderIcon />
          </div>
        </div>
        {isOpen && (
          <ul className="lang-dropdown">
            <li onClick={() => selectLanguage("Eng")}>English</li>
            <li onClick={() => selectLanguage("Spanish")}>Spanish</li>
          </ul>
        )}
      </div>
    </>
  );
};

export default LanguageDropdown;
