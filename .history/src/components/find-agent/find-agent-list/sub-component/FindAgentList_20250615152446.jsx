import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaPhone, FaStar, FaTimesCircle, FaFilter } from 'react-icons/fa';

// This would be replaced with actual agent actions
// For now we'll just use placeholder actions
import { setAgentDetails } from '../../../../Redux-store/Slices/AgentSlice';
import AgentDetailPopup from '../../../helper/AgentDetailPopup';

const FindAgentList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Sample data for agents
  const sampleAgents = [
    {
      id: 1,
      name: 'Samuel Tesfaye',
      profilePicture: '',
      region: 'Addis Ababa',
      rating: 4.8,
      experience: 5,
      phone: '+251 91 234 5678',
      specialties: ['Buying', 'Selling', 'Luxury'],
      languages: ['Amharic', 'English'],
      bio: 'Experienced real estate agent specialized in luxury properties in Addis Ababa. Dedicated to helping clients find their dream homes.',
      email: 'samuel.tesfaye@example.com',
      isVerified: true,
      licenseNumber: 'ET-RE-12345',
      currentListings: 12,
      transactionsClosed: 45
    },
    {
      id: 2,
      name: 'Frehiwot Haile',
      profilePicture: '',
      region: 'Bahir Dar',
      rating: 4.5,
      experience: 3,
      phone: '+251 92 345 6789',
      specialties: ['Residential', 'Renting'],
      languages: ['Amharic', 'English', 'Tigrinya'],
      bio: 'Helping families find the perfect home in Bahir Dar. Specializing in residential properties with focus on customer satisfaction.',
      email: 'frehiwot.haile@example.com',
      isVerified: true,
      licenseNumber: 'ET-RE-23456',
      currentListings: 8,
      transactionsClosed: 27
    },
    {
      id: 3,
      name: 'Dawit Bekele',
      profilePicture: '',
      region: 'Adama',
      rating: 5.0,
      experience: 7,
      phone: '+251 93 456 7890',
      specialties: ['Commercial', 'Investment', 'Farmland'],
      languages: ['Amharic', 'Afaan Oromo'],
      bio: 'Commercial real estate expert with 7 years of experience in the Adama market. Specialized in investment properties and farmland.',
      email: 'dawit.bekele@example.com',
      isVerified: true,
      licenseNumber: 'ET-RE-34567',
      currentListings: 15,
      transactionsClosed: 63
    },
    {
      id: 4,
      name: 'Tigist Mulugeta',
      profilePicture: '',
      region: 'Hawassa',
      rating: 4.2,
      experience: 2,
      phone: '+251 94 567 8901',
      specialties: ['Residential', 'Selling'],
      languages: ['Amharic', 'English', 'Sidama'],
      bio: 'Passionate about real estate in the beautiful city of Hawassa. Helping sellers get the best value for their properties.',
      email: 'tigist.mulugeta@example.com',
      isVerified: false,
      licenseNumber: 'Pending',
      currentListings: 5,
      transactionsClosed: 12
    },
    {
      id: 5,
      name: 'Abebe Kebede',
      profilePicture: '',
      region: 'Dire Dawa',
      rating: 4.9,
      experience: 10,
      phone: '+251 95 678 9012',
      specialties: ['Luxury', 'Buying', 'Selling'],
      languages: ['Amharic', 'English', 'Somali'],
      bio: 'Veteran real estate professional with a decade of experience in Dire Dawa. Exceptional track record in luxury property sales.',
      email: 'abebe.kebede@example.com',
      isVerified: true,
      licenseNumber: 'ET-RE-45678',
      currentListings: 18,
      transactionsClosed: 110
    },
    {
      id: 6,
      name: 'Hiwot Girma',
      profilePicture: '',
      region: 'Gondar',
      rating: 4.7,
      experience: 4,
      phone: '+251 96 789 0123',
      specialties: ['Residential', 'Commercial', 'Renting'],
      languages: ['Amharic', 'English'],
      bio: 'Dedicated real estate agent serving the historic city of Gondar. Specializing in both residential and commercial properties.',
      email: 'hiwot.girma@example.com',
      isVerified: true,
      licenseNumber: 'ET-RE-56789',
      currentListings: 10,
      transactionsClosed: 32
    }
  ];

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    specialty: '',
    language: '',
    rating: '',
    verifiedOnly: false
  });
  const [showAgentPopup, setShowAgentPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Parse query parameters from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    const newFilters = {
      region: queryParams.get('region') || '',
      specialty: queryParams.get('specialty') || '',
      language: queryParams.get('language') || '',
      rating: queryParams.get('rating') || '',
      verifiedOnly: queryParams.get('verifiedOnly') === 'true'
    };
    
    setFilters(newFilters);
    
    // Simulate API call to get agents
    setLoading(true);
    
    // Filter agents based on query parameters
    const filteredAgents = filterAgents(sampleAgents, newFilters);
    
    setTimeout(() => {
      setAgents(filteredAgents);
      setTotalPages(Math.ceil(filteredAgents.length / itemsPerPage));
      setLoading(false);
    }, 500);
  }, [location.search, itemsPerPage]);

  const filterAgents = (agents, filters) => {
    return agents.filter(agent => {
      // Filter by region
      if (filters.region && !agent.region.toLowerCase().includes(filters.region.replace('-', ' '))) {
        return false;
      }
      
      // Filter by specialty
      if (filters.specialty && !agent.specialties.some(s => s.toLowerCase().includes(filters.specialty))) {
        return false;
      }
      
      // Filter by language
      if (filters.language && !agent.languages.some(l => l.toLowerCase().includes(filters.language.replace('-', ' ')))) {
        return false;
      }
      
      // Filter by rating
      if (filters.rating && agent.rating < parseInt(filters.rating)) {
        return false;
      }
      
      // Filter by verification status
      if (filters.verifiedOnly && !agent.isVerified) {
        return false;
      }
      
      return true;
    });
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    };
    setFilters(newFilters);
    
    // Update URL with new filters
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };

  const clearFilter = (filterName) => {
    const newFilters = { ...filters, [filterName]: '' };
    setFilters(newFilters);
    
    // Update URL with new filters
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };

  const clearAllFilters = () => {
    const newFilters = {
      region: '',
      specialty: '',
      language: '',
      rating: '',
      verifiedOnly: false
    };
    setFilters(newFilters);
    navigate('/find-agent/list');
  };

  const handleViewAgentDetails = (agent) => {
    dispatch(setAgentDetails(agent));
    setShowAgentPopup(true);
  };

  const closeAgentPopup = () => {
    setShowAgentPopup(false);
  };

  // Get current agents for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = agents.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="star half-filled" />);
      } else {
        stars.push(<FaStar key={i} className="star" />);
      }
    }
    
    return (
      <div className="agent-rating">
        {stars} <span>({rating})</span>
      </div>
    );
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.region || filters.specialty || filters.language || filters.rating || filters.verifiedOnly;
  };

  return (
    <div className="findagent-list-main">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* Filters Section */}
            <div className="agent-filters-section">
              <h3>Filter Agents</h3>
              
              <div className="agent-filter-container">
                <div className="agent-filter-row">
                  <div className="agent-filter-group">
                    <label htmlFor="region-filter">Region/City</label>
                    <select 
                      id="region-filter" 
                      name="region" 
                      value={filters.region}
                      onChange={handleFilterChange}
                    >
                      
                      <option value="">All Regions</option>
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
                  
                  <div className="agent-filter-group">
                    <label htmlFor="specialty-filter">Specialty</label>
                    <select 
                      id="specialty-filter" 
                      name="specialty" 
                      value={filters.specialty}
                      onChange={handleFilterChange}
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
                  
                  <div className="agent-filter-group">
                    <label htmlFor="language-filter">Language</label>
                    <select 
                      id="language-filter" 
                      name="language" 
                      value={filters.language}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Languages</option>
                      <option value="amharic">Amharic</option>
                      <option value="afaan-oromo">Afaan Oromo</option>
                      <option value="english">English</option>
                      <option value="tigrinya">Tigrinya</option>
                      <option value="somali">Somali</option>
                    </select>
                  </div>
                  
                  <div className="agent-filter-group">
                    <label htmlFor="rating-filter">Minimum Rating</label>
                    <select 
                      id="rating-filter" 
                      name="rating" 
                      value={filters.rating}
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
                      id="verifiedOnly-filter" 
                      name="verifiedOnly" 
                      checked={filters.verifiedOnly}
                      onChange={handleFilterChange}
                    />
                    <label htmlFor="verifiedOnly-filter">Verified Only</label>
                  </div>
                  
                  <div className="agent-filter-actions">
                    {hasActiveFilters() && (
                      <button className="secondary-btn" onClick={clearAllFilters}>
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Active Filters Display */}
              {hasActiveFilters() && (
                <div className="active-filters">
                  {filters.region && (
                    <div className="filter-tag">
                      Region: {filters.region.replace('-', ' ')}
                      <button onClick={() => clearFilter('region')}><FaTimesCircle /></button>
                    </div>
                  )}
                  
                  {filters.specialty && (
                    <div className="filter-tag">
                      Specialty: {filters.specialty}
                      <button onClick={() => clearFilter('specialty')}><FaTimesCircle /></button>
                    </div>
                  )}
                  
                  {filters.language && (
                    <div className="filter-tag">
                      Language: {filters.language.replace('-', ' ')}
                      <button onClick={() => clearFilter('language')}><FaTimesCircle /></button>
                    </div>
                  )}
                  
                  {filters.rating && (
                    <div className="filter-tag">
                      {filters.rating}+ Stars
                      <button onClick={() => clearFilter('rating')}><FaTimesCircle /></button>
                    </div>
                  )}
                  
                  {filters.verifiedOnly && (
                    <div className="filter-tag">
                      Verified Only
                      <button onClick={() => clearFilter('verifiedOnly')}><FaTimesCircle /></button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Agent List Section */}
            <div className="agentfind-list">
              <div className="agentfnd-location-title">
                <p>
                  {agents.length} Agents {filters.region ? `in ${filters.region.replace('-', ' ')}` : 'Available'}
                </p>
              </div>
              
              {loading ? (
                <div className="agents-loading">
                  <p>Loading agents...</p>
                </div>
              ) : agents.length === 0 ? (
                <div className="no-agents-found">
                  <h4>No Agents Found</h4>
                  <p>Try adjusting your filters to see more results.</p>
                  <button className="primary-btn" onClick={clearAllFilters}>Clear All Filters</button>
                </div>
              ) : (
                <>
                  <ul className="agent-list">
                    {currentAgents.map(agent => (
                      <li key={agent.id} className="agent-list-item">
                        <div className="agent-card" onClick={() => handleViewAgentDetails(agent)}>
                          {agent.isVerified && (
                            <div className="verified-badge" title="Verified Agent">
                              <FaCheck />
                            </div>
                          )}
                          
                          <div className="agent-image">
                            <span style={{backgroundImage: agent.profilePicture ? `url(${agent.profilePicture})` : 'none'}}></span>
                          </div>
                          
                          <div className="agent-info">
                            <div className="agent-info-top">
                              <div className="agent-name-info">
                                <h5>{agent.name}</h5>
                                <div className="agent-region">{agent.region}</div>
                                <div className="agent-phone">
                                  <FaPhone /> {agent.phone}
                                </div>
                              </div>
                              
                              <div>
                                {renderStars(agent.rating)}
                              </div>
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
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-container">
                      <button 
                        className="pagination-btn"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      
                      <div className="page-numbers">
                        {[...Array(totalPages).keys()].map(number => (
                          <button
                            key={number + 1}
                            className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                            onClick={() => paginate(number + 1)}
                          >
                            {number + 1}
                          </button>
                        ))}
                      </div>
                      
                      <button 
                        className="pagination-btn"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Agent Detail Popup */}
      {showAgentPopup && (
        <AgentDetailPopup onClose={closeAgentPopup} />
      )}
    </div>
  );
};

export default FindAgentList;
