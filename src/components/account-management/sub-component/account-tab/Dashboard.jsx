import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

// Mock data for the chart
const mockMonthlyData = {
  Jan: 0.0,
  Feb: 0.0,
  Mar: 0.0,
  Apr: 0.0,
  May: 2.0,
  Jun: 0.0,
  Jul: 0.0,
  Aug: 0.0,
  Sep: 0.0,
  Oct: 0.0,
  Nov: 0.0
};

// Mock data for metrics
const mockMetrics = {
  impressions: { count: 2, percentage: 100 },
  visitors: { count: 5, percentage: 40 },
  phoneViews: { count: 3, percentage: 25 }
};

// Recent activity mock data
const recentActivities = [
  { 
    type: 'property_view', 
    message: 'Your property "Modern Apartment in Bole" was viewed 3 times', 
    time: '2 hours ago',
    icon: '👁️'
  },
  { 
    type: 'inquiry', 
    message: 'New inquiry received for "Villa with Garden"', 
    time: '1 day ago',
    icon: '✉️'
  },
  { 
    type: 'alert', 
    message: 'Price change alert for similar property in your area', 
    time: '3 days ago',
    icon: '🔔'
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Impression');
  const [chartData, setChartData] = useState([]);
  const months = Object.keys(mockMonthlyData);
  const values = Object.values(mockMonthlyData);
  const maxValue = Math.max(...values, 1); // Ensure we have a non-zero max value

  // Animation effect for chart
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData(values);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Get the current metric data based on active tab
  const getCurrentMetric = () => {
    switch(activeTab) {
      case 'Visitors':
        return mockMetrics.visitors;
      case 'Phone View':
        return mockMetrics.phoneViews;
      default:
        return mockMetrics.impressions;
    }
  };

  const currentMetric = getCurrentMetric();

  const [chartCollapsed, setChartCollapsed] = useState(false);
  const [activityCollapsed, setActivityCollapsed] = useState(false);
  
  return (
    <div className="dashboard-container">
      {/* Welcome Section - Desktop Only */}
      <div className="welcome-section desktop-only">
        <div className="welcome-content">
          <h2>Welcome back, Agent!</h2>
          <p>Here's an overview of your property performance and recent activities.</p>
        </div>
        <div className="date-display">
          <div className="date-icon">📅</div>
          <div className="date-text">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>
      
      {/* Summary Cards for Mobile */}
      <div className="mobile-summary-cards">
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <h4>Impressions</h4>
            <div className="summary-value">
              <span className="number">{mockMetrics.impressions.count}</span>
              <span className="percentage success">{mockMetrics.impressions.percentage}%</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">👁️</div>
          <div className="summary-content">
            <h4>Visitors</h4>
            <div className="summary-value">
              <span className="number">{mockMetrics.visitors.count}</span>
              <span className="percentage success">{mockMetrics.visitors.percentage}%</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">📱</div>
          <div className="summary-content">
            <h4>Phone Views</h4>
            <div className="summary-value">
              <span className="number">{mockMetrics.phoneViews.count}</span>
              <span className="percentage success">{mockMetrics.phoneViews.percentage}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Management Quick Links - Desktop Only */}
      <div className="quick-links-section desktop-only">
        <h3>Property Management</h3>
        <div className="quick-links-container">
          <Link to="/property-list-form" className="quick-link-card">
            <div className="quick-link-icon">➕</div>
            <div className="quick-link-content">
              <h4>Add Property</h4>
              <p>List a new property for sale or rent</p>
            </div>
          </Link>
          
          <Link to="/my-property-listings" className="quick-link-card">
            <div className="quick-link-icon">🏠</div>
            <div className="quick-link-content">
              <h4>My Listings</h4>
              <p>Manage your current property listings</p>
            </div>
          </Link>
          
          <Link to="#" className="quick-link-card">
            <div className="quick-link-icon">📊</div>
            <div className="quick-link-content">
              <h4>Analytics</h4>
              <p>View detailed performance metrics</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Dashboard Grid Layout for Desktop */}
      <div className="dashboard-grid desktop-only">
        {/* Recent Activity Section */}
        <div className="collapsible-section grid-item activity-section">
          <div 
            className="collapsible-header" 
            onClick={() => setActivityCollapsed(!activityCollapsed)}
          >
            <h3 className="collapsible-title">Recent Activity</h3>
            <div className={`collapsible-icon ${activityCollapsed ? '' : 'open'}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className={`collapsible-content ${activityCollapsed ? '' : 'open'}`}>
            <div className="collapsible-body">
              <div className="activity-list">
                {recentActivities.map((activity, index) => (
                  <div key={index} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="view-all-link">
                <Link to="#">View all activity</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
