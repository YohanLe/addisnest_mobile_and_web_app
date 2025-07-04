import React, { useState, useEffect } from 'react';
import Api from '../../Apis/Api';
import { Link } from 'react-router-dom';
import '../../assets/css/manage-listings.css';

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [availableLocations, setAvailableLocations] = useState([
    { value: 'Addis Ababa City Administration', label: 'Addis Ababa City Administration' },
    { value: 'Afar Region', label: 'Afar Region' },
    { value: 'Amhara Region', label: 'Amhara Region' },
    { value: 'Benishangul-Gumuz Region', label: 'Benishangul-Gumuz Region' },
    { value: 'Dire Dawa City Administration', label: 'Dire Dawa City Administration' },
    { value: 'Gambela Region', label: 'Gambela Region' },
    { value: 'Harari Region', label: 'Harari Region' },
    { value: 'Oromia Region', label: 'Oromia Region' },
    { value: 'Sidama Region', label: 'Sidama Region' },
    { value: 'Somali Region', label: 'Somali Region' },
    { value: 'South Ethiopia Region', label: 'South Ethiopia Region' },
    { value: 'South West Ethiopia Peoples\' Region', label: 'South West Ethiopia Peoples\' Region' },
    { value: 'Tigray Region', label: 'Tigray Region' },
    { value: 'Central Ethiopia Region', label: 'Central Ethiopia Region' }
  ]);

  useEffect(() => {
    fetchListings();
  }, [currentPage, filter, locationFilter]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      // Use getWithtoken for authenticated access to get all properties
      const response = await Api.getWithtoken('properties');
      console.log('Properties API Response:', response);
      
      // Handle MongoDB response format
      let allProperties = [];
      
      // Check if the response is an array or an object with a data property
      if (Array.isArray(response)) {
        allProperties = response;
      } else if (response && response.data) {
        // If it's an object with a data property, use that
        allProperties = Array.isArray(response.data) ? response.data : [];
      } else if (response && typeof response === 'object') {
        // If it's just an object, use it directly
        allProperties = [response];
      }
      
      console.log('All properties:', allProperties);
      
      // We're now using a fixed list of Ethiopian regions instead of extracting from properties
      
      // Apply status filter
      let filteredProperties = allProperties;
      if (filter !== 'all') {
        filteredProperties = allProperties.filter(property => 
          property.status && property.status.toLowerCase() === filter.toLowerCase()
        );
      }
      
      // Apply location filter if selected
      if (locationFilter !== 'all') {
        filteredProperties = filteredProperties.filter(property => 
          property.address?.state === locationFilter
        );
      }
      
      // Apply search filter if present
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredProperties = filteredProperties.filter(property => 
          (property.title && property.title.toLowerCase().includes(searchLower)) ||
          (property.address?.city && property.address.city.toLowerCase().includes(searchLower)) ||
          (property.address?.state && property.address.state.toLowerCase().includes(searchLower)) ||
          (property.ownerName && property.ownerName.toLowerCase().includes(searchLower)) ||
          (property.owner?.firstName && property.owner.firstName.toLowerCase().includes(searchLower)) ||
          (property.owner?.lastName && property.owner.lastName.toLowerCase().includes(searchLower))
        );
      }
      
      // Sort by creation date (newest first)
      filteredProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Simple pagination
      const itemsPerPage = 10;
      const totalItems = filteredProperties.length;
      const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
      
      setTotalPages(calculatedTotalPages || 1);
      
      // Get current page items
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
      
      setListings(paginatedProperties);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
      
      // Set empty array instead of mock data to show real state
      setListings([]);
      setTotalPages(1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchListings();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when changing location filter
  };

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await Api.putWithtoken(`properties/${listingId}`, { status: newStatus });
      
      // Update the listing in the state
      setListings(prevListings => 
        prevListings.map(listing => 
          listing._id === listingId ? { ...listing, status: newStatus } : listing
        )
      );
      
    } catch (error) {
      console.error('Error updating listing status:', error);
      alert('Failed to update listing status. Please try again.');
    }
  };

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        await Api.deleteWithtoken(`properties/${listingId}`);
        
        // Remove the listing from the state
        setListings(prevListings => 
          prevListings.filter(listing => listing._id !== listingId)
        );
        
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price) => {
    // Format as number with thousands separators without currency symbol
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'published';
      case 'pending':
      case 'pending_payment':
        return 'pending';
      case 'Sold':
        return 'sold';
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Published';
      case 'pending':
        return 'Pending';
      case 'pending_payment':
        return 'Pending Payment';
      case 'Sold':
        return 'Sold';
      case 'Rented':
        return 'Rented';
      default:
        return status;
    }
  };

  return (
    <div className="manage-listings-container">
      <div className="manage-listings-header">
        <h1>Manage Listings</h1>
        <p>View, edit, and manage all property listings.</p>
      </div>
      
      <div className="manage-listings-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            placeholder="Search listings..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        
        <div className="filter-selects">
          <select value={filter} onChange={handleFilterChange} className="filter-select">
            <option value="all">All Listings</option>
            <option value="active">Published</option>
            <option value="pending">Pending</option>
            <option value="pending_payment">Pending Payment</option>
          </select>
          
          <select value={locationFilter} onChange={handleLocationFilterChange} className="filter-select">
            <option value="all">All Locations</option>
            {availableLocations.map(location => (
              <option key={location.value} value={location.value}>{location.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading listings...</p>
        </div>
      ) : (
        <>
          <div className="listings-table">
            <div className="table-header">
              <div className="header-cell property">Property</div>
              <div className="header-cell offering">Offering</div>
              <div className="header-cell location">Location</div>
              <div className="header-cell price">Price/ETB</div>
              <div className="header-cell owner">Owner</div>
              <div className="header-cell status">Status</div>
              <div className="header-cell date">Date Added</div>
              <div className="header-cell actions">Actions</div>
            </div>
            
            <div className="table-body">
              {listings.length > 0 ? (
                listings.map(listing => (
                  <div className="table-row" key={listing._id}>
                    <div className="cell property">{listing.title || "Test Property"}</div>
                    <div className="cell offering">{listing.offeringType || "For Sale"}</div>
                    <div className="cell location">{listing.address?.city}, {listing.address?.state}</div>
                    <div className="cell price">{formatPrice(listing.price)}</div>
                    <div className="cell owner">{listing.ownerName || `${listing.owner?.firstName || ''} ${listing.owner?.lastName || ''}`}</div>
                    <div className="cell status">
                      <select 
                        className={`status-select ${getStatusClass(listing.status)}`}
                        value={listing.status || 'pending'}
                        onChange={(e) => handleStatusChange(listing._id, e.target.value)}
                        title="Change status"
                      >
                        <option value="pending">Pending</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </div>
                    <div className="cell date">{formatDate(listing.createdAt)}</div>
                    <div className="cell actions">
                      <Link 
                        to={`/property-edit/${listing._id}`}
                        className="action-icon edit"
                        title="Edit"
                      >
                        <i className="fa-solid fa-edit"></i>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No listings found</p>
                  <Link to="/property-list-form" className="add-listing-link">
                    + Add Listing
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageListings;
