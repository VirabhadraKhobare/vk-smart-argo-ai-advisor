/**
 * LoadingSpinner Component
 * Reusable loading indicator with optional overlay
 */
import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const spinnerSizes = { sm: '1rem', md: '2rem', lg: '3rem' };

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="text-center">
          <Spinner 
            animation="border" 
            variant="success" 
            style={{ width: spinnerSizes[size], height: spinnerSizes[size] }}
          />
          {text && <p className="mt-3 text-muted">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      <Spinner 
        animation="border" 
        variant="success" 
        style={{ width: spinnerSizes[size], height: spinnerSizes[size] }}
      />
      {text && <span className="ms-3 text-muted">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
