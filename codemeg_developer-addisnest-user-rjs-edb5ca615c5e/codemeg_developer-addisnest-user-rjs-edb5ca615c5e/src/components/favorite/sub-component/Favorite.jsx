import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import { Property1, Property2, Property3 } from "../../../assets/images";
import { SvgClockIcon, SvgFavoriteFillIcon, SvgFavoriteIcon, SvgShareIcon } from "../../../assets/svg-files/SvgFiles";
import { useDispatch, useSelector } from "react-redux";
import { GetWishList } from "../../../Redux-store/Slices/WishListSlice";
import { formatDistanceToNow } from "date-fns";
import Api from "../../../Apis/Api";

const MakeFormat = (data) => {
    if (!data) return "Invalid date";
    const date = new Date(data?.createdAt || data);
    if (isNaN(date)) return "Invalid date";
    return formatDistanceToNow(date, { addSuffix: true });
};
const Favorite = () => {
   
    const dispatch = useDispatch();
    const WishData = useSelector((state) => state.WishList.data);
    const WishList = WishData?.data?.data;
    console.log('__________________?WishList data', WishList);
    useEffect(() => {
        dispatch(GetWishList());
    }, []);

    const WishlistAddFun = async (item) => {
        let body = {
            propertyId: item?.propertyId,
        };
        try {
            const response = await Api.postWithtoken("wishlist/add-remove", body);
            const { user ,message,data,token} = response;
            toast.success(message);
            dispatch(GetWishList());
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <section className="common-section favorite-main-section">
            <div className="container">
                <div className="property-list">
                    <ul>
                        {WishList && WishList.map((item, index) => (
                            <li key={index}>
                                <Link to={`/property-detail/${item?.id}`} className="property-card">
                                    <div className="card">
                                        <div
                                            className="property-img"
                                            // style={{ backgroundImage: `url(${item.media[0].filePath})` }}
                                            style={{backgroundImage: item?.property.media?.length > 0 && `url(${item?.property?.media[0].filePath})`}}
                                            >
                                            <span>{item?.property?.status}</span>
                                            <p>
                                                <em>
                                                    <SvgClockIcon />
                                                </em>
                                                {MakeFormat(item?.property.createdAt)}
                                            </p>
                                            <div onClick={()=>{WishlistAddFun(item)}} className="favorite-icon">
                                                <SvgFavoriteFillIcon />
                                            </div>
                                        </div>
                                        <div className="property-detail">
                                            <div className="property-title">
                                                <h3>{item?.property?.price}</h3>
                                                <div className="property-area">
                                                    <span>{item?.property?.beds} bed</span>
                                                    <span>
                                                        <em></em>
                                                        {item?.property?.bathroom_information?.length} bath
                                                    </span>
                                                    <span>
                                                        <em></em>{item?.property?.property_size} sqm.
                                                         {/* (on 1.95 acres) */}
                                                    </span>
                                                </div>
                                                <p>{item.property?.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Favorite;
