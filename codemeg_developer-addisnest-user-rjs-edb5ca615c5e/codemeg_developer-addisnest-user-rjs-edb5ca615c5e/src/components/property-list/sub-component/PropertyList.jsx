import React, { useEffect, useState } from "react";
import PropertyOnlyList from "./property-list-tab/PropertyOnlyList";
import FilterPopup from "../../../Helper/FilterPopup";
import { SvgFilterIcon, SvgLocationIcon, SvgSearchIcon } from "../../../assets/svg-files/SvgFiles";
import { GetHomeData } from "../../../Redux-store/Slices/HomeSlice";
import { useDispatch, useSelector } from "react-redux";

const PropertyList = () => {
    const dispatch = useDispatch();
    const [hoveredProperty, setHoveredProperty] = useState(null);
    const HomeData = useSelector((state) => state.Home.HomeData);
    const HomeList = HomeData?.data?.data;
    console.log(HomeList,"HomeLis11t");

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(GetHomeData({ type: '' }));
    }, []);

    const [showFilterPopup, setFilterPopup] = useState(false);
    const handleFilterPopupToggle = () => {
        setFilterPopup((prev) => !prev);
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
                                <span>1,341 </span>Results
                            </p>
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
                        <PropertyOnlyList HomeList={HomeList} setHoveredProperty={setHoveredProperty} />
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
