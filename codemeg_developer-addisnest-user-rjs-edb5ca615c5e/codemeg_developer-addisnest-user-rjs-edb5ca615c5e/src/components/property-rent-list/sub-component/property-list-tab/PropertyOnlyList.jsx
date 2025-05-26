import React, { useEffect } from "react";
import { Property1, Property2, Property3 } from "../../../../assets/images";
import {
    SvgClockIcon,
    SvgFavoriteFillIcon,
    SvgFavoriteIcon,
    SvgRightIcon,
    SvgShareIcon,
} from "../../../../assets/svg-files/SvgFiles";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../../../../Apis/Api";
import { useDispatch } from "react-redux";
function squareMetersToAcres(squareMeters) {
    const acres = squareMeters * 0.00024710538146717;
    return acres.toFixed(4); // Returns the value rounded to 4 decimal places
}
const PropertyOnlyList = ({ HomeList }) => {
    const dispatch = useDispatch();

    const WishlistAddFun = async (item) => {
        let body = {
            propertyId: item?.id,
        };
        try {
            const response = await Api.postWithtoken("wishlist/add-remove", body);
            const { user ,message,data,token} = response;
            toast.success(message);
            dispatch(GetHomeData({ type: 'rent' }));
        } catch (error) {
            console.log('error', error)
        }
    }

   useEffect(()=>{
    window.scrollTo(0, 0);
   },[])

    return (
        <>
            <div className="property-all-main">
                <div className="property-list">
                    <ul>
                        {HomeList && HomeList.map((item, index) => (
                            <li key={index}>
                                <div className="property-card">
                                    <div className="card">
                                        <Link to={`/property-detail/${item?.id}`}
                                            className="property-img"
                                            style={{ backgroundImage: `url(${item?.media[0]?.filePath})` }}
                                        >
                                            <span>{item?.status}</span>
                                            <p>
                                                <em>
                                                    <SvgClockIcon />
                                                </em>
                                                8 hrs ago
                                            </p>
                                        </Link>
                                        <div className="property-detail">
                                            <div className="property-title">
                                                <h3>{item?.price}</h3>
                                                <div className="property-share-icon">
                                                    <span>
                                                        <SvgShareIcon />
                                                    </span>
                                                    <span onClick={()=>{WishlistAddFun(item)}}>
                                                    {item?.is_wishlist===true?<SvgFavoriteFillIcon/>:<SvgFavoriteIcon />}
                                                    </span>
                                                </div>
                                                <div className="property-area">
                                                    <span>{item?.beds} bed</span>
                                                    <span>
                                                        <em></em>
                                                        {item?.bathroom_information?.length} bath
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
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default PropertyOnlyList;
