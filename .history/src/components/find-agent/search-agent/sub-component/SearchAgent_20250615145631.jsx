import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchAgent = () => {
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useState({
    region: '',
    specialty: '',
    language: '',
    minRating: '',
    verifiedOnly: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Convert search params to URL query params
    const queryParams = new URLSearchParams();
    
    if (searchParams.region) queryParams.append('region', searchParams.region);
    if (searchParams.specialty) queryParams.append('specialty', searchParams.specialty);
    if (searchParams.language) queryParams.append('language', searchParams.language);
    if (searchParams.minRating) queryParams.append('minRating', searchParams.minRating);
    if (searchParams.verifiedOnly) queryParams.append('verifiedOnly', 'true');
    
    // Navigate to the agent list page with the search parameters
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };

  const clearForm = () => {
    setSearchParams({
      region: '',
      specialty: '',
      language: '',
      minRating: '',
      verifiedOnly: false
    });
  };

  return (
    <div className="search-agent-main">
      <div className="container">
        <div className="scrchagent-inner">
          <div className="srchagent-heading">
            <h3>Find a Real Estate Agent in Ethiopia</h3>
            <p>Connect with experienced real estate professionals who can help you buy, sell, or rent properties</p>
          </div>
          
          <div className="agent-search-form">
            <form onSubmit={handleSearch}>
              <div className="search-form-row">
                <div className="search-form-group">
                  <label htmlFor="region">Region/City</label>
                  <select 
                    id="region" 
                    name="region" 
                    value={searchParams.region}
                    onChange={handleChange}
                  >
                    <option value="">Select Region</option>
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Adama">Adama</option>
                    <option value="Bahir Dar">Bahir Dar</option>
                    <option value="Hawassa">Hawassa</option>
                    <option value="Dire Dawa">Dire Dawa</option>
                    <option value="Mekelle">Mekelle</option>
                    <option value="Gondar">Gondar</option>
                    <option value="Jimma">Jimma</option>
                  </select>
                </div>
                
                <div className="search-form-group">
                  <label htmlFor="specialty">Specialty</label>
                  <select 
                    id="specialty" 
                    name="specialty"
                    value={searchParams.specialty}
                    onChange={handleChange}
                  >
                    <option value="">Select Specialty</option>
                    <option value="Buying">Buying</option>
                    <option value="Selling">Selling</option>
                    <option value="Renting">Renting</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Farmland">Farmland</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
              </div>
              
              <div className="search-form-row">
                <div className="search-form-group">
                  <label htmlFor="language">Language</label>
                  <select 
                    id="language" 
                    name="language"
                    value={searchParams.language}
                    onChange={handleChange}
                  >
                    <option value="">Select Language</option>
                    <option value="Amharic">Amharic</option>
                    <option value="Afaan Oromo">Afaan Oromo</option>
                    <option value="English">English</option>
                    <option value="Tigrinya">Tigrinya</option>
                    <option value="Somali">Somali</option>
                  </select>
                </div>
                
                <div className="search-form-group">
                  <label htmlFor="minRating">Minimum Rating</label>
                  <select 
                    id="minRating" 
                    name="minRating"
                    value={searchParams.minRating}
                    onChange={handleChange}
                  >
                    <option value="">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars</option>
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
                    onChange={handleChange}
                  />
                  <label htmlFor="verifiedOnly">Show only verified agents</label>
                </div>
              </div>
              
              <div className="search-form-actions">
                <button type="submit" className="primary-btn">Search Agents</button>
                <button type="button" onClick={clearForm} style={{ backgroundColor: '#f0f0f0', border: 'none', color: '#555' }}>Clear</button>
              </div>
            </form>
          </div>
          
          <div className="search-divider">
            <span>OR</span>
          </div>
          
          <div className="findagent-loaction">
            <button 
              className="location-link"
              onClick={() => navigate('/find-agent/list')}
            >
              <span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#007AFF"/>
                </svg>
              </span>
              Browse All Agents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAgent;
