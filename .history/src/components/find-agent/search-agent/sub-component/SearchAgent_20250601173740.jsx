import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SearchAgent = () => {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  // Handle search input change
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() === '') {
      toast.info("Please enter an address or location to search");
      return;
    }
    // Navigate to the find-agent-list page with search query
    navigate(`/find-agent-list?query=${encodeURIComponent(searchInput)}`);
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
          navigate('/find-agent-list');
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
            <div className="search-field">
              <h3>Where is your Home?</h3>
              <form onSubmit={handleSearch} className="findagent-srcg-input">
                <input 
                  type="text" 
                  placeholder="Enter address here" 
                  value={searchInput}
                  onChange={handleInputChange}
                  aria-label="Enter your home address"
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </form>
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
        </div>
      </div>
    </>
  );
};

export default SearchAgent;
