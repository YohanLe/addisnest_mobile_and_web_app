import React, { useEffect } from "react";
import {
  BannerSection,
  EthionestOffersSection,
  FeaturedSection,
  MakeEthniNestSection,
  TestimonialSection,
} from "./sub-component";

const index = () => {
  
  return (
    <>
      <BannerSection />
      <FeaturedSection />
      <EthionestOffersSection />
      <TestimonialSection/> 
      <MakeEthniNestSection/>
    </>
  );
};

export default index;
