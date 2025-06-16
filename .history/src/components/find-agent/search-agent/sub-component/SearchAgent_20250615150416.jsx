import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const SearchAgent = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    region: '',
    specialty: '',
    language: '',
    rating: '',
    verifiedOnly: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchForm({
      ...searchForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query string from form values
    const queryParams = new URLSearchParams();
    
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };

  const handleBrowseAll = () => {
    navigate('/find-agent/list');
  };

  return (
    <div className="search-agent-main">
      <div className="container">
        <div className="scrchagent-inner">
          <div className="srchagent-heading">
            <h3>Find a Real Estate Agent</h3>
            <p>Search for professional agents in your area</p>
          </div>

          <form className="agent-search-form" onSubmit={handleSubmit}>
            <div className="search-form-row">
              <div className="search-form-group">
                <label htmlFor="region">Region/City</label>
                <select 
                  id="region" 
                  name="region" 
                  value={searchForm.region}
                  onChange={handleInputChange}
                >
                  <option value="">Select Region</option>
                  <option value="addis-ababa">Addis Ababa</option>
                  <option value="adama">Adama</option>
                  <option value="bahir-dar">Bahir Dar</option>
                  <option value="hawassa">Hawassa</option>
                  <option value="dire-dawa">Dire Dawa</option>
                  <option value="mekelle">Mekelle</option>
                  <option value="gondar">Gondar</option>
                  <option value="jimma">Jimma</option>
                </select>
              </div>

              <div className="search-form-group">
                <label htmlFor="specialty">Specialty</label>
                <select 
                  id="specialty" 
                  name="specialty" 
                  value={searchForm.specialty}
                  onChange={handleInputChange}
                >
                  <option value="">All Specialties</option>
                  <option value="buying">Buying</option>
                  <option value="selling">Selling</option>
                  <option value="renting">Renting</option>
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                  <option value="luxury">Luxury Homes</option>
                  <option value="farmland">Farmland</option>
                  <option value="investment">Investment Properties</option>
                </select>
              </div>
            </div>

            <div className="search-form-row">
              <div className="search-form-group">
                <label htmlFor="language">Language</label>
                <select 
                  id="language" 
                  name="language" 
                  value={searchForm.language}
                  onChange={handleInputChange}
                >
                  <option value="">All Languages</option>
                  <option value="amharic">Amharic</option>
                  <option value="afaan-oromo">Afaan Oromo</option>
                  <option value="english">English</option>
                  <option value="tigrinya">Tigrinya</option>
                  <option value="somali">Somali</option>
                </select>
              </div>

              <div className="search-form-group">
                <label htmlFor="rating">Minimum Rating</label>
                <select 
                  id="rating" 
                  name="rating" 
                  value={searchForm.rating}
                  onChange={handleInputChange}
                >
                  <option value="">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
            </div>

            <div className="search-form-checkbox">
              <input 
                type="checkbox" 
                id="verifiedOnly" 
                name="verifiedOnly" 
                checked={searchForm.verifiedOnly}
                onChange={handleInputChange}
              />
              <label htmlFor="verifiedOnly">Show only verified agents</label>
            </div>

            <div className="search-form-actions">
              <button type="submit" className="primary-btn">Search Agents</button>
            </div>
          </form>

          <div className="search-divider">
            <span>OR</span>
          </div>

          <div className="findagent-loaction">
            <button className="location-link" onClick={handleBrowseAll}>
              <FaMapMarkerAlt />
              Browse All Agents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAgent;
