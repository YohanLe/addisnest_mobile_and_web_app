import React, { useEffect } from "react";
import { Property1, Property2, Property3 } from "../../../assets/images";
import { SvgRightIcon } from "../../../assets/svg-files/SvgFiles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetHomeData } from "../../../Redux-store/Slices/HomeSlice";
function squareMetersToAcres(squareMeters) {
    const acres = squareMeters * 0.00024710538146717;
    return acres.toFixed(4); // Returns the value rounded to 4 decimal places
}
const FeaturedSection = () => {

    const dispatch = useDispatch();
    const HomeData = useSelector((state) => state.Home.HomeData);
    const HomeList = HomeData?.data?.data;

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(GetHomeData({ type:'' }));
    }, []);
    
    return (
        <>
            <section className="common-section feature-section">
                <div className="container">
                    <div className="top-heading">
                        <h3>Featured Homes for You</h3>
                        <p>Check out the latest listings and find your ideal property. </p>
                        <p>
                            Click to see full details and take the next step toward your dream
                            home.
                        </p>
                    </div>
                    <div className="property-list">
                        <ul>
                        {HomeList && HomeList.map((item, index) => (
                            <li key={index}>
                                <div className="property-card">
                                <Link to={`/property-detail/${item?.id}`}>
                                    <div className="card">
                                        <div
                                            className="property-img"
                                            style={{ backgroundImage: `url(${item?.media[0]?.filePath})` }}
                                        >
                                            <span>For {item?.propertyFor}</span>
                                        </div>
                                        <div className="property-detail">
                                            <div className="property-title">
                                                <h3>ETB {item?.price}</h3>
                                                <div className="property-area">
                                                    <span>{item?.bathroom_information?.length} bed</span>
                                                    <span>
                                                        <em></em>{item?.bathroom_information?.length} bath
                                                    </span>
                                                    <span>
                                                        <em></em>{item?.property_size} sqm. 
                                                        {/* (on {squareMetersToAcres(item?.property_size)} acres) */}
                                                    </span>
                                                </div>
                                                <p>{item?.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                    </Link>
                                </div>
                            </li>
                            ))}
                            {/* <li>
                                <div className="property-card">
                                    <div className="card">
                                        <div
                                            className="property-img"
                                            style={{ backgroundImage: `url(${Property2})` }}
                                        >
                                            <span>For Rent</span>
                                        </div>
                                        <div className="property-detail">
                                            <div className="property-title">
                                                <h3>ETB 1,32,45,223</h3>
                                                <div className="property-area">
                                                    <span>3 bed</span>
                                                    <span>
                                                        <em></em>2 bath
                                                    </span>
                                                    <span>
                                                        <em></em>1,439 sqm. (on 1.95 acres)
                                                    </span>
                                                </div>
                                                <p>1901 Thornridge Cir. Shiloh, Hawaii 81063</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="property-card">
                                    <div className="card">
                                        <div
                                            className="property-img"
                                            style={{ backgroundImage: `url(${Property1})` }}
                                        >
                                            <span>For Rent</span>
                                        </div>
                                        <div className="property-detail">
                                            <div className="property-title">
                                                <h3>ETB 1,32,45,223</h3>
                                                <div className="property-area">
                                                    <span>3 bed</span>
                                                    <span>
                                                        <em></em>2 bath
                                                    </span>
                                                    <span>
                                                        <em></em>1,439 sqm. (on 1.95 acres)
                                                    </span>
                                                </div>
                                                <p>1901 Thornridge Cir. Shiloh, Hawaii 81063</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li> */}
                        </ul>
                        <Link to="/property-list" className="property-views">
                            <p>View all Property</p>
                            <span>
                                <SvgRightIcon />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FeaturedSection;
