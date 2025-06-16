import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SearchAgent from './search-agent/sub-component/SearchAgent';
import FindAgentList from './find-agent-list/sub-component/FindAgentList';
import './find-agent.css';

const FindAgentPage = () => {
  const location = useLocation();
  const path = location.pathname;
  
  return (
    <div className="find-agent-page">
      <Routes>
        <Route path="/" element={<SearchAgent />} />
        <Route path="/list" element={<FindAgentList />} />
        <Route path="*" element={<Navigate to="/find-agent" replace />} />
      </Routes>
      
      {path === '/find-agent' && (
        <div className="become-agent-cta">
          <div className="cta-content">
            <h2>Are You a Real Estate Professional?</h2>
            <p>Join our network of trusted agents and connect with potential clients</p>
            <button className="primary-btn">Join as an Agent</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindAgentPage;
