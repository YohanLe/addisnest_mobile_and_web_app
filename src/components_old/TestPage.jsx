import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Test Page</h1>
      <p style={{ fontSize: '18px', color: '#555' }}>
        This is a simple test page to verify that routing is working correctly.
      </p>
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#4a6cf7', marginBottom: '10px' }}>Debug Information</h2>
        <p>Current URL: {window.location.href}</p>
        <p>Pathname: {window.location.pathname}</p>
      </div>
    </div>
  );
};

export default TestPage;
