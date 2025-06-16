import React from 'react';
import { Link } from 'react-router-dom';
import { 
  /* SvgFacebookIcon, */
  /* SvgTwitterIcon, */
  /* SvgInstagramIcon, */
  /* SvgLinkedInIcon */
} from '../../../assets/svg-files/SvgFiles';
import { Logo } from '../../../assets/images';

const Footer = () => {
  return (
    <>
      {/* Main Footer - Enhanced with modern design */}
      <footer className="footer" style={{ 
        backgroundColor: '#2e3d40', 
        color: 'white', 
        padding: '20px 0 10px',
        borderTop: '2px solid #b9f73e'
      }}>
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                marginBottom: '8px', 
                color: 'white',
                position: 'relative',
                paddingBottom: '5px'
              }}>
                Addisnest
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '60px',
                  height: '3px',
                  background: '#b9f73e',
                  borderRadius: '2px'
                }}></span>
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: '#e0e0e0', 
                lineHeight: '1.8', 
                marginBottom: '30px',
                maxWidth: '90%'
              }}>
                Connecting you to the best properties across Ethiopia. Buy, sell, or rent with confidence and convenience.
              </p>
              <div className="download-app" style={{ 
                marginTop: '20px', 
                background: 'rgba(0,0,0,0.2)', 
                padding: '15px', 
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <h5 style={{ 
                  fontSize: '16px', 
                  marginBottom: '10px',
                  fontWeight: '600',
                  color: '#b9f73e'
                }}>
                  Download the App
                </h5>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#e0e0e0',
                  lineHeight: '1.5',
                  marginBottom: '12px'
                }}>
                  Experience Addisnest on the go. Search properties, connect with agents, and manage your listings right from your mobile.
                </p>
                <div className="app-buttons" style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  flexWrap: 'nowrap',
                  justifyContent: 'flex-start'
                }}>
                  <button style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#b9f73e', 
                    border: 'none', 
                    borderRadius: '20px',
                    color: '#2e3d40',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(185, 247, 62, 0.2)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#a8e62d';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#b9f73e';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"/>
                    </svg>
                    <span>App Store</span>
                  </button>
                  <button style={{ 
                    padding: '8px 16px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    borderRadius: '20px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96 2.694-1.586Zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055l7.294-4.295ZM1 13.396V2.603L6.846 8 1 13.396ZM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27Z"/>
                    </svg>
                    <span>Google Play</span>
                  </button>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Footer Links - Horizontal Layout */}
          <div className="row mb-4">
            <div className="col-12">
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '30px',
                justifyContent: 'space-between'
              }}>
                {/* Addisnest Links */}
                <div>
                  <h5 style={{ 
                    fontSize: '16px', 
                    marginBottom: '15px', 
                    color: '#b9f73e',
                    fontWeight: '600'
                  }}>
                    Addisnest
                  </h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>
                      <Link 
                        to="/property-list" 
                        style={{ 
                          color: '#e0e0e0', 
                          textDecoration: 'none', 
                          transition: 'all 0.3s ease',
                          fontSize: '14px'
                        }}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          if (window.location.pathname === '/property-list') {
                            window.location.reload();
                          }
                        }}
                        onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                        onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Buy a house
                      </Link>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/sell" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Sell a house
                      </Link>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/rent" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Rent a house
                      </Link>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/mortgage-calculator" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Mortgage
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Quick Links */}
                <div>
                  <h5 style={{ 
                    fontSize: '16px', 
                    marginBottom: '15px', 
                    color: '#b9f73e',
                    fontWeight: '600'
                  }}>
                    Quick Links
                  </h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/about-us" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        About Us
                      </Link>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/contact-us" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Contact
                      </Link>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/privacy-policy" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/terms-of-service" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* For Partners */}
                <div>
                  <h5 style={{ 
                    fontSize: '16px', 
                    marginBottom: '15px', 
                    color: '#b9f73e',
                    fontWeight: '600'
                  }}>
                    For Partners
                  </h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/find-agent" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Partner With Us
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Connect With Us */}
                <div>
                  <h5 style={{ 
                    fontSize: '16px', 
                    marginBottom: '15px', 
                    color: '#b9f73e',
                    fontWeight: '600'
                  }}>
                    Connect With Us
                  </h5>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="#" style={{ 
                    width: '42px', 
                    height: '42px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#b9f73e';
                    e.target.style.color = '#2e3d40';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" style={{ 
                    width: '42px', 
                    height: '42px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#b9f73e';
                    e.target.style.color = '#2e3d40';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" style={{ 
                    width: '42px', 
                    height: '42px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#b9f73e';
                    e.target.style.color = '#2e3d40';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" style={{ 
                    width: '42px', 
                    height: '42px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#b9f73e';
                    e.target.style.color = '#2e3d40';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  >
                    <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom" style={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            paddingTop: '20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap',
            marginTop: '10px'
          }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#e0e0e0',
              letterSpacing: '0.5px'
            }}>&copy; {new Date().getFullYear()} Addisnest. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
