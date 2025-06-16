import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    SvgLocationIcon,
    SvgPhoneIcon,
} from "../../../../assets/svg-files/SvgFiles";
import { useDispatch, useSelector } from "react-redux";
import { GetAgentAll } from "../../../../Redux-store/Slices/AgentAllSlice";
import AgentDetailPopup from "../../../helper/AgentDetailPopup";

const FindAgentList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // Parse query parameters from URL
    const queryParams = new URLSearchParams(location.search);
    
    // States for filtering and pagination
    const [searchParams, setSearchParams] = useState({
        region: queryParams.get('region') || '',
        specialty: queryParams.get('specialty') || '',
        language: queryParams.get('language') || '',
        minRating: queryParams.get('minRating') || '',
        verified: queryParams.get('verified') === 'true' || false,
        city: queryParams.get('city') || ''
    });
    
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showAgentDetailPopup, setAgentDetailPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Available options for filter dropdowns
    const regions = ['Addis Ababa', 'Adama', 'Bahir Dar', 'Hawassa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Jimma', 'Dessie', 'Other'];
    const specialties = ['Buying', 'Selling', 'Renting', 'Commercial', 'Residential', 'Farmland', 'New Construction', 'Luxury'];
    const languages = ['Amharic', 'Afaan Oromo', 'English', 'Tigrinya', 'Somali', 'Other'];
    const ratingOptions = [
        { value: '4', label: '4+ Stars' },
        { value: '3', label: '3+ Stars' },
        { value: '2', label: '2+ Stars' },
        { value: '1', label: 'Any Rating' }
    ];
    
    // Get agent data from Redux store
    const AgentData = useSelector((state) => state.AgentAll?.data || {});
    const AgentList = AgentData?.data?.agents || [];
    const totalPages = AgentData?.data?.totalPages || 1;
    
    // Fetch agent data on component mount or when filters change
    useEffect(() => {
        try {
            dispatch(GetAgentAll({
                region: searchParams.region,
                specialty: searchParams.specialty,
                language: searchParams.language,
                minRating: searchParams.minRating,
                verified: searchParams.verified ? 'true' : '',
                city: searchParams.city,
                page: currentPage
            }));
        } catch (error) {
            console.error("Error fetching agent data:", error);
            toast.error("Failed to load agents. Please try again.");
        }
    }, [dispatch, searchParams, currentPage]);
    
    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        
        if (searchParams.region) params.append('region', searchParams.region);
        if (searchParams.specialty) params.append('specialty', searchParams.specialty);
        if (searchParams.language) params.append('language', searchParams.language);
        if (searchParams.minRating) params.append('minRating', searchParams.minRating);
        if (searchParams.verified) params.append('verified', 'true');
        if (searchParams.city) params.append('city', searchParams.city);
        
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, [searchParams, navigate, location.pathname]);

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };
    
    // Clear all filters
    const clearFilters = () => {
        setSearchParams({
            region: '',
            specialty: '',
            language: '',
            minRating: '',
            verified: false,
            city: ''
        });
        setCurrentPage(1);
    };
    
    // Handle search input change for city/location with debounce
    const onSearchInputChange = (event) => {
        const { value } = event.target;
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Set new timeout for search
        setSearchTimeout(setTimeout(() => {
            setSearchParams(prev => ({
                ...prev,
                city: value
            }));
            setCurrentPage(1);
        }, 500));
    };

    // Toggle agent detail popup
    const handleAgentDetailPopupToggle = (agent = null) => {
        if (agent) {
            setSelectedAgent(agent);
            setAgentDetailPopup(true);
        } else {
            setAgentDetailPopup(false);
            setTimeout(() => setSelectedAgent(null), 300); // Clear selection after animation
        }
    };

    // Use current location
    const useCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // In a real implementation, we would reverse geocode to get city
                    toast.info("Using your current location");
                    // For now, just clear the search to show all agents
                    clearFilters();
                    dispatch(GetAgentAll({}));
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
            <section className="common-section findagent-list-main">
                <div className="container">
                    <div className="agent-filters-section">
                        <h3>Find Real Estate Agents</h3>
                        
                        <div className="agent-filter-container">
                            <div className="agent-filter-row">
                                <div className="agent-filter-group">
                                    <label htmlFor="region">Regional State</label>
                                    <select 
                                        id="region" 
                                        name="region" 
                                        value={searchParams.region} 
                                        onChange={handleFilterChange}
                                        className="form-select"
                                    >
                                        <option value="">All Regions</option>
                                        {regions.map((region, index) => (
                                            <option key={index} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="agent-filter-group">
                                    <label htmlFor="specialty">Specialty</label>
                                    <select 
                                        id="specialty" 
                                        name="specialty" 
                                        value={searchParams.specialty} 
                                        onChange={handleFilterChange}
                                        className="form-select"
                                    >
                                        <option value="">All Specialties</option>
                                        {specialties.map((specialty, index) => (
                                            <option key={index} value={specialty}>{specialty}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="agent-filter-group">
                                    <label htmlFor="language">Language</label>
                                    <select 
                                        id="language" 
                                        name="language" 
                                        value={searchParams.language} 
                                        onChange={handleFilterChange}
                                        className="form-select"
                                    >
                                        <option value="">All Languages</option>
                                        {languages.map((language, index) => (
                                            <option key={index} value={language}>{language}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="agent-filter-group">
                                    <label htmlFor="minRating">Rating</label>
                                    <select 
                                        id="minRating" 
                                        name="minRating" 
                                        value={searchParams.minRating} 
                                        onChange={handleFilterChange}
                                        className="form-select"
                                    >
                                        <option value="">Any Rating</option>
                                        {ratingOptions.map((option, index) => (
                                            <option key={index} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="agent-filter-row">
                                <div className="agent-filter-group search-group">
                                    <label htmlFor="citySearch">City/Location</label>
                                    <input 
                                        type="text" 
                                        id="citySearch"
                                        placeholder="Enter city or location" 
                                        value={searchParams.city} 
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            setSearchParams(prev => ({...prev, city: value}));
                                            onSearchInputChange(e);
                                        }} 
                                    />
                                </div>
                                
                                <div className="agent-filter-group checkbox-group">
                                    <input 
                                        type="checkbox" 
                                        id="verified" 
                                        name="verified" 
                                        checked={searchParams.verified} 
                                        onChange={handleFilterChange} 
                                    />
                                    <label htmlFor="verified">Verified Agents Only</label>
                                </div>
                                
                                <div className="agent-filter-actions">
                                    <button type="button" onClick={clearFilters} className="btn btn-outline-secondary">
                                        Clear Filters
                                    </button>
                                    <button onClick={useCurrentLocation} className="btn btn-outline-primary">
                                        <span>
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M19.1498 0.859766C18.7678 0.470328 18.2833 0.196983 17.7524 0.07134C17.2215 -0.0543033 16.6659 -0.0271133 16.1498 0.149766L1.9998 4.87977C1.42912 5.06657 0.930493 5.42591 0.572758 5.9082C0.215023 6.39049 0.0158211 6.97193 0.00265102 7.57227C-0.010519 8.1726 0.162992 8.76223 0.499233 9.25974C0.835473 9.75725 1.31786 10.1381 1.87981 10.3498L7.1198 12.3498C7.23912 12.3954 7.34776 12.4651 7.43895 12.5546C7.53014 12.644 7.60191 12.7513 7.6498 12.8698L9.64981 18.1198C9.85339 18.6738 10.2228 19.1515 10.7078 19.4879C11.1927 19.8244 11.7696 20.0031 12.3598 19.9998H12.4298C13.0308 19.9888 13.6134 19.7901 14.0958 19.4314C14.5781 19.0728 14.9362 18.5722 15.1198 17.9998L19.8498 3.82977C20.0218 3.3187 20.0474 2.76971 19.9237 2.24485C19.8 1.72 19.5319 1.24022 19.1498 0.859766Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                        My Location
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="agentfind-list">
                        <div className="agentfnd-location-title">
                            <span>
                                <SvgLocationIcon />
                            </span>
                            <p>
                                {searchParams.region ? 
                                    `${searchParams.region} Real Estate Agents` : 
                                    searchParams.city ? 
                                    `${searchParams.city} Real Estate Agents` : 
                                    'All Real Estate Agents'
                                }
                                {AgentData?.data?.totalCount > 0 && ` (${AgentData.data.totalCount})`}
                            </p>
                        </div>
                        
                        <div className="active-filters">
                            {searchParams.specialty && (
                                <div className="filter-tag">
                                    <span>Specialty: {searchParams.specialty}</span>
                                    <button onClick={() => setSearchParams(prev => ({...prev, specialty: ''}))}>×</button>
                                </div>
                            )}
                            {searchParams.language && (
                                <div className="filter-tag">
                                    <span>Language: {searchParams.language}</span>
                                    <button onClick={() => setSearchParams(prev => ({...prev, language: ''}))}>×</button>
                                </div>
                            )}
                            {searchParams.minRating && (
                                <div className="filter-tag">
                                    <span>Rating: {searchParams.minRating}+ Stars</span>
                                    <button onClick={() => setSearchParams(prev => ({...prev, minRating: ''}))}>×</button>
                                </div>
                            )}
                            {searchParams.verified && (
                                <div className="filter-tag">
                                    <span>Verified Agents Only</span>
                                    <button onClick={() => setSearchParams(prev => ({...prev, verified: false}))}>×</button>
                                </div>
                            )}
                        </div>
                        
                        {AgentData?.pending ? (
                            <div className="agents-loading">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p>Loading agents...</p>
                            </div>
                        ) : AgentList.length === 0 ? (
                            <div className="no-agents-found">
                                <h4>No agents found</h4>
                                <p>Try adjusting your search criteria or view all agents</p>
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={clearFilters}
                                >
                                    View All Agents
                                </button>
                            </div>
                        ) : (
                            <>
                                <ul className="agent-list">
                                    {AgentList.map((agent, index) => (
                                        <li key={index} className="agent-list-item">
                                            <div 
                                                className="agent-card" 
                                                onClick={() => handleAgentDetailPopupToggle(agent)}
                                            >
                                                {agent.licenseVerified && (
                                                    <div className="verified-badge" title="Verified Agent">
                                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M21.3 12C21.3 17.2833 17.2833 21.3 12 21.3C6.71667 21.3 2.7 17.2833 2.7 12C2.7 6.71667 6.71667 2.7 12 2.7C17.2833 2.7 21.3 6.71667 21.3 12Z" stroke="white" strokeWidth="1.5"/>
                                                            <path d="M15 9L10.5 14L9 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                
                                                <div className="agent-image">
                                                    <span style={{ 
                                                        backgroundImage: agent?.profileImage 
                                                            ? `url(${agent.profileImage})` 
                                                            : 'none'
                                                    }}></span>
                                                </div>
                                                
                                                <div className="agent-info">
                                                    <div className="agent-info-top">
                                                        <div className="agent-name-info">
                                                            <h5>{`${agent?.firstName || ''} ${agent?.lastName || ''}`}</h5>
                                                            {agent.region && (
                                                                <span className="agent-region">{agent.region}</span>
                                                            )}
                                                            <p className="agent-phone">
                                                                <span>
                                                                    <SvgPhoneIcon />
                                                                </span>
                                                                {agent?.phone || 'Phone not available'}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="agent-rating">
                                                            <span>
                                                                <svg
                                                                    width="16"
                                                                    height="14"
                                                                    viewBox="0 0 16 14"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M7.99994 11.5996L11.4583 13.6913C12.0916 14.0746 12.8666 13.508 12.6999 12.7913L11.7833 8.85797L14.8416 6.20798C15.3999 5.72464 15.0999 4.80798 14.3666 4.74964L10.3416 4.40798L8.76661 0.691309C8.48327 0.0163086 7.51661 0.0163086 7.23327 0.691309L5.65827 4.39964L1.63327 4.74131C0.899939 4.79964 0.599938 5.71631 1.15827 6.19964L4.21661 8.84964L3.29994 12.783C3.13327 13.4996 3.90827 14.0663 4.5416 13.683L7.99994 11.5996Z"
                                                                        fill="#FFCC00"
                                                                    />
                                                                </svg>
                                                            </span>
                                                            {agent?.averageRating?.toFixed(1) || '0.0'}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="agent-details">
                                                        <div className="agent-detail-item">
                                                            <p>Experience: <strong>{agent?.experience || 0} years</strong></p>
                                                        </div>
                                                        
                                                        {agent.specialties && agent.specialties.length > 0 && (
                                                            <div className="agent-detail-item">
                                                                <p>Specialties:</p>
                                                                <div className="agent-specialties">
                                                                    {agent.specialties.map((specialty, idx) => (
                                                                        <span key={idx} className="specialty-tag">{specialty}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {agent.languagesSpoken && agent.languagesSpoken.length > 0 && (
                                                            <div className="agent-detail-item">
                                                                <p>Languages:</p>
                                                                <div className="agent-languages">
                                                                    {agent.languagesSpoken.map((language, idx) => (
                                                                        <span key={idx} className="language-tag">{language}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="agent-actions">
                                                        <button className="btn btn-primary btn-sm">Contact Agent</button>
                                                        <button className="btn btn-outline-primary btn-sm">View Profile</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                
                                {totalPages > 1 && (
                                    <div className="pagination-container">
                                        <button 
                                            className="pagination-btn" 
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        >
                                            Previous
                                        </button>
                                        
                                        <div className="page-numbers">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    className={`page-number ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <button 
                                            className="pagination-btn" 
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
            
            {showAgentDetailPopup && selectedAgent && (
                <AgentDetailPopup 
                    handlePopup={handleAgentDetailPopupToggle} 
                    ItemData={selectedAgent}
                />
            )}
        </>
    );
};

export default FindAgentList;
