import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetHomeData } from '../../Redux-store/Slices/HomeSlice';
import PropertyListPage from '../Property-list/PropertyListPage';
import BannerSection from './sub-component/BannerSection';
//import TestimonialsSection from './sub-component/TestimonialsSection';
//import CTASection from './sub-component/CTASection';
//import NeighborhoodGuide from './sub-component/NeighborhoodGuide';

const HomePage = () => {
  const dispatch = useDispatch();
  const homeData = useSelector((state) => state.Home?.HomeData);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Determine property count based on screen width
  const propertyCount = windowWidth <= 767 ? 5 : 3;

  // Add event listener to track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
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
      
      <div className="property-section" style={{ marginTop: '40px', marginBottom: '50px' }}>
        <PropertyListPage isHomePage={true} propertyCount={propertyCount} />
      </div>
      
      <style jsx="true">{`
        @media screen and (max-width: 767px) {
          .property-section {
            margin-top: 0 !important;
            background-color: #f9f9f9;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
