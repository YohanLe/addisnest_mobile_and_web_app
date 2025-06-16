import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AgentDetailPopup from '../../../helper/AgentDetailPopup';

// Sample agent data (in a real app, this would come from an API)
const sampleAgents = [
  {
    id: 1,
    name: 'Abebe Kebede',
    profilePicture: '',
    region: 'Addis Ababa',
    rating: 4.8,
    experience: 5,
    phone: '+251 91 234 5678',
    specialties: ['Buying', 'Selling', 'Residential'],
    languages: ['Amharic', 'English'],
    bio: 'I am a professional real estate agent with 5 years of experience in Addis Ababa. I specialize in residential properties and have helped over 50 families find their dream homes.',
    email: 'abebe.kebede@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2025-1234',
    currentListings: 12,
    transactionsClosed: 45
  },
  {
    id: 2,
    name: 'Tigist Alemayehu',
    profilePicture: '',
    region: 'Adama',
    rating: 4.5,
    experience: 3,
    phone: '+251 92 345 6789',
    specialties: ['Renting', 'Commercial'],
    languages: ['Amharic', 'Afaan Oromo'],
    bio: 'As a real estate agent based in Adama, I focus on commercial properties and rental services. I have extensive knowledge of the local market and can help you find the perfect space for your business.',
    email: 'tigist.alemayehu@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2025-2345',
    currentListings: 8,
    transactionsClosed: 23
  },
  {
    id: 3,
    name: 'Dawit Haile',
    profilePicture: '',
    region: 'Bahir Dar',
    rating: 5.0,
    experience: 7,
    phone: '+251 93 456 7890',
    specialties: ['Luxury', 'Farmland', 'Investment'],
    languages: ['Amharic', 'English'],
    bio: 'With 7 years in real estate around Bahir Dar, I specialize in luxury properties and investment opportunities. I can help you find high-value properties with great ROI potential.',
    email: 'dawit.haile@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2024-3456',
    currentListings: 15,
    transactionsClosed: 62
  },
  {
    id: 4,
    name: 'Sara Tesfaye',
    profilePicture: '',
    region: 'Hawassa',
    rating: 4.2,
    experience: 2,
    phone: '+251 94 567 8901',
    specialties: ['Buying', 'Renting'],
    languages: ['Amharic', 'Sidama', 'English'],
    bio: 'I am a dedicated real estate agent serving the Hawassa area. I specialize in helping first-time buyers navigate the real estate market and find affordable homes.',
    email: 'sara.tesfaye@example.com',
    isVerified: false,
    licenseNumber: '',
    currentListings: 6,
    transactionsClosed: 15
  },
  {
    id: 5,
    name: 'Berhanu Tadesse',
    profilePicture: '',
    region: 'Addis Ababa',
    rating: 4.7,
    experience: 10,
    phone: '+251 95 678 9012',
    specialties: ['Commercial', 'Investment'],
    languages: ['Amharic', 'English', 'Tigrinya'],
    bio: 'With a decade of experience in Addis Ababa\'s real estate market, I specialize in commercial properties and investment opportunities. I have helped numerous businesses find their ideal locations and investors maximize their returns.',
    email: 'berhanu.tadesse@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2021-4567',
    currentListings: 20,
    transactionsClosed: 85
  },
  {
    id: 6,
    name: 'Hiwot Bekele',
    profilePicture: '',
    region: 'Dire Dawa',
    rating: 4.6,
    experience: 4,
    phone: '+251 96 789 0123',
    specialties: ['Residential', 'Selling'],
    languages: ['Amharic', 'Somali', 'English'],
    bio: 'Based in Dire Dawa, I help clients sell their properties at the best possible price. I provide comprehensive market analysis and marketing strategies to ensure quick and profitable sales.',
    email: 'hiwot.bekele@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2023-5678',
    currentListings: 10,
    transactionsClosed: 32
  },
  {
    id: 7,
    name: 'Yonas Asfaw',
    profilePicture: '',
    region: 'Mekelle',
    rating: 4.3,
    experience: 6,
    phone: '+251 97 890 1234',
    specialties: ['Buying', 'Farmland'],
    languages: ['Tigrinya', 'Amharic'],
    bio: 'I specialize in agricultural and farmland properties in the Tigray region. With 6 years of experience, I can help you find productive land with good water access and soil quality.',
    email: 'yonas.asfaw@example.com',
    isVerified: false,
    licenseNumber: '',
    currentListings: 8,
    transactionsClosed: 27
  },
  {
    id: 8,
    name: 'Meskerem Abera',
    profilePicture: '',
    region: 'Gondar',
    rating: 4.9,
    experience: 8,
    phone: '+251 98 901 2345',
    specialties: ['Luxury', 'Residential'],
    languages: ['Amharic', 'English'],
    bio: 'I am a top-rated real estate agent in Gondar with expertise in luxury and high-end residential properties. I provide personalized service to discerning clients looking for exceptional homes.',
    email: 'meskerem.abera@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2022-6789',
    currentListings: 14,
    transactionsClosed: 56
  }
];

