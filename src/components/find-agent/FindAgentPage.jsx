import React from 'react';

const FindAgentPage = () => {
  return (
    <div className="find-agent-page">
      <div className="container">
        <div className="page-header">
          <h1>Find a Real Estate Agent</h1>
          <p>Connect with experienced real estate professionals in Ethiopia</p>
        </div>
        
        <div className="search-filters">
          <div className="search-input-wrapper">
            <input 
              type="text" 
              placeholder="Search by name, location, or specialty..." 
              className="search-input"
            />
            <button className="search-btn">Search</button>
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <label>Location</label>
              <select className="filter-select">
                <option>All Locations</option>
                <option>Addis Ababa</option>
                <option>Dire Dawa</option>
                <option>Gondar</option>
                <option>Hawassa</option>
                <option>Bahir Dar</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Specialty</label>
              <select className="filter-select">
                <option>All Specialties</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Luxury</option>
                <option>Investment</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Experience</label>
              <select className="filter-select">
                <option>Any Experience</option>
                <option>1+ Years</option>
                <option>3+ Years</option>
                <option>5+ Years</option>
                <option>10+ Years</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort By</label>
              <select className="filter-select">
                <option>Most Relevant</option>
                <option>Highest Rated</option>
                <option>Most Experienced</option>
                <option>Most Recent</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="agent-results">
          <div className="results-info">
            <h3>0 Agents Found</h3>
          </div>
          
          <div className="agent-list">
            <div className="empty-state">
              <h3>No agents match your search criteria</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          </div>
        </div>
        
        <div className="become-agent-cta">
          <div className="cta-content">
            <h2>Are You a Real Estate Professional?</h2>
            <p>Join our network of trusted agents and connect with potential clients</p>
            <button className="primary-btn">Join as an Agent</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindAgentPage;
