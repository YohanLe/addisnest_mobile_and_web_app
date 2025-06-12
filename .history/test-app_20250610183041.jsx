import React from 'react';
import ReactDOM from 'react-dom/client';
import SimpleTest from './src/SimpleTest';

// Create a root element
const rootElement = document.getElementById('root') || (() => {
  const element = document.createElement('div');
  element.id = 'root';
  document.body.appendChild(element);
  return element;
})();

// Render our simple test component
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <SimpleTest />
  </React.StrictMode>
);
