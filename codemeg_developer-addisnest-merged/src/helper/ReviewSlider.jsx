import React, { useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SvgRatingIcon } from '../assets/svg-files/SvgFiles';
import { ProfileImg } from '../assets/images';
const ReviewSlider = ({ ReviewList }) => {
    console.log('review list', ReviewList);
    const [activeSlide, setActiveSlide] = useState(2);
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
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                    autoplay: true,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    autoplay: true,
                    centerMode: false,
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
    return (
        <>
            <div className="testimonial-slider">
                <div className="carousel-container">
                    {/* <Slider {...settings}>
                        {ReviewList && ReviewList.map((item, index) => (
                                <div
                                    key={index}
                                    className={`testimonial-card ${index === activeSlide ? "active" : ""
                                        }`}
                                >
                                    <div className="testimonial-descrp">
                                        <div className="ratings-main">
                                            {Array(5)
                                                .fill()
                                                .map((_, starIndex) => (
                                                    <span key={starIndex}>
                                                        <SvgRatingIcon />
                                                    </span>
                                                ))}
                                        </div>
                                        <p>
                                           {item?.comment}
                                        </p>
                                    </div>
                                    <div className="testimonial-prfldtls">
                                        <div className="testimonial-img">
                                            <span
                                                className=""
                                                style={{
                                                    backgroundImage: `url(${ProfileImg})`,
                                                }}
                                            ></span>
                                        </div>
                                        <h3>Ahmad Al-mansour</h3>
                                    </div>
                                </div>
                            ))}
                    </Slider> */}

                    <Slider {...settings}>
                        {ReviewList &&
                            ReviewList.map((item, index) => (
                                <div key={index} className={`testimonial-card ${index === activeSlide ? "active" : ""}`}>
                                    <div className="testimonial-descrp">
                                        <div className="ratings-main" style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>
                                                    <svg
                                                        width="37"
                                                        height="36"
                                                        viewBox="0 0 37 36"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M17.9573 1.55161C18.0812 1.17018 18.6208 1.17018 18.7448 1.55161L22.419 12.8596C22.5852 13.3713 23.0621 13.7178 23.6002 13.7178H35.4901C35.8912 13.7178 36.0579 14.231 35.7335 14.4668L26.1143 21.4555C25.679 21.7717 25.4969 22.3324 25.6631 22.8441L29.3373 34.1521C29.4612 34.5335 29.0247 34.8507 28.7002 34.615L19.0811 27.6262C18.6458 27.31 18.0563 27.31 17.621 27.6262L8.00185 34.615C7.67738 34.8507 7.24081 34.5335 7.36475 34.1521L11.0389 22.8441C11.2052 22.3324 11.0231 21.7717 10.5877 21.4555L0.968603 14.4668C0.644133 14.231 0.81089 13.7178 1.21195 13.7178H13.1018C13.6399 13.7178 14.1168 13.3713 14.2831 12.8596L17.9573 1.55161Z"
                                                            fill={i < item?.rating ? "#B7EB58" : "#E5E7EA"}
                                                            stroke={i < item?.rating ? "#B7EB58" : "#E5E7EA"}
                                                            strokeWidth="0.828025"
                                                        />
                                                    </svg>
                                                </span>
                                            ))}
                                        </div>
                                        <p>{item?.comment}</p>
                                    </div>
                                    <div className="testimonial-prfldtls">
                                        <div className="testimonial-img">
                                            <span
                                                style={{
                                                    backgroundImage: `url(${item?.user?.profile_img})`,
                                                }}
                                            ></span>
                                        </div>
                                        <h3>{item?.user?.name || "Ahmad Al-mansour"}</h3>
                                    </div>
                                </div>
                            ))}
                    </Slider>
                </div>
            </div>

        </>
    )
}

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

export default ReviewSlider