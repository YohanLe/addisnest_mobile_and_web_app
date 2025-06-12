import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GetAllPropertyListings } from '../../../Redux-store/Slices/HomeSlice';
import { Property1, Property2, Property3 } from '../../../assets/images';
import { BsHeart, BsShare } from 'react-icons/bs';
import { GoLocation } from 'react-icons/go';

const FeaturedProperties = () => {
  const dispatch = useDispatch();
  const { data, pending } = useSelector((state) => state.Home?.PropertyListings || { data: null, pending: false });
  const [propertyType, setPropertyType] = useState('buy');
  
  useEffect(() => {
    // Fetch property listings
    dispatch(GetAllPropertyListings({ type: propertyType, page: 1, limit: 12 }));
  }, [dispatch, propertyType]);

  // Generate random status labels for properties
  const getRandomStatus = () => {
    const statuses = [
      
      { text: "NEW 1 HR AGO", color: "#00AE43" },
      { text: "NEW 19 HRS AGO", color: "#00AE43" },
      { text: "OPEN SAT, 1PM TO 3PM", color: "#58A33D" },
      { text: "PRICE REDUCED", color: "#CE5E2A" },
      {text: "For Sale"},
      {text:"For Rent"}
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Fallback properties if API fails
  const fallbackProperties = [
    {
      _id: '1',
      title: 'Modern Apartment in City Center',
      price: 2548000,
      propertyType: 'house',
      address: '3135 SE Van Waters St, Milwaukie, OR 97222',
      bedrooms: 7,
      bathrooms: 4,
      area: 9175,
      imageUrl: Property1,
      agent: 'Redfin',
      status: getRandomStatus(),
    },
    {
      _id: '2',
      title: 'Luxury Villa with Garden',
      price: 469000,
      propertyType: 'house',
      address: '8626 SE 28th Pl, Milwaukie, OR 97222',
      bedrooms: 2,
      bathrooms: 2,
      area: 930,
      imageUrl: Property2,
      agent: 'Tedi McKnight-Heikes • Engel & Volkers West Portland',
      status: getRandomStatus(),
      year: 2023
    },
    {
      _id: '3',
      title: 'Cozy Studio for Professionals',
      price: 595000,
      propertyType: 'house',
      address: '10410 SE 55th Ave, Milwaukie, OR 97222',
      bedrooms: 3,
      bathrooms: 2,
      area: 2128,
      imageUrl: Property3,
      agent: 'Kristen Downer • The Agency Portland',
      status: getRandomStatus(),
      year: 2023
    },
    {
      _id: '4',
      title: 'Modern Family Home',
      price: 575000,
      propertyType: 'house',
      address: '20020 SW Walquin Ct, Beaverton, OR 97078',
      bedrooms: 4,
      bathrooms: 2.5,
      area: 2018,
      imageUrl: Property1,
      agent: 'Redfin',
      status: getRandomStatus(),
      year: 2023
    },
    {
      _id: '5',
      title: 'Contemporary Townhouse',
      price: 349900,
      propertyType: 'house',
      address: '1140 SW 170th Ave #203, Beaverton, OR 97003',
      bedrooms: 2,
      bathrooms: 2.5,
      area: 1184,
      imageUrl: Property2,
      agent: 'Keller Williams Realty Portland Premiere',
      status: getRandomStatus(),
      year: 2023
    },
    {
      _id: '6',
      title: 'Elegant Suburban Home',
      price: 550000,
      propertyType: 'house',
      address: '18646 SW Hideo Ct, Beaverton, OR 97003',
      bedrooms: 3,
      bathrooms: 2.5,
      area: 2225,
      imageUrl: Property3,
      agent: 'Keller Williams Sunset Corridor',
      status: getRandomStatus(),
      year: 2023
    }
  ];

  // Generate 12 properties for demonstration
  const getTwelveProperties = () => {
    // Start with our 6 base properties
    const baseProperties = [...fallbackProperties];
    const twelveProperties = [];
    
    // Generate 12 properties by modifying the base properties
    for (let i = 0; twelveProperties.length < 12; i++) {
      const baseProp = baseProperties[i % baseProperties.length];
      const priceMod = Math.floor(Math.random() * 50000);
      const areaMod = Math.floor(Math.random() * 200);
      
      twelveProperties.push({
        _id: `property-{i}`,
        ...baseProp,
        price: baseProp.price + priceMod,
        area: baseProp.area + areaMod,
        status: getRandomStatus(),
        imageUrl: [Property1, Property2, Property3][i % 3]
      });
    }
    
    return twelveProperties;
  };

  // Check localStorage for newly created properties
  const getLocalStorageProperties = () => {
    try {
      const savedListings = localStorage.getItem('propertyListings');
      if (savedListings) {
        console.log("Found saved listings in localStorage for featured properties");
        const parsedListings = JSON.parse(savedListings);
        
        // Convert saved listings to the format expected by this component
        return parsedListings.map((listing, index) => ({
          _id: listing.id || `local-{index}`,
          title: listing.address || "Property",
          price: Number(listing.price) || 0,
          propertyType: listing.type?.toLowerCase() || "house",
          address: listing.address || "No address provided",
          bedrooms: 3, // Default values if not available
          bathrooms: 2,
          area: 1500,
          imageUrl: listing.image || null,
          agent: "Local Agent",
          status: { 
            text: "NEWLY LISTED", 
            color: "#00AE43" 
          },
          year: new Date().getFullYear()
        }));
      }
    } catch (error) {
      console.error("Error loading saved listings for featured properties:", error);
    }
    return null;
  };

  // Use data in this order: 1) localStorage properties, 2) API data, 3) fallback properties
  const localProperties = getLocalStorageProperties();
  const apiProperties = data?.data?.length > 0 ? data.data.slice(0, 12) : null;
  const fallbackProps = getTwelveProperties();
  
  // Combine local properties with API or fallback properties, showing local ones first
  const properties = localProperties 
    ? [...localProperties.slice(0, 6), ...(apiProperties || fallbackProps).slice(0, 6)] 
    : (apiProperties || fallbackProps);

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="featured-properties-section" style={{ padding: '30px 0', background: '#fff' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-heading" style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Featured Properties</h2>
          <p style={{ color: '#666' }}>Discover your dream home among our featured listings</p>
        </div>

        <div className="property-grid" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {properties.map((property) => (
            <div key={property._id} className="property-card" style={{ 
              width: '100%',
              maxWidth: '400px',
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
              position: 'relative',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              marginBottom: '8px',
              background: '#fff',
            }}>
              <Link to={`/property/{property._id || '648a97f4d254d67c1e5f461b'}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="property-image" style={{ height: '215px', position: 'relative' }}>
                <img 
                  src={property.imageUrl || Property1} 
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Status banner (like "LISTED BY REDFIN 29 MINS AGO") */}
                <div style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '0px', 
                  background: property.status?.color || '#E93131', 
                  color: 'white',
                  padding: '4px 12px', 
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  zIndex: 2
                }}>
                  {property.status?.text || "LISTED BY REDFIN"}
                </div>
                
                {/* Year indicator */}
                <div style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  right: '12px', 
                  background: 'rgba(0,0,0,0.5)', 
                  color: 'white',
                  padding: '2px 8px', 
                  fontSize: '10px', 
                  borderRadius: '4px',
                  zIndex: 2
                }}>
                  {property.year || 2023}
                </div>

                {/* Location icon */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '12px', 
                  right: '12px', 
                  background: 'rgba(0,0,0,0.6)', 
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}>
                  <GoLocation style={{ fontSize: '18px' }} />
                </div>
              </div>
              
              </Link>
              <div className="property-details" style={{ padding: '16px' }}>
                {/* Price and action buttons */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    color: '#2b2b2b'
                  }}>
                    {formatPrice(property.price)}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ 
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '20px',
                      color: '#555'
                    }}>
                      <BsShare />
                    </button>
                    <button style={{ 
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '20px',
                      color: '#555'
                    }}>
                      <BsHeart />
                    </button>
                  </div>
                </div>
                
                {/* Property details */}
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '0.95rem', 
                    color: '#333',
                    fontWeight: '500',
                    lineHeight: '1.4'
                  }}>
                    {property.address}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    fontSize: '0.9rem', 
                    color: '#444', 
                    fontWeight: '500'
                  }}>
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.area} sq ft</span>
                  </div>
                </div>
                
                {/* Agent info */}
                <p style={{ 
                  margin: '12px 0 0 0', 
                  fontSize: '0.8rem', 
                  color: '#666',
                  borderTop: '1px solid #eee',
                  paddingTop: '12px'
                }}>
                  {property.agent}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link 
            to="/property-list" 
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: '#0066cc',
              color: 'white',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'background 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
