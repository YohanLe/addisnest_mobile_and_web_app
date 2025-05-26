import React from "react";
import { TestimonialIcon } from "../../../assets/images";
import ClientSlider from "../../../Helper/ClientSlider";

const TestimonialSection = () => {
  return (
    <>
      <section className="common-section testimonial-section">
        <div className="container">
          <div className="testiminial-heading">
            <img src={TestimonialIcon} alt="" />
            <h3>What our client say about us.</h3>
          </div>
          <div className="client-slider-main">
            <ClientSlider />
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialSection;
