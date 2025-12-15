// src/components/LoadingSpinner.jsx
import React from 'react';
import '../styles/loadingspinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
}

export default LoadingSpinner;