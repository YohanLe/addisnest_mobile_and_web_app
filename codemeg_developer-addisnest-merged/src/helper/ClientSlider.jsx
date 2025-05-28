import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SvgDoubleIcon, SvgRatingIcon } from "../assets/svg-files/SvgFiles";
import { ProfileImg } from "../assets/images";
const ClientSlider = () => {
  const [activeSlide, setActiveSlide] = useState(2);
  const settings = {
    dots: true,
    infinite: false,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 3,
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
      <div className="clientslrd-slider">
        <div className="carousel-container">
          <Slider {...settings}>
            {Array(10)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className={`clients-card ${
                    index === activeSlide ? "active" : ""
                  }`}
                >
                  <div className="clients-badge-icon">
                    <SvgDoubleIcon />
                  </div>
                  <div className="clients-card-body">
                    <p>
                      EthniNest made finding my dream home incredibly easy. The
                      platform is user-friendly, and I was able to connect with
                      a great agent who guided me through the entire process.
                    </p>
                    <h3>Mulugeta A., Home Buyer</h3>
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

export default ClientSlider;
