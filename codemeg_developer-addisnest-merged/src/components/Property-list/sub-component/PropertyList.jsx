import React, { useEffect, useState } from "react";
import PropertyOnlyList from "./property-list-tab/PropertyOnlyList";
import FilterPopup from "../../../Helper/FilterPopup";
import { SvgFilterIcon, SvgLocationIcon, SvgSearchIcon } from "../../../assets/svg-files/SvgFiles";
import { GetHomeData } from "../../../Redux-store/Slices/HomeSlice";
import { useDispatch, useSelector } from "react-redux";

const PropertyList = () => {
    const dispatch = useDispatch();
    const [hoveredProperty, setHoveredProperty] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'rent', 'sell'
    const HomeData = useSelector((state) => state.Home.HomeData);
    const HomeList = HomeData?.data?.data;

    // Sort properties by creation date (most recent first)
    const sortedHomeList = HomeList ? [...HomeList].sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB - dateA; // Descending order (newest first)
    }) : [];

    console.log(sortedHomeList, "SortedHomeList");

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(GetHomeData({ type: '' }));
    }, []);

    const [showFilterPopup, setFilterPopup] = useState(false);
    const handleFilterPopupToggle = () => {
        setFilterPopup((prev) => !prev);
    };

    const handleFilterClick = (filterType) => {
        setActiveFilter(filterType);
        let apiType = '';
        if (filterType === 'rent') {
            apiType = 'rent';
        } else if (filterType === 'sell') {
            apiType = 'sell';
        }
        console.log(`Filtering properties for: ${filterType}, API type: ${apiType}`);
        dispatch(GetHomeData({ type: apiType }));
    };

    const getResultCount = () => {
        const count = sortedHomeList?.length || 0;
        const filterText = activeFilter === 'all' ? 'Total' : 
                          activeFilter === 'rent' ? 'For Rent' : 'For Sale';
        return `${count} ${filterText} Results`;
    };

    return (
        <>
            <section className="proptery-filter-section">
                <div className="container-fluid">
                    <div className="property-list-main">
                        <div className="property-area-title">
                            <h3>
                                <span>
                                    <SvgLocationIcon />
                                </span>
                                Los Angeles, CA
                            </h3>
                            <p>
                                <span>{getResultCount()}</span>
                            </p>
                        </div>
                        {/* Property Type Filter Buttons */}
                        <div className="property-type-filters" style={{ 
                            marginBottom: '20px', 
                            display: 'flex', 
                            gap: '10px',
                            alignItems: 'center'
                        }}>
                            <button 
                                className={`property-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('all')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '25px',
                                    border: activeFilter === 'all' ? '2px solid #007bff' : '2px solid #ddd',
                                    backgroundColor: activeFilter === 'all' ? '#007bff' : 'white',
                                    color: activeFilter === 'all' ? 'white' : '#333',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                All Properties
                            </button>
                            <button 
                                className={`property-filter-btn ${activeFilter === 'rent' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('rent')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '25px',
                                    border: activeFilter === 'rent' ? '2px solid #28a745' : '2px solid #ddd',
                                    backgroundColor: activeFilter === 'rent' ? '#28a745' : 'white',
                                    color: activeFilter === 'rent' ? 'white' : '#333',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                🏠 For Rent
                            </button>
                            <button 
                                className={`property-filter-btn ${activeFilter === 'sell' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('sell')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '25px',
                                    border: activeFilter === 'sell' ? '2px solid #dc3545' : '2px solid #ddd',
                                    backgroundColor: activeFilter === 'sell' ? '#dc3545' : 'white',
                                    color: activeFilter === 'sell' ? 'white' : '#333',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                🏠 For Sale
                            </button>
                        </div>

                        <div className="property-filter-list">
                            <div className="fltr-inner">
                                <div className="filter-component">
                                    <div className="fltrwthicon-btn" onClick={handleFilterPopupToggle}>
                                        <span>
                                            <SvgFilterIcon />
                                        </span>
                                        <p>Filter</p>
                                    </div>
                                </div>
                            </div>
                            <div className="property-srch-input">
                                <span>
                                    <SvgSearchIcon />
                                </span>
                                <input type="text" placeholder="Address, Neighborhood, city" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="property-list-section">
                <div className="container-fluid">
                    <div className="property-list-detail">
                        <PropertyOnlyList HomeList={sortedHomeList} setHoveredProperty={setHoveredProperty} />
                    </div>
                </div>
            </section>
            {showFilterPopup && (
                <FilterPopup handlePopup={handleFilterPopupToggle} />
            )}
        </>
    );
};

export default PropertyList;
