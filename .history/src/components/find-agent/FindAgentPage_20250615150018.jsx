import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SearchAgent from './search-agent/sub-component/SearchAgent';
import FindAgentList from './find-agent-list/sub-component/FindAgentList';
import './find-agent.css';

const FindAgentPage = () => {
  return (
    <div className="find-agent-page">
      <Routes>
        <Route path="/" element={<SearchAgent />} />
        <Route path="/list" element={<FindAgentList />} />
        <Route path="*" element={<Navigate to="/find-agent" replace />} />
      </Routes>
    </div>
  );
};

export default FindAgentPage;
