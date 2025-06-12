import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetPropertyList } from "../../../../Redux-store/Slices/PropertyListSlice";

const PropertyListingsTab = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "ACTIVE", "SOLD", "PENDING", "REJECTED"];
  
  // Get property list data from Redux store
  const propertyData = useSelector((state) => state.PropertyList.Data);
  const propertyListData = propertyData?.data?.data || propertyData?.data;
  
  // Sort properties by creation date - newest first
  const propertyList = propertyListData ? [...propertyListData].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || a.uploadDate || 0);
    const dateB = new Date(b.createdAt || b.created_at || b.uploadDate || 0);
    return dateB - dateA; // Descending order (newest first)
  }) : [];

  // Get offering type
  const getOfferingType = (item) => {
    if (item?.property_for === "For Sale") {
      return { type: 'sale', label: 'FOR SALE' };
    }
    if (item?.property_for === "For Rent") {
      return { type: 'rent', label: 'FOR RENT' };
    }
    
    // Check for listing_type as alternative
    if (item?.listing_type === "sell" || item?.listing_type === "sale") {
      return { type: 'sale', label: 'FOR SALE' };
    }
    if (item?.listing_type === "rent") {
      return { type: 'rent', label: 'FOR RENT' };
    }
    
    return { type: 'unknown', label: 'N/A' };
  };
  
  // Fetch property listings when tab changes
  useEffect(() => {
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
            <Link to={`/property-edit/${item.id}`} className="dropdown-item">Edit</Link>
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
                        src={
                          // Enhanced image handling with better fallbacks
                          (item?.media_paths?.[0]?.url) || // Object format with url property
                          (typeof item?.media_paths?.[0] === 'string' ? item?.media_paths?.[0] : null) || // String format
                          (item?.images?.[0]?.url) || // Alternative object format
                          (item?.media?.[0]?.filePath) || // Another alternative format
                          "/uploads/test-property-image-1749260861596-438465535.jpg" || // Use default image from uploads
                          "/assets/images/placeholder-property.jpg" // Final fallback
                        } 
                        alt={item.title || "Property"} 
                        onError={(e) => {
                          e.target.onerror = null;
                          // Try our default image first, then fall back to placeholder
                          e.target.src = "/uploads/test-property-image-1749260861596-438465535.jpg";
                          e.target.onerror = () => {
                            e.target.src = "/assets/images/placeholder-property.jpg";
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
                      <span>{item.total_price || 0} ETB</span>
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
