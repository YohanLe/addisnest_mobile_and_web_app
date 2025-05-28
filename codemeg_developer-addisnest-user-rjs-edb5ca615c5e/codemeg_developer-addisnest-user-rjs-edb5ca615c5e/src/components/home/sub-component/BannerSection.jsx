import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BannerBg } from "../../../assets/images";
import { SvgSearchIcon } from "../../../assets/svg-files/SvgFiles";

const BannerSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Buy");
  const tabs = ["Buy", "Sell", "Rent"];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // Map tab names to property types for API filtering
    const propertyTypeMap = {
      "Buy": "sale",
      "Sell": "sale", // For sell listings, we also show sale properties
      "Rent": "rent"
    };
    
    // Navigate to property list with the appropriate filter
    const propertyType = propertyTypeMap[tab];
    navigate(`/property-list?propertyFor=${propertyType}`);
  };
  return (
    <>
      <section
        className="banner-section"
        style={{ backgroundImage: `url(${BannerBg})` }}
      >
        <div className="container">
          <div className="banner-main">
            <div className="banner-heading">
              <h1>Your Home, Your Move – All in One Place</h1>
              <p>
                Welcome to Add, your go-to platform for all things real
                estate. Whether you're looking for your next home, ready to list
                a property, or want to connect with trusted agents, we make it
                easy. Explore properties, manage listings, and get expert advice
                <span>—All with just a few clicks.</span>
              </p>
            </div>
            <div className="banner-searchmain">
              <div className="banner-tabing-list">
                <ul>
                  {tabs.map((tab) => (
                    <li key={tab}>
                      <div
                        className={`banner-tabing ${
                          activeTab === tab ? "active" : ""
                        }`}
                        onClick={() => handleTabClick(tab)}
                      >
                        <p>{tab}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="banner-search-input">
                <input type="text" placeholder="search" />
                <div className="bnr-search-btn">
                  <button className="btn btn-primary bnr-icon-cnt">
                    Search Property
                    <span>
                      <SvgSearchIcon />
                    </span>
                  </button>
                  <button>
                    <SvgSearchIcon />
                  </button>
                </div>
              </div>
            </div>
            <div className="banner-rating">
              <ul>
                <li>
                  <div className="banner-viewer">
                    <h3>500+</h3>
                    <p>Happy Clients</p>
                  </div>
                </li>
                <li>
                  <div className="banner-viewer">
                    <h3>1,223+</h3>
                    <p>Properties Listed</p>
                  </div>
                </li>
                <li>
                  <div className="banner-viewer">
                    <h3>10+</h3>
                    <p>Cities Covered</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BannerSection;
