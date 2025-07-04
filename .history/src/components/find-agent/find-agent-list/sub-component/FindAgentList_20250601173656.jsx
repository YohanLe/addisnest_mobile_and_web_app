import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    const [searchInput, setSearchInput] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showAgentDetailPopup, setAgentDetailPopup] = useState(false);
    
    // Get agent data from Redux store
    const AgentData = useSelector((state) => state.AgentAll?.data || {});
    const AgentList = AgentData?.data?.agents || [];
    
    useEffect(() => {
        try {
            // Fetch agent data on component mount
            dispatch(GetAgentAll({city: ''}));
        } catch (error) {
            console.error("Error fetching agent data:", error);
            toast.error("Failed to load agents. Please try again.");
        }
    }, [dispatch]);

    // Handle search input change with debounce
    const onSearchInputChange = (event) => {
        const { value } = event.target;
        setSearchInput(value);
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Set new timeout for search
        setSearchTimeout(setTimeout(() => {
            try {
                dispatch(GetAgentAll({city: value}));
            } catch (error) {
                console.error("Error searching agents:", error);
                toast.error("Search failed. Please try again.");
            }
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
                    setSearchInput('');
                    dispatch(GetAgentAll({city: ''}));
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
                    <div className="search-field">
                        <h3>Where is your Home?</h3>
                        <div className="findlisting-tp">
                            <div className="findagent-srcg-input">
                                <input 
                                    type="text" 
                                    value={searchInput} 
                                    onChange={onSearchInputChange} 
                                    placeholder="Enter address or city" 
                                />
                                <button className="btn btn-primary">
                                    Search
                                </button>
                            </div>
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
                                Use my current location
                            </button>
                        </div>
                    </div>
                    
                    <div className="agentfind-list">
                        <div className="agentfnd-location-title">
                            <span>
                                <SvgLocationIcon />
                            </span>
                            <p>{searchInput ? `${searchInput}` : 'All'} Real Estate Agents</p>
                        </div>
                        
                        {AgentList.length === 0 ? (
                            <div className="no-agents-found">
                                <h4>No agents found</h4>
                                <p>Try adjusting your search criteria or view all agents</p>
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => {
                                        setSearchInput('');
                                        dispatch(GetAgentAll({city: ''}));
                                    }}
                                >
                                    View All Agents
                                </button>
                            </div>
                        ) : (
                            <ul>
                                {AgentList.map((agent, index) => (
                                    <li key={index}>
                                        <div 
                                            className="fndagent-profile-main" 
                                            onClick={() => handleAgentDetailPopupToggle(agent)}
                                        >
                                            <div className="fndagent-pfle-img">
                                                <span style={{ 
                                                    backgroundImage: agent?.profile_img 
                                                        ? `url(${agent.profile_img})` 
                                                        : 'none'
                                                }}></span>
                                            </div>
                                            <div className="fndagent-descp">
                                                <div className="fndagent-descp-top">
                                                    <div className="fndagnt-detail">
                                                        <h5>{agent?.name || 'Agent Name'}</h5>
                                                        <p>
                                                            <span>
                                                                <SvgPhoneIcon />
                                                            </span>
                                                            {agent?.phone || 'Phone not available'}
                                                        </p>
                                                    </div>
                                                    <div className="fidagent-rating">
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
                                                        {agent?.average_rating || '0.0'}
                                                    </div>
                                                </div>
                                                <div className="fndagent-descp-btm">
                                                    <p>
                                                        Total Deals:
                                                        <span> {agent?.deals || 0}</span>
                                                    </p>
                                                    <h5>
                                                        <span>
                                                            <SvgLocationIcon />
                                                        </span>
                                                        {agent?.address || 'Address not available'}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
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
