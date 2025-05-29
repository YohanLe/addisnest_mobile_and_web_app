import { Link } from "react-router-dom";
import { Property3 } from "../../../assets/images";
import ActiveDropdown from "../../../helper/ActiveDropdown";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetPropertyList } from "../../../Redux-store/Slices/PropertyListSlice";
import DeletePopup from "../../../helper/DeletePopup";

const MyListProperty = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("All");
    const tabs = ["All", "Active", "Sold", "Pending", "Rejected"];
    const [ItemData, setItemData] = useState('');
    const [showDeletePopup, setDeletePopup] = useState(false);
    const [debugInfo, setDebugInfo] = useState({ show: false, data: null });
    
    const PropertData = useSelector((state) => state.PropertyList.Data);
    const PropertyListData = PropertData?.data?.data;
    
    // Enhanced logging for debugging
    console.log('🔍 MyListProperty Debug:', {
        PropertData,
        PropertyListData,
        activeTab,
        pending: PropertData?.pending,
        error: PropertData?.error
    });

    // Function to intelligently determine offering type
    const getOfferingType = (item) => {
        console.log('🔍 Determining offering type for item:', item);
        
        // First check if we have explicit data - this should be the primary source
        if (item?.property_for === 'sell' || item?.listing_type === 'sell' || item?.offer_type === 'sell') {
            console.log('✅ Found explicit SELL data');
            return { type: 'sale', label: 'For Sale' };
        }
        if (item?.property_for === 'rent' || item?.listing_type === 'rent' || item?.offer_type === 'rent') {
            console.log('✅ Found explicit RENT data');
            return { type: 'rent', label: 'For Rent' };
        }

        // Smart detection based on data patterns
        const price = parseFloat(item?.price || item?.total_price) || 0;
        const description = (item?.description || '').toLowerCase();
        const address = (item?.address || item?.property_address || '').toLowerCase();
        
        console.log('📊 Analysis data:', { price, description, address });
        
        // Check for rental keywords in description or address
        const rentalKeywords = ['rent', 'rental', 'monthly', 'lease', 'tenant', 'per month', '/month'];
        const saleKeywords = ['sale', 'buy', 'purchase', 'investment', 'owner'];
        
        const hasRentalKeywords = rentalKeywords.some(keyword => 
            description.includes(keyword) || address.includes(keyword)
        );
        const hasSaleKeywords = saleKeywords.some(keyword => 
            description.includes(keyword) || address.includes(keyword)
        );

        console.log('🔍 Keywords found:', { hasRentalKeywords, hasSaleKeywords });

        // If we find explicit keywords, use them
        if (hasRentalKeywords && !hasSaleKeywords) {
            console.log('✅ RENT detected from keywords');
            return { type: 'rent', label: 'For Rent' };
        }
        if (hasSaleKeywords && !hasRentalKeywords) {
            console.log('✅ SALE detected from keywords');
            return { type: 'sale', label: 'For Sale' };
        }

        // For properties without clear indicators, use price-based logic
        // Properties over 50,000 ETB are more likely to be for sale
        // Properties under 50,000 ETB are more likely to be for rent
        if (price > 50000) {
            console.log('✅ SALE detected from high price:', price);
            return { type: 'sale', label: 'For Sale' };
        } else {
            console.log('✅ RENT detected from low price:', price);
            return { type: 'rent', label: 'For Rent' };
        }
    };
    
    // Sort properties by creation date - newest first
    const PropertyList = PropertyListData ? [...PropertyListData].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || a.uploadDate || 0);
        const dateB = new Date(b.createdAt || b.created_at || b.uploadDate || 0);
        return dateB - dateA; // Descending order (newest first)
    }) : [];

    // Enhanced useEffect with error handling
    useEffect(() => {
        console.log('🔄 Fetching properties for tab:', activeTab);
        
        if (activeTab === 'All') {
            dispatch(GetPropertyList({ type: '' }));
        } else {
            dispatch(GetPropertyList({ type: activeTab }));
        }
    }, [activeTab, dispatch]);

    // Check for authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        console.log('🔑 Auth token exists:', !!token);
        
        if (!token) {
            console.warn('⚠️ No authentication token found!');
        }
    }, []);

    const handleDeletePopup = (item) => {
        setItemData(item);
        setDeletePopup((p) => !p);
    };

    const toggleDebugInfo = () => {
        setDebugInfo(prev => ({
            show: !prev.show,
            data: PropertData
        }));
    };

    // Render error state
    const renderErrorState = () => {
        if (PropertData?.error) {
            const error = PropertData.error;
            
            if (error.type === 'auth') {
                return (
                    <tr>
                        <td colSpan="8" className="text-center" style={{ padding: '40px', color: '#e74c3c' }}>
                            <div>
                                <h5>🔒 Authentication Required</h5>
                                <p>{error.message}</p>
                                <Link to="/login" className="btn btn-primary" style={{ marginTop: '10px' }}>
                                    Login Now
                                </Link>
                            </div>
                        </td>
                    </tr>
                );
            }
            
            return (
                <tr>
                    <td colSpan="8" className="text-center" style={{ padding: '40px', color: '#e67e22' }}>
                        <div>
                            <h5>⚠️ Error Loading Properties</h5>
                            <p>{error.message}</p>
                            <button 
                                className="btn btn-secondary" 
                                onClick={() => dispatch(GetPropertyList({ type: activeTab === 'All' ? '' : activeTab }))}
                                style={{ marginTop: '10px' }}
                            >
                                Try Again
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }
        
        return null;
    };

    // Render loading state
    const renderLoadingState = () => {
        if (PropertData?.pending) {
            return (
                <tr>
                    <td colSpan="8" className="text-center" style={{ padding: '40px' }}>
                        <div>
                            <div className="spinner" style={{ marginBottom: '15px' }}>🔄</div>
                            <h5>Loading Your Properties...</h5>
                            <p>Please wait while we fetch your property listings.</p>
                        </div>
                    </td>
                </tr>
            );
        }
        
        return null;
    };

    // Render empty state
    const renderEmptyState = () => {
        if (!PropertData?.pending && !PropertData?.error && PropertyList?.length === 0) {
            return (
                <tr>
                    <td colSpan="8" className="text-center" style={{ padding: '40px' }}>
                        <div>
                            <h5>📋 No Properties Found</h5>
                            <p>
                                {activeTab === 'All' 
                                    ? "You haven't listed any properties yet." 
                                    : `No properties found with status: ${activeTab}`
                                }
                            </p>
                            <Link to="/property-form" className="btn btn-primary" style={{ marginTop: '10px' }}>
                                List Your First Property
                            </Link>
                            <button 
                                className="btn btn-secondary" 
                                onClick={toggleDebugInfo}
                                style={{ marginTop: '10px', marginLeft: '10px' }}
                            >
                                Show Debug Info
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }
        
        return null;
    };

    return (
        <>
            <div className="container">
                <div className="bradcrumb-top">
                    <div className="bradcrumb-title">
                        <h3>My Listings</h3>
                        <span>{PropertyList?.length || 0}</span>
                        {/* Debug indicator */}
                        {!localStorage.getItem('access_token') && (
                            <small style={{ color: 'red', marginLeft: '10px' }}>
                                ⚠️ Not Authenticated
                            </small>
                        )}
                    </div>
                    <div className="property-list-tabbing">
                        <ul>
                            {tabs.map((tab) => (
                                <li key={tab} onClick={() => setActiveTab(tab)}>
                                    <div
                                        className={`propertylist-tabtitle ${activeTab === tab ? "active" : ""}`}
                                    >
                                        <p>{tab}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bradcrumb-btn">
                        <Link to="/property-form" className="btn btn-primary">
                            List Property <span>+</span>
                        </Link>
                    </div>
                </div>

                {/* Debug Info Panel */}
                {debugInfo.show && (
                    <div style={{ 
                        background: '#f8f9fa', 
                        border: '1px solid #dee2e6', 
                        borderRadius: '5px', 
                        padding: '15px', 
                        marginBottom: '20px',
                        fontSize: '12px'
                    }}>
                        <h6>🔍 Debug Information</h6>
                        <pre style={{ background: '#fff', padding: '10px', borderRadius: '3px', overflow: 'auto', maxHeight: '200px' }}>
                            {JSON.stringify({
                                hasToken: !!localStorage.getItem('access_token'),
                                activeTab,
                                PropertData,
                                PropertyListData,
                                PropertyListLength: PropertyList?.length
                            }, null, 2)}
                        </pre>
                        <button 
                            className="btn btn-sm btn-secondary" 
                            onClick={() => setDebugInfo(prev => ({ ...prev, show: false }))}
                        >
                            Hide Debug
                        </button>
                    </div>
                )}

                <div className="proprety-list-tabel">
                    <div className="responsive-table">
                        <table className="table table-row-dashed">
                            <thead>
                                <tr>
                                    <th className="w-10px text-start">S.no</th>
                                    <th className="w-100px text-start">Picture</th>
                                    <th className="w-200px text-start">Address</th>
                                    <th className="w-120px text-center">Type</th>
                                    <th className="w-120px text-center">Offering</th>
                                    <th className="w-100px text-center">Status</th>
                                    <th className="w-200px text-center">Price</th>
                                    <th className="w-70px text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Show error state */}
                                {renderErrorState()}
                                
                                {/* Show loading state */}
                                {renderLoadingState()}
                                
                                {/* Show properties if available */}
                                {PropertyList?.length > 0 && PropertyList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="text-start">
                                            <div className="usrdtls-td">
                                                <div className="proptery-bg">
                                                    <span
                                                        style={{
                                                            backgroundImage: `url(${item?.media?.[0]?.filePath || '/placeholder-image.jpg'})`,
                                                            width: '60px',
                                                            height: '60px',
                                                            display: 'block',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            borderRadius: '4px'
                                                        }}
                                                    ></span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-start">
                                            <span className="font-text">{item?.address || item?.property_address || 'Address not specified'}</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="font-text">{item?.property_type || 'Type not specified'}</span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge offering-badge ${getOfferingType(item).type === 'sale' ? 'for-sale' : 'for-rent'}`}>
                                                {getOfferingType(item).label}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${item?.status || 'active'}`}>
                                                {item?.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="price-tbl">
                                                <span>Overall Price</span>
                                                <h5>ETB {(item?.price || item?.total_price || 0).toLocaleString()}</h5>
                                                <p>ETB {((item?.price || item?.total_price || 0) / (item?.property_size || 1)).toFixed(0)} per sqm</p>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div className="action-main">
                                                <div className="action-inner">
                                                    <span className="action-dropdownmain">
                                                        <ActiveDropdown item={item} />
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {/* Show empty state */}
                                {renderEmptyState()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyListProperty;
