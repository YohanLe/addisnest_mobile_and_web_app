import React, { useEffect } from "react";
import { Property1, Property2, Property3 } from "../../../../assets/images";
import {
    SvgClockIcon,
    SvgFavoriteFillIcon,
    SvgFavoriteIcon,
    SvgRightIcon,
    SvgShareIcon,
} from "../../../../assets/svg-files/SvgFiles";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../../../../Apis/Api";
import { useDispatch } from "react-redux";
import { GetHomeData } from "../../../../Redux-store/Slices/HomeSlice";

function squareMetersToAcres(squareMeters) {
    const acres = squareMeters * 0.00024710538146717;
    return acres.toFixed(4);
}

const MakeFormat = (data) => {
    if (!data) return "Invalid date";

    const date = new Date(data?.createdAt || data);
    if (isNaN(date)) return "Invalid date";

    return formatDistanceToNow(date, { addSuffix: true });
};

const PropertyOnlyList = ({ HomeList, setHoveredProperty }) => {
    const dispatch = useDispatch();

    const handleMouseEnter = (property) => {
        setHoveredProperty(property);
    };

    const handleMouseLeave = () => {
        setHoveredProperty(null);
    };

    const WishlistAddFun = async (item) => {
        // let value = item?.is_wishlist === 1 ? 0 : 0;
        let body = {
            propertyId: item?.id,
        };
        try {
            const response = await Api.postWithtoken("wishlist/add-remove", body);
            const { user, message, data, token } = response;
            toast.success(message);
            dispatch(GetHomeData({ type: '' }));
        } catch (error) {
            console.log('error', error);
        }
    };
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
                                <div
                                    className="property-card"
                                    onMouseEnter={() => handleMouseEnter(item)}
                                    onMouseLeave={handleMouseLeave}
                                >
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
                                                {MakeFormat(item?.createdAt)} hrs ago
                                            </p>
                                        </Link>
                                        <div className="property-detail">
                                            <div className="property-title">
                                                <h3>{item?.price}</h3>
                                                <div className="property-share-icon">
                                                    <span>
                                                        <SvgShareIcon />
                                                    </span>
                                                    <span onClick={() => { WishlistAddFun(item) }}>
                                                        {item?.is_wishlist === true
                                                            ? <SvgFavoriteFillIcon />
                                                            : <SvgFavoriteIcon />}
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
