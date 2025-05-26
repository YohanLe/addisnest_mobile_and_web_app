import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  SvgAppaertmentIcon,
  SvgCloseIcon,
  SvgCondoIcon,
  SvgHomeMiltiFamilyIcon,
  SvgHomeTypeIcon,
  SvgOtherIcon,
} from "../assets/svg-files/SvgFiles";

const FilterPopup = ({ handlePopup }) => {
  const [activeType, setActiveType] = useState("Buy"); // Default active is "Buy"

  const handleTypeClick = (type) => {
    setActiveType(type); // Update the active type
  };
  const [activeBathroom, setActiveBathroom] = useState("Any"); // Default active is "Any"

  const handleBathroomClick = (bathroom) => {
    setActiveBathroom(bathroom); // Update the active bathroom filter
  };
  const bathroomOptions = ["Any", "Studio", "1", "2", "3", "4", "+5"];

  const [activeBath, setActiveBath] = useState("Any"); // Default active is "Any"

  const handleBathClick = (bathroom) => {
    setActiveBath(bathroom); // Update the active bathroom filter
  };
  const bathOptions = ["Any", "1", "1.5", "2", "2.5", "3", "3.5"];

  const [activeHomeType, setActiveHomeType] = useState(null); // Track active card

  const homeTypes = [
    { id: 1, icon: <SvgHomeTypeIcon />, label: "House" },
    { id: 2, icon: <SvgHomeMiltiFamilyIcon />, label: "Multi Family" },
    { id: 3, icon: <SvgCondoIcon />, label: "Condo" },
    { id: 4, icon: <SvgAppaertmentIcon />, label: "Appartment" },
    { id: 5, icon: <SvgCondoIcon />, label: "House" },
    { id: 6, icon: <SvgHomeMiltiFamilyIcon />, label: "House" },
    { id: 7, icon: <SvgHomeMiltiFamilyIcon />, label: "House" },
    { id: 8, icon: <SvgOtherIcon />, label: "Other" },
  ];

  const handleHomeTypeClick = (id) => {
    setActiveHomeType(id); // Update the active home type
  };
  return (
    <>
      <div className="main-popup filter-popup">
        <div className="lm-outer">
          <div className="lm-inner">
            <div className="popup-inner">
              <div className="popup-header">
                <div className="popup-title">
                  <h3>Filter</h3>
                </div>
                <div className="close-icon">
                  <span onClick={handlePopup}>
                    <SvgCloseIcon />
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="filter-detail-main">
                  <div className="filtr-typeselector">
                    <span
                      className={activeType === "Buy" ? "active" : ""}
                      onClick={() => handleTypeClick("Buy")}
                    >
                      Buy
                    </span>

                    <span
                      className={activeType === "Rent" ? "active" : ""}
                      onClick={() => handleTypeClick("Rent")}
                    >
                      Rent
                    </span>
                  </div>
                  <div className="filter-price-range">
                    <h3>Price range</h3>
                    <p>List Price</p>
                    <div className="range-payment">
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.1"
                        className="slider"
                      />
                    </div>
                    <div className="filtr-maxmin-main">
                      <div className="fltr-maxminfield">
                        <p>Minimum</p>
                        <h4>ETB12,12,455</h4>
                      </div>
                      <div className="fltr-maxminfield">
                        <p>Maximum</p>
                        <h4>ETB4,68,23,455</h4>
                      </div>
                    </div>
                  </div>
                  <div className="filter-roombath-main">
                    <div className="fltr-bthroom-selector">
                      <span>Bed</span>
                      <div className="fltr-bthroom-list">
                        {bathroomOptions.map((option, index) => (
                          <span
                            key={index}
                            className={
                              activeBathroom === option ? "active" : ""
                            }
                            onClick={() => handleBathroomClick(option)}
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="fltr-bthroom-selector">
                      <span>Bath</span>
                      <div className="fltr-bthroom-list">
                        {bathOptions.map((option, index) => (
                          <span
                            key={index}
                            className={activeBath === option ? "active" : ""}
                            onClick={() => handleBathClick(option)}
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="fltr-hometype-list">
                    <h3>Home Type</h3>
                    <ul>
                      {homeTypes.map((home) => (
                        <li key={home.id}>
                          <div
                            className={`fltr-hometype-crd ${
                              activeHomeType === home.id ? "active" : ""
                            }`}
                            onClick={() => handleHomeTypeClick(home.id)}
                          >
                            {home.icon}
                            <h4>{home.label}</h4>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="fltr-property-detail">
                    <h3>Property Details</h3>
                    <div className="fltr-prptyinpt-main">
                      <h5>Square feet</h5>
                      <div className="fltr-prptyinput-flex">
                        <div className="fltr-prptyinput">
                          <p>Minimum</p>
                          <input type="text" value='5165 sqm.' />
                        </div>
                        <div className="fltr-prptyinput">
                          <p>Maximum</p>
                          <input type="text" value='5165 sqm.'/>
                        </div>
                      </div>
                    </div>
                    <div className="fltr-prptyinpt-main">
                      <h5>Lot Size</h5>
                      <div className="fltr-prptyinput-flex">
                        <div className="fltr-prptyinput">
                          <p>Minimum</p>
                          <input type="text" value='5165 sqm.' />
                        </div>
                        <div className="fltr-prptyinput">
                          <p>Maximum</p>
                          <input type="text"value='5165 sqm.' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="popup-btm">
                <div className="all-clear">
                  <span>All Clear</span>
                </div>
                <div className="filtr-btn">
                  <button className="btn btn-secondary">Show 324 result</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="popup-overlay" onClick={handlePopup}></div>
      </div>
    </>
  );
};

export default FilterPopup;
