import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SearchAgent = () => {
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useState({
    region: '',
    specialty: '',
    language: '',
    minRating: '',
    verifiedOnly: false
  });
  
  // Available options for dropdowns
  const regions = ['Addis Ababa', 'Adama', 'Bahir Dar', 'Hawassa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Jimma', 'Dessie', 'Other'];
  const specialties = ['Buying', 'Selling', 'Renting', 'Commercial', 'Residential', 'Farmland', 'New Construction', 'Luxury'];
  const languages = ['Amharic', 'Afaan Oromo', 'English', 'Tigrinya', 'Somali', 'Other'];
  const ratingOptions = [
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
    { value: '1', label: 'Any Rating' }
  ];

  // Handle input change for all form fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (searchParams.region) queryParams.append('region', searchParams.region);
    if (searchParams.specialty) queryParams.append('specialty', searchParams.specialty);
    if (searchParams.language) queryParams.append('language', searchParams.language);
    if (searchParams.minRating) queryParams.append('minRating', searchParams.minRating);
    if (searchParams.verifiedOnly) queryParams.append('verified', 'true');
    
    // Navigate to the find-agent-list page with search query
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };

  // Reset all form fields
  const resetForm = () => {
    setSearchParams({
      region: '',
      specialty: '',
      language: '',
      minRating: '',
      verifiedOnly: false
    });
  };

  // Use current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real implementation, we would reverse geocode to get address
          toast.info("Using your current location");
          // For now, just navigate to the find-agent-list page
          navigate('/find-agent/list');
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Could not access your location. Please check your browser settings.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  return (
    <>
      <div className="common-section search-agent-main">
        <div className="container">
          <div className="scrchagent-inner">
            <div className="srchagent-heading">
              <h3>Find a local agent ready to manage your listing for you.</h3>
              <p>
                Agent Network connects you with trusted, local experts to manage
                your property and assist potential buyers.
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="agent-search-form">
              <div className="search-form-row">
                <div className="search-form-group">
                  <label htmlFor="region">Regional State</label>
                  <select 
                    id="region" 
                    name="region" 
                    value={searchParams.region} 
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">All Regions</option>
                    {regions.map((region, index) => (
                      <option key={index} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                
                <div className="search-form-group">
                  <label htmlFor="specialty">Specialty</label>
                  <select 
                    id="specialty" 
                    name="specialty" 
                    value={searchParams.specialty} 
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((specialty, index) => (
                      <option key={index} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="search-form-row">
                <div className="search-form-group">
                  <label htmlFor="language">Language Spoken</label>
                  <select 
                    id="language" 
                    name="language" 
                    value={searchParams.language} 
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">All Languages</option>
                    {languages.map((language, index) => (
                      <option key={index} value={language}>{language}</option>
                    ))}
                  </select>
                </div>
                
                <div className="search-form-group">
                  <label htmlFor="minRating">Minimum Rating</label>
                  <select 
                    id="minRating" 
                    name="minRating" 
                    value={searchParams.minRating} 
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Any Rating</option>
                    {ratingOptions.map((option, index) => (
                      <option key={index} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="search-form-row">
                <div className="search-form-checkbox">
                  <input 
                    type="checkbox" 
                    id="verifiedOnly" 
                    name="verifiedOnly" 
                    checked={searchParams.verifiedOnly} 
                    onChange={handleInputChange}
                  />
                  <label htmlFor="verifiedOnly">Show verified agents only</label>
                </div>
              </div>
              
              <div className="search-form-actions">
                <button type="submit" className="btn btn-primary">Search Agents</button>
                <button type="button" onClick={resetForm} className="btn btn-outline-secondary">Reset</button>
              </div>
            </form>
            
            <div className="search-divider">
              <span>OR</span>
            </div>
            
            <div className="findagent-loaction">
              <button onClick={useCurrentLocation} className="location-link">
                <span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.1498 0.859766C18.7678 0.470328 18.2833 0.196983 17.7524 0.07134C17.2215 -0.0543033 16.6659 -0.0271133 16.1498 0.149766L1.9998 4.87977C1.42912 5.06657 0.930493 5.42591 0.572758 5.9082C0.215023 6.39049 0.0158211 6.97193 0.00265102 7.57227C-0.010519 8.1726 0.162992 8.76223 0.499233 9.25974C0.835473 9.75725 1.31786 10.1381 1.87981 10.3498L7.1198 12.3498C7.23912 12.3954 7.34776 12.4651 7.43895 12.5546C7.53014 12.644 7.60191 12.7513 7.6498 12.8698L9.64981 18.1198C9.85339 18.6738 10.2228 19.1515 10.7078 19.4879C11.1927 19.8244 11.7696 20.0031 12.3598 19.9998H12.4298C13.0308 19.9888 13.6134 19.7901 14.0958 19.4314C14.5781 19.0728 14.9362 18.5722 15.1198 17.9998L19.8498 3.82977C20.0218 3.3187 20.0474 2.76971 19.9237 2.24485C19.8 1.72 19.5319 1.24022 19.1498 0.859766ZM17.9998 3.19977L13.2198 17.3798C13.1643 17.5592 13.0528 17.7162 12.9017 17.8278C12.7505 17.9394 12.5677 17.9996 12.3798 17.9998C12.1931 18.0028 12.0098 17.949 11.8544 17.8454C11.699 17.7418 11.5788 17.5933 11.5098 17.4198L9.50981 12.1698C9.36481 11.7883 9.14119 11.4416 8.85349 11.1521C8.56578 10.8627 8.22041 10.637 7.83981 10.4898L2.58981 8.48977C2.4127 8.42487 2.26046 8.30597 2.15459 8.14985C2.04872 7.99374 1.99458 7.80832 1.9998 7.61977C1.99996 7.43191 2.06022 7.24903 2.17178 7.09789C2.28334 6.94675 2.44034 6.83527 2.6198 6.77977L16.7998 2.04977C16.9626 1.98341 17.1411 1.96564 17.3138 1.99859C17.4865 2.03154 17.646 2.11381 17.7729 2.23545C17.8998 2.35709 17.9888 2.5129 18.0291 2.68403C18.0693 2.85516 18.0592 3.03429 17.9998 3.19977Z"
                      fill="#007AFF"
                    />
                  </svg>
                </span>
                Find agents near my current location
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchAgent;
