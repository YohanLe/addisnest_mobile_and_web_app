import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
    SvgClockIcon,
    SvgFavoriteFillIcon,
    SvgFavoriteIcon,
    SvgShareIcon,
} from "../assets/svg-files/SvgFiles";
import { Property1 } from "../assets/images";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// import { SvgRatingIcon } from "../assets/svg-files/SvgFiles";
// import { TestimonialProfile } from "../assets/images";

import { formatDistanceToNow } from "date-fns";
import Api from "../Apis/Api";
import { GetAgentDetails } from "../Redux-store/Slices/AgentDetailsSlice";
import { useDispatch } from "react-redux";

const MakeFormat = (data) => {
    if (!data) return "Invalid date";

    const date = new Date(data?.createdAt || data);
    if (isNaN(date)) return "Invalid date";

    return formatDistanceToNow(date, { addSuffix: true });
};
const PropertySlider = ({ PropertyList }) => {
    const dispatch = useDispatch();
    const [activeSlide, setActiveSlide] = useState(2);
    const [ListProperty, setListProperty] = useState([]);
    const settings = {
        dots: true,
        infinite: false,
        speed: 1000,
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 3000,
        beforeChange: (current, next) => setActiveSlide(next),
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                    autoplay: true,
                },
            },
            {
                breakpoint: 767, // Adjusted for small screens
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    autoplay: true,
                    centerMode: false, // Center mode disabled to show full card
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    autoplay: true,
                    centerMode: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    centerMode: false,
                },
            },
        ],
    };

    useEffect(() => {
        if (PropertyList) {
            setListProperty(PropertyList?.properties)
        }
    }, [])

    const WishlistAddFun = async (item) => {
        let body = {
            propertyId: item?.id,
        };
        try {
            const response = await Api.postWithtoken("wishlist/add-remove", body);
            const { user ,message,data,token} = response;
            toast.success(message);
            dispatch(GetAgentDetails({ id:PropertyList?.id }));
        } catch (error) {
            console.log('error', error)
        }
    }
    return (
        <>
            <div className="property-slider">
                <h3>Property Listing</h3>
                <div className="carousel-container">
                    <Slider {...settings}>
                        {ListProperty && ListProperty.map((item, index) => (
                            <div key={index} className="property-card">
                                <div className="card">
                                    <Link to={`/property-detail/${item?.id}`}
                                        className="property-img"
                                        style={{ backgroundImage: item?.media?.length > 0 && `url(${item?.media[0].filePath})` }}>
                                        <span>House For {item?.propertyFor}</span>
                                        <p>
                                            <em>
                                                <SvgClockIcon />
                                            </em>
                                            {MakeFormat(item?.createdAt)}
                                        </p>
                                    </Link>
                                    <div className="property-detail">
                                        <div className="property-title">
                                            <h3>ETB {item?.price}</h3>
                                            <div className="property-share-icon">
                                                <span>
                                                    <SvgShareIcon />
                                                </span>
                                                <span onClick={()=>{WishlistAddFun(item)}}>
                                                    {item?.is_wishlist===true?<SvgFavoriteFillIcon/>:<SvgFavoriteIcon />}
                                                </span>
                                            </div>
                                            <div className="property-area">
                                                <span>{item?.bathroom_information?.length} bad</span>
                                                <span>
                                                    <em></em>{item?.bathroom_information?.length} bath
                                                </span>
                                                <span>
                                                    <em></em>{item?.property_size}
                                                    {/* sqm. (on 1.95 acres) */}
                                                </span>
                                            </div>
                                            <p>{item?.address} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </>
    );
};

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return <div className={className} style={{ ...style }} onClick={onClick} />;
};

const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, zIndex: "1" }}
            onClick={onClick}
        />
    );
};

export default PropertySlider;
