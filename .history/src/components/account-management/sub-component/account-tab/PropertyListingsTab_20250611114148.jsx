import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetPropertyList } from "../../../../Redux-store/Slices/PropertyListSlice";

const PropertyListingsTab = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "ACTIVE", "SOLD", "PENDING", "REJECTED"];
  
  // Get property list data from Redux store, local storage, and navigation state
  const location = useLocation();
  const propertyData = useSelector((state) => state.PropertyList.Data);
  const propertyListData = propertyData?.data?.data || propertyData?.data;
  
  // Check for newly submitted property in navigation state
  const [newSubmittedProperty, setNewSubmittedProperty] = useState(null);
  
  useEffect(() => {
    // Check if we have a new property in the navigation state
    if (location.state?.propertyData && location.state?.showPropertyAlert) {
      console.log("Found newly submitted property in navigation state:", location.state.propertyData);
      setNewSubmittedProperty(location.state.propertyData);
      
      // Store in localStorage for persistence
      try {
        // Get existing property listings from localStorage
        const existingListings = localStorage.getItem('propertyListings');
        const parsedListings = existingListings ? JSON.parse(existingListings) : [];
        
        // Add the new property to the array
        const updatedListings = [location.state.propertyData, ...parsedListings];
        
        // Save back to localStorage
        localStorage.setItem('propertyListings', JSON.stringify(updatedListings));
        console.log("Saved newly submitted property to localStorage");
      } catch (error) {
        console.error("Error saving new property to localStorage:", error);
      }
    }
  }, [location.state]);
  
  // Try to also get properties from localStorage for more complete data
  const getLocalStorageProperties = () => {
    try {
      // Try multiple localStorage keys - the app uses different ones in different places
      const keys = [
        'propertyListings',          // PropertyAlert component
        'property_listings',         // Alternative format
        'user_property_listings',    // Another possible key
        'addinest_properties'        // Another possible key
      ];
      
      let allListings = [];
      
      // Check all possible localStorage keys
      for (const key of keys) {
        const savedListings = localStorage.getItem(key);
        if (savedListings) {
          console.log(`Found saved listings in localStorage under key: ${key}`);
          const parsed = JSON.parse(savedListings);
          if (Array.isArray(parsed)) {
            allListings = [...allListings, ...parsed];
          } else if (parsed && typeof parsed === 'object') {
            allListings.push(parsed);
          }
        }
      }
      
      // Try to also get the property edit data that might be in localStorage
      const editData = localStorage.getItem('property_edit_data');
      if (editData) {
        const parsedEditData = JSON.parse(editData);
        if (parsedEditData && typeof parsedEditData === 'object') {
          console.log("Found property_edit_data in localStorage");
          allListings.push(parsedEditData);
        }
      }
      
      return allListings;
    } catch (error) {
      console.error("Error loading saved listings:", error);
    }
    return [];
  };
  
  // Get both API data and localStorage data
  const localStorageProperties = getLocalStorageProperties();
  console.log("Found", localStorageProperties.length, "properties in localStorage");
  console.log("Found", (propertyListData || []).length, "properties from API/database");
  
  // Combine all sources with API/database data taking priority
  const combinedPropertyList = [
    ...(newSubmittedProperty ? [newSubmittedProperty] : []), // Add newly submitted property first (highest priority)
    ...(propertyListData || []),                             // Then API/database data
    ...localStorageProperties                                // Then localStorage data
  ];
  
  // Remove duplicates by ID or similar properties
  const uniquePropertyList = combinedPropertyList.reduce((acc, current) => {
    const x = acc.find(item => 
      (item.id === current.id || item._id === current._id) || 
      (item.address === current.address && 
       (item.price === current.price || item.total_price === current.total_price))
    );
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  
  // Sort properties by creation date - newest first
  const propertyList = uniquePropertyList.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || a.uploadDate || 0);
    const dateB = new Date(b.createdAt || b.created_at || b.uploadDate || 0);
    return dateB - dateA; // Descending order (newest first)
  });

  // Enhanced offering type detection with support for multiple data formats
  const getOfferingType = (item) => {
    // Check all possible property offering type fields
    if (item?.property_for === "For Sale" || 
        item?.offeringType === "For Sale") {
      return { type: 'sale', label: 'FOR SALE' };
    }
    if (item?.property_for === "For Rent" || 
        item?.offeringType === "For Rent") {
      return { type: 'rent', label: 'FOR RENT' };
    }
    
    // Check for listing_type as alternative
    if (item?.listing_type === "sell" || item?.listing_type === "sale") {
      return { type: 'sale', label: 'FOR SALE' };
    }
    if (item?.listing_type === "rent") {
      return { type: 'rent', label: 'FOR RENT' };
    }
    
    // Default fallback for properties with unknown offering type
    return { type: 'unknown', label: item?.offeringType || 'N/A' };
  };
  
  // Fetch property listings from database when tab changes
  useEffect(() => {
    console.log("Fetching property data from database for tab:", activeTab);
    
    // Always fetch from API to get latest database data
    if (activeTab === 'All') {
      dispatch(GetPropertyList({ type: '' }));
    } else {
      dispatch(GetPropertyList({ type: activeTab }));
    }
  }, [activeTab, dispatch]);

  // Action dropdown component
  const ActionDropdown = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
    
    return (
      <div className="action-dropdown">
        <button 
          onClick={toggleDropdown}
          className="action-btn"
        >
          Action ▼
        </button>
        {isOpen && (
            <div className="dropdown-menu">
              <Link to={`/property-detail/${item.id}`} className="dropdown-item">View</Link>
              <Link 
                to={`/property-edit/${item._id || item.id}`} 
                className="dropdown-item" 
                onClick={() => {
                  // Store the property data in localStorage when Edit is clicked
                  console.log("Storing property data for edit:", item);
                  
                  // Fix for property address showing as [object Object]
                  let propertyAddress = "";
                  if (item.property_address) {
                    propertyAddress = typeof item.property_address === 'string' 
                      ? item.property_address 
                      : JSON.stringify(item.property_address);
                  } else if (item.address) {
                    propertyAddress = typeof item.address === 'string' 
                      ? item.address 
                      : (item.address.street ? `${item.address.street || ''}, ${item.address.city || ''}` : JSON.stringify(item.address));
                  }
                  
                  // Handle images properly
                  let mediaArray = [];
                  if (item.media && Array.isArray(item.media)) {
                    mediaArray = item.media.map(img => typeof img === 'string' ? img : (img.filePath || img.url || img.path || ''));
                  } else if (item.images && Array.isArray(item.images)) {
                    mediaArray = item.images.map(img => typeof img === 'string' ? img : (img.filePath || img.url || img.path || ''));
                  }
                  
                  // Handle amenities properly
                  let amenitiesArray = [];
                  if (item.amenities) {
                    if (Array.isArray(item.amenities)) {
                      amenitiesArray = item.amenities;
                    } else if (typeof item.amenities === 'object') {
                      // Convert object form of amenities to array
                      amenitiesArray = Object.keys(item.amenities).filter(key => item.amenities[key] === true);
                    }
                  }
                  
                  // Create a normalized property object with all necessary fields
                  const normalizedProperty = {
                    _id: item._id || item.id,  // Prioritize MongoDB _id field 
                    id: item._id || item.id,   // Make id match _id for consistent lookup
                    propertyId: item._id || item.id,
                    mongoId: item._id || item.id, // Extra field to ensure MongoDB ID is preserved
                    property_type: item.property_type || item.propertyType || "House",
                    property_for: item.property_for || (item.offeringType === "For Rent" ? "For Rent" : "For Sale"),
                    total_price: item.total_price || item.price || "",
                    property_address: propertyAddress,
                    number_of_bedrooms: item.number_of_bedrooms || item.bedrooms || "",
                    number_of_bathrooms: item.number_of_bathrooms || item.bathrooms || "",
                    property_size: item.property_size || item.size || "",
                    regional_state: item.regional_state || item.region || "Addis Ababa City Administration", // Set default if missing
                    city: item.city || (item.address && item.address.city) || "Addis Ababa", // Set default if missing
                    description: item.description || "",
                    country: item.country || "Ethiopia",
                    media: mediaArray,
                    amenities: amenitiesArray
                  };
                  
                  // Store in localStorage with both keys
                  localStorage.setItem('property_edit_data', JSON.stringify(normalizedProperty));
                  localStorage.setItem(`property_edit_data_${item.id}`, JSON.stringify(normalizedProperty));
                  
                  // Also store in sessionStorage as a backup
                  sessionStorage.setItem(`property_edit_data_${item.id}`, JSON.stringify(normalizedProperty));
                  
                  // Force property edit mode
                  localStorage.setItem('force_property_edit', 'true');
                }}
              >
                Edit
              </Link>
              <button className="dropdown-item text-danger">Delete</button>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="property-listings-tab">
      {/* Header with Listings count and tabs */}
      <div className="listings-header">
        <h2>My Listings <span className="listing-count">{propertyList.length || 0}</span></h2>
        
        <div className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <Link to="/property-list-form" className="list-property-btn">
          List Property +
        </Link>
      </div>
      
      {/* Property Listings Table */}
      <div className="property-listings-table">
        <table>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Picture</th>
              <th>Address</th>
              <th>Type</th>
              <th>Offering</th>
              <th>Status</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {propertyList.length > 0 ? (
              propertyList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="property-image">
                      <img 
                        src={(() => {
                          // Advanced image resolution with detailed logging
                          console.log(`Finding image for property ${item.id || item._id}`);
                          
                          // First try the PropertyAlert format
                          if (item?.image) {
                            console.log("Using PropertyAlert image format");
                            return item.image;
                          }
                          
                          // Next try media_paths (from property form)
                          if (item?.media_paths && item.media_paths.length > 0) {
                            console.log("Found media_paths");
                            const mainImage = item.media_paths[0];
                            
                            if (typeof mainImage === 'string') {
                              console.log("Using string URL from media_paths");
                              return mainImage.startsWith('/') ? mainImage : `/${mainImage}`;
                            } else if (mainImage.filePath) {
                              console.log("Using filePath from media_paths object");
                              const path = mainImage.filePath;
                              return path.startsWith('/') ? path : `/${path}`;
                            } else if (mainImage.url) {
                              console.log("Using url from media_paths object");
                              const path = mainImage.url;
                              return path.startsWith('/') ? path : `/${path}`;
                            } else if (mainImage.path) {
                              console.log("Using path from media_paths object");
                              const path = mainImage.path;
                              return path.startsWith('/') ? path : `/${path}`;
                            }
                          }
                          
                          // Try images array next (from API response)
                          if (item?.images && item.images.length > 0) {
                            console.log("Using images array");
                            
                            // First check if any image is marked as primary
                            const primaryImage = item.images.find(img => 
                              (typeof img === 'object' && img.isPrimary === true) || 
                              (typeof img === 'object' && img.primary === true)
                            );
                            
                            if (primaryImage) {
                              console.log("Found primary image");
                              if (typeof primaryImage === 'string') {
                                const path = primaryImage;
                                return path.startsWith('/') ? path : `/${path}`;
                              } else {
                                const path = primaryImage.url || primaryImage.filePath || primaryImage.path || primaryImage;
                                return typeof path === 'string' ? (path.startsWith('/') ? path : `/${path}`) : null;
                              }
                            }
                            
                            // Otherwise use first image
                            const firstImage = item.images[0];
                            console.log("Using first image from array", firstImage);
                            
                            if (typeof firstImage === 'string') {
                              const path = firstImage;
                              return path.startsWith('/') ? path : `/${path}`;
                            } else {
                              const path = firstImage.url || firstImage.filePath || firstImage.path;
                              return typeof path === 'string' ? (path.startsWith('/') ? path : `/${path}`) : null;
                            }
                          }
                          
                          // Use upload folder images for fallback
                          console.log("No property-specific images found, using default from uploads");
                          return "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg";
                        })()} 
                        alt={item.title || "Property"} 
                        onError={(e) => {
                          console.log("Image load error, trying fallbacks");
                          e.target.onerror = null;
                          
                          // Try several fallback images from uploads
                          e.target.src = "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg";
                          e.target.onerror = () => {
                            console.log("First fallback failed, trying second");
                            e.target.src = "/uploads/1749428932303-180111256-731631728_0.jpg";
                            e.target.onerror = () => {
                              console.log("All fallbacks failed, using placeholder");
                              e.target.src = "/assets/images/placeholder-property.jpg";
                            };
                          };
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="property-address">
                      {item.property_address || 
                       (item.address ? 
                         `${item.address.street || ''}, ${item.address.city || ''}` : 
                         "New Property Address"
                       )}
                    </div>
                  </td>
                  <td>
                    <div className="property-type">
                      {item.property_type || item.propertyType || "Commercial"}
                    </div>
                  </td>
                  <td>
                    <div className={`offering-badge ${getOfferingType(item).type}`}>
                      {getOfferingType(item).label}
                    </div>
                  </td>
                  <td>
                    <div className={`status-badge ${(item.status || "active").toLowerCase()}`}>
                      {(item.status || "ACTIVE").toUpperCase()}
                    </div>
                  </td>
                  <td>
                    <div className="property-price">
                      <span>{item.total_price || item.price || 0} ETB</span>
                    </div>
                  </td>
                  <td>
                    <ActionDropdown item={item} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-properties">
                  <div className="empty-state">
                    <p>No properties found</p>
                    <Link to="/property-list-form" className="add-property-link">
                      Add Your First Property
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* CSS Styles */}
      <style jsx>{`
        .property-listings-tab {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          padding: 20px;
        }
        
        .listings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .listings-header h2 {
          font-size: 22px;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
        }
        
        .listing-count {
          background-color: #4a6cf7;
          color: white;
          border-radius: 20px;
          padding: 2px 10px;
          font-size: 14px;
          margin-left: 10px;
        }
        
        .tab-navigation {
          display: flex;
          gap: 10px;
          margin: 10px 0;
        }
        
        .tab-button {
          background-color: transparent;
          border: none;
          padding: 8px 15px;
          cursor: pointer;
          border-radius: 4px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .tab-button.active {
          background-color: #4a6cf7;
          color: white;
        }
        
        .list-property-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
        }
        
        .property-listings-table {
          width: 100%;
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th {
          background-color: #f8f9fa;
          padding: 12px 15px;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 1px solid #dee2e6;
        }
        
        td {
          padding: 12px 15px;
          border-bottom: 1px solid #dee2e6;
          vertical-align: middle;
        }
        
        .property-image img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .offering-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }
        
        .offering-badge.sale {
          background-color: #e8f5e8;
          color: #28a745;
          border: 1px solid #28a745;
        }
        
        .offering-badge.rent {
          background-color: #e8f4ff;
          color: #007bff;
          border: 1px solid #007bff;
        }
        
        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }
        
        .status-badge.active {
          background-color: #e8f5e8;
          color: #28a745;
        }
        
        .status-badge.pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status-badge.sold {
          background-color: #d1ecf1;
          color: #0c5460;
        }
        
        .status-badge.rejected {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .property-price {
          font-weight: 600;
          color: #212529;
        }
        
        .action-dropdown {
          position: relative;
        }
        
        .action-btn {
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-width: 120px;
          z-index: 100;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .dropdown-item {
          display: block;
          padding: 8px 12px;
          text-decoration: none;
          color: #212529;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
        
        .text-danger {
          color: #dc3545;
        }
        
        .no-properties {
          text-align: center;
          padding: 40px !important;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        
        .add-property-link {
          background-color: #4a6cf7;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .listings-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .tab-navigation {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 5px;
          }
          
          .property-listings-table {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyListingsTab;