const FindAgentList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    region: '',
    specialty: '',
    language: '',
    minRating: '',
    verifiedOnly: false
  });
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentDetail, setShowAgentDetail] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [agentsPerPage] = useState(5);
  
  // Get current agents for pagination
  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);
  
  // Parse URL search params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    setSearchParams({
      region: queryParams.get('region') || '',
      specialty: queryParams.get('specialty') || '',
      language: queryParams.get('language') || '',
      minRating: queryParams.get('minRating') || '',
      verifiedOnly: queryParams.get('verifiedOnly') === 'true'
    });
    
    // In a real app, you would fetch agents from an API here
    // For now, simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
    
  }, [location.search]);
  
  // Filter agents based on search params
  useEffect(() => {
    if (!loading) {
      let results = [...sampleAgents];
      
      if (searchParams.region) {
        results = results.filter(agent => agent.region === searchParams.region);
      }
      
      if (searchParams.specialty) {
        results = results.filter(agent => 
          agent.specialties.includes(searchParams.specialty)
        );
      }
      
      if (searchParams.language) {
        results = results.filter(agent => 
          agent.languages.includes(searchParams.language)
        );
      }
      
      if (searchParams.minRating) {
        results = results.filter(agent => 
          agent.rating >= parseFloat(searchParams.minRating)
        );
      }
      
      if (searchParams.verifiedOnly) {
        results = results.filter(agent => agent.isVerified);
      }
      
      setFilteredAgents(results);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [searchParams, loading]);
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newParams = {
      ...searchParams,
      [name]: type === 'checkbox' ? checked : value
    };
    
    setSearchParams(newParams);
    
    // Update URL without reloading the page
    const queryParams = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchParams({
      region: '',
      specialty: '',
      language: '',
      minRating: '',
      verifiedOnly: false
    });
    
    navigate('/find-agent/list');
  };
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // View agent details
  const viewAgentDetails = (agent) => {
    setSelectedAgent(agent);
    setShowAgentDetail(true);
  };
  
  // Close agent details popup
  const closeAgentDetail = () => {
    setShowAgentDetail(false);
    setSelectedAgent(null);
  };
  
  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} style={{ color: '#FFCC00' }}>★</span>
        );
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(
          <span key={i} style={{ color: '#FFCC00' }}>★</span>
        );
      } else {
        stars.push(
          <span key={i} style={{ color: '#ccc' }}>★</span>
        );
      }
    }
    
    return (
      <div className="agent-rating">
        {stars} <span style={{ color: '#333', marginLeft: '5px' }}>{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="findagent-list-main">
      <div className="container">
        <div className="agent-filters-section">
          <h3>Find Real Estate Agents</h3>
          
          <div className="agent-filter-container">
            <div className="agent-filter-row">
              <div className="agent-filter-group">
                <label htmlFor="region">Region/City</label>
                <select 
                  id="region" 
                  name="region" 
                  value={searchParams.region}
                  onChange={handleFilterChange}
                >
                  <option value="">All Regions</option>
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
              
              <div className="agent-filter-group">
                <label htmlFor="specialty">Specialty</label>
                <select 
                  id="specialty" 
                  name="specialty"
                  value={searchParams.specialty}
                  onChange={handleFilterChange}
                >
                  <option value="">All Specialties</option>
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
              
              <div className="agent-filter-group">
                <label htmlFor="language">Language</label>
                <select 
                  id="language" 
                  name="language"
                  value={searchParams.language}
                  onChange={handleFilterChange}
                >
                  <option value="">All Languages</option>
                  <option value="Amharic">Amharic</option>
                  <option value="Afaan Oromo">Afaan Oromo</option>
                  <option value="English">English</option>
                  <option value="Tigrinya">Tigrinya</option>
                  <option value="Somali">Somali</option>
                </select>
              </div>
              
              <div className="agent-filter-group">
                <label htmlFor="minRating">Minimum Rating</label>
                <select 
                  id="minRating" 
                  name="minRating"
                  value={searchParams.minRating}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              
              <div className="agent-filter-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="verifiedOnly" 
                  name="verifiedOnly"
                  checked={searchParams.verifiedOnly}
                  onChange={handleFilterChange}
                />
                <label htmlFor="verifiedOnly">Verified Agents Only</label>
              </div>
              
              <div className="agent-filter-actions">
                <button 
                  onClick={resetFilters}
                  style={{ backgroundColor: '#f0f0f0', border: 'none', color: '#555' }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
          
          {Object.values(searchParams).some(value => value) && (
            <div className="active-filters">
              {searchParams.region && (
                <div className="filter-tag">
                  Region: {searchParams.region}
                  <button onClick={() => handleFilterChange({ target: { name: 'region', value: '' } })}>×</button>
                </div>
              )}
              
              {searchParams.specialty && (
                <div className="filter-tag">
                  Specialty: {searchParams.specialty}
                  <button onClick={() => handleFilterChange({ target: { name: 'specialty', value: '' } })}>×</button>
                </div>
              )}
              
              {searchParams.language && (
                <div className="filter-tag">
                  Language: {searchParams.language}
                  <button onClick={() => handleFilterChange({ target: { name: 'language', value: '' } })}>×</button>
                </div>
              )}
              
              {searchParams.minRating && (
                <div className="filter-tag">
                  Rating: {searchParams.minRating}+ Stars
                  <button onClick={() => handleFilterChange({ target: { name: 'minRating', value: '' } })}>×</button>
                </div>
              )}
              
              {searchParams.verifiedOnly && (
                <div className="filter-tag">
                  Verified Only
                  <button onClick={() => handleFilterChange({ target: { name: 'verifiedOnly', type: 'checkbox', checked: false } })}>×</button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="agentfind-list">
          <div className="agentfnd-location-title">
            <p>
              {searchParams.region 
                ? `Real Estate Agents in ${searchParams.region}` 
                : 'All Real Estate Agents'}
            </p>
          </div>
          
          {loading ? (
            <div className="agents-loading">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p>Loading agents...</p>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="no-agents-found">
              <h4>No agents found</h4>
              <p>Try adjusting your filters or search criteria</p>
              <button 
                onClick={resetFilters}
                className="primary-btn"
              >
                View All Agents
              </button>
            </div>
          ) : (
            <>
              <ul className="agent-list">
                {currentAgents.map(agent => (
                  <li key={agent.id} className="agent-list-item">
                    <div 
                      className="agent-card"
                      onClick={() => viewAgentDetails(agent)}
                    >
                      {agent.isVerified && (
                        <div className="verified-badge" title="Verified Agent">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                          </svg>
                        </div>
                      )}
                      
                      <div className="agent-image">
                        <span style={{
                          backgroundImage: agent.profilePicture 
                            ? `url(${agent.profilePicture})` 
                            : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          color: '#007AFF'
                        }}>
                          {!agent.profilePicture && agent.name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="agent-info">
                        <div className="agent-info-top">
                          <div className="agent-name-info">
                            <h5>{agent.name}</h5>
                            <div className="agent-region">{agent.region}</div>
                            <div className="agent-phone">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="#666"/>
                              </svg>
                              {agent.phone}
                            </div>
                          </div>
                          
                          {renderStars(agent.rating)}
                        </div>
                        
                        <div className="agent-details">
                          <div className="agent-detail-item">
                            <p><strong>Experience:</strong> {agent.experience} years</p>
                          </div>
                          
                          <div className="agent-detail-item">
                            <p><strong>Specialties:</strong></p>
                            <div className="agent-specialties">
                              {agent.specialties.map((specialty, index) => (
                                <span key={index} className="specialty-tag">{specialty}</span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="agent-detail-item">
                            <p><strong>Languages:</strong></p>
                            <div className="agent-languages">
                              {agent.languages.map((language, index) => (
                                <span key={index} className="language-tag">{language}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="agent-actions">
                          <button 
                            className="primary-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewAgentDetails(agent);
                            }}
                            style={{ backgroundColor: '#007AFF', color: 'white', border: 'none' }}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              {/* Pagination */}
              {filteredAgents.length > agentsPerPage && (
                <div className="pagination-container">
                  <button 
                    className="pagination-btn"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  <div className="page-numbers">
                    {Array.from({ length: Math.ceil(filteredAgents.length / agentsPerPage) }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className="pagination-btn"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredAgents.length / agentsPerPage)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Agent Detail Popup */}
      {showAgentDetail && selectedAgent && (
        <AgentDetailPopup 
          agent={selectedAgent} 
          onClose={closeAgentDetail} 
        />
      )}
    </div>
  );
};

export default FindAgentList;
