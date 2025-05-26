import React, { useEffect, useRef, useState } from "react";
import SellPropertyListTab from "./property-tab/SellPropertyListTab";
import RentPropertyListTab from "./property-tab/RentPropertyListTab";
import Pagination from "../../../../helper/Pagination";

const PropertyList = () => {
  const [currentItem, setCurrentItem] = useState(null);
  const selectRefs = useRef([]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        currentItem !== null &&
        selectRefs.current[currentItem] &&
        !selectRefs.current[currentItem].contains(event.target)
      ) {
        setCurrentItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentItem]);

  const handleItemClick = (index) => {
    setCurrentItem(currentItem === index ? null : index);
  };

  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    {
      title: "Sell Property",
      content: <SellPropertyListTab />,
    },
    {
      title: "Rent Property",
      content: <RentPropertyListTab />,
    },
  ];
  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="card-header search-tabing-header">
            <div className="card-filtr justifin-between">
              <div className="fltr-inner">
                <div className="property-tabing">
                  <ul>
                    {tabs.map((tab, index) => (
                      <li key={index} onClick={() => setActiveTab(index)}>
                        <div
                          className={`prfl-title ${
                            index == activeTab ? "active" : ""
                          }`}
                        >
                          {/* <em>{tab.profileIcon}</em> */}
                          <span className="tab-title">{tab.title}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="fltr-inner">
                <div className="fltrsrch-input">
                  <label>
                    <span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.167 15.833c3.682 0 6.667-2.985 6.667-6.667S12.848 2.5 9.167 2.5 2.5 5.485 2.5 9.167s2.985 6.666 6.667 6.666z"
                          stroke="#797979"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.5 17.5l-3.333-3.333"
                          stroke="#797979"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <input type="text" placeholder="Search" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="user-table-detail">
            <div className="tab-content">{tabs[activeTab].content}</div>
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};
export default PropertyList;
