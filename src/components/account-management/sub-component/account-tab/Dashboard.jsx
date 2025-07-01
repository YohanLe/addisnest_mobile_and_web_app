import React, { useState } from "react";
import { Link } from "react-router-dom";

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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Impression');
  const months = Object.keys(mockMonthlyData);
  const values = Object.values(mockMonthlyData);
  const maxValue = Math.max(...values);

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
  
  return (
    <div className="dashboard-container">
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
        </div>
      </div>

      {/* Collapsible Performance Metrics Section - Desktop Only */}
      <div className="collapsible-section desktop-only">
        <div 
          className="collapsible-header" 
          onClick={() => setChartCollapsed(!chartCollapsed)}
        >
          <h3 className="collapsible-title">Performance Metrics</h3>
          <div className={`collapsible-icon ${chartCollapsed ? '' : 'open'}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className={`collapsible-content ${chartCollapsed ? '' : 'open'}`}>
          <div className="collapsible-body">
            <div className="metrics-tabs">
              <div 
                className={`tab ${activeTab === 'Impression' ? 'active' : ''}`}
                onClick={() => setActiveTab('Impression')}
              >
                Impression
              </div>
              <div 
                className={`tab ${activeTab === 'Visitors' ? 'active' : ''}`}
                onClick={() => setActiveTab('Visitors')}
              >
                Visitors
              </div>
              <div 
                className={`tab ${activeTab === 'Phone View' ? 'active' : ''}`}
                onClick={() => setActiveTab('Phone View')}
              >
                Phone View
              </div>
            </div>

            <div className="metrics-chart">
              <h3>{activeTab} Metrics</h3>
              <div className="chart-container">
                <div className="chart">
                  <div className="chart-bars">
                    {months.map((month, index) => (
                      <div key={month} className="chart-bar-container">
                        <div 
                          className="chart-bar" 
                          style={{ 
                            height: values[index] > 0 ? `${(values[index] / maxValue) * 200}px` : '1px',
                            backgroundColor: activeTab === 'Impression' ? '#8fe2e9' : 
                                           activeTab === 'Visitors' ? '#9ed582' : '#f8c07f'
                          }}
                        ></div>
                        <div className="chart-label">{month}</div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-y-axis">
                    {[0, maxValue/2, maxValue].map((value, index) => (
                      <div key={index} className="y-axis-label">
                        {value.toFixed(1)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .chart-container {
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            margin-top: 20px;
          }
          
          .chart {
            display: flex;
            position: relative;
            height: 250px;
            padding-bottom: 30px;
            padding-left: 30px;
          }
          
          .chart-y-axis {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 30px;
            width: 30px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          
          .y-axis-label {
            font-size: 12px;
            color: #888;
            text-align: right;
            padding-right: 5px;
          }
          
          .chart-bars {
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            width: 100%;
            height: 200px;
          }
          
          .chart-bar-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          
          .chart-bar {
            width: 20px;
            background-color: #8fe2e9;
            border-radius: 4px 4px 0 0;
            transition: height 0.3s ease;
          }
          
          .chart-label {
            font-size: 12px;
            color: #666;
            margin-top: 8px;
          }
        `}
      </style>

      <style jsx="true">{`
        .quick-links-section {
          margin-bottom: 20px;
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .quick-links-section h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
          color: #333;
        }
        
        .quick-links-container {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          padding-bottom: 5px;
        }
        
        .quick-link-card {
          display: flex;
          align-items: center;
          min-width: 250px;
          background: linear-gradient(to right, #fafcff, #f5f8ff);
          border: 1px solid #e6efff;
          border-radius: 8px;
          padding: 15px;
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
        }
        
        .quick-link-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(74, 108, 247, 0.1);
          border-color: #4a6cf7;
        }
        
        .quick-link-icon {
          font-size: 24px;
          margin-right: 15px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(74, 108, 247, 0.1);
          border-radius: 8px;
          color: #4a6cf7;
        }
        
        .quick-link-content h4 {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: #1e293b;
        }
        
        .quick-link-content p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }
        
        /* Mobile Summary Cards */
        .mobile-summary-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .summary-card {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 10px;
          padding: 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .summary-icon {
          font-size: 24px;
          margin-right: 15px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(74, 108, 247, 0.1);
          border-radius: 8px;
          color: #4a6cf7;
        }
        
        .summary-content {
          flex: 1;
        }
        
        .summary-content h4 {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #666;
        }
        
        .summary-value {
          display: flex;
          align-items: center;
        }
        
        .summary-value .number {
          font-size: 20px;
          font-weight: bold;
          margin-right: 8px;
        }
        
        .summary-value .percentage {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 20px;
        }
        
        .desktop-only {
          display: block;
        }
        
        @media (min-width: 768px) {
          .mobile-summary-cards {
            display: none;
          }
        }
        
        @media (max-width: 768px) {
          .desktop-only {
            display: none;
          }
          .quick-links-container {
            flex-direction: column;
            gap: 10px;
          }
          
          .quick-link-card {
            width: 100%;
          }
          
          .metrics-tabs {
            display: flex;
            overflow-x: auto;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          
          .tab {
            flex: 0 0 auto;
            padding: 8px 15px;
            white-space: nowrap;
          }
          
          .chart {
            height: 200px;
          }
          
          .chart-bar {
            width: 15px;
          }
          
          .chart-label {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
