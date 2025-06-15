import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetHomeData } from '../../Redux-store/Slices/HomeSlice';
import BannerSection from './sub-component/BannerSection';
import FeaturedProperties from './sub-component/FeaturedProperties';
import ServicesSection from './sub-component/ServicesSection';
import WhyChooseUs from './sub-component/WhyChooseUs';
import NeighborhoodGuide from './sub-component/NeighborhoodGuide';
//import TestimonialsSection from './sub-component/TestimonialsSection';
//import CTASection from './sub-component/CTASection';

const HomePage = () => {
  const dispatch = useDispatch();
  const homeData = useSelector((state) => state.Home?.HomeData);
  useEffect(() => {
>>>>>>>
    console.log("HomePage component mounted");
    
    // Debug Redux state
    if (homeData) {
      console.log("HomeData in HomePage:", homeData);
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, [homeData]);
    console.log("HomePage component mounted");
    
    // Debug Redux state
    if (homeData) {
      console.log("HomeData in HomePage:", homeData);
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, [homeData]);

  return (
    <div className="home-page" style={{ 
      backgroundColor: '#f9f9f9',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <BannerSection />
      
      <div style={{ marginTop: '40px', marginBottom: '20px' }}>
        <FeaturedProperties />
      </div>
      
      <div style={{ marginTop: '50px', marginBottom: '50px', backgroundColor: 'white', padding: '50px 0' }}>
        <ServicesSection />
      </div>
      
      <div style={{ marginTop: '50px', marginBottom: '20px' }}>
        <WhyChooseUs />
      </div>
      
      <div style={{ marginTop: '20px', marginBottom: '50px', backgroundColor: 'white', padding: '50px 0' }}>
        <NeighborhoodGuide />
      </div>
    </div>
  );
};

export default HomePage;
