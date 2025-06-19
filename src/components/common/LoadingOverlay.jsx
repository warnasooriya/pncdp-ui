import React from 'react';
import './LoadingOverlay.css'; // Import your CSS for styling
function LoadingOverlay({ isLoading }) {
    if (!isLoading) return null;

    return (
        <div className="loading-overlay" aria-busy="true" aria-live="polite">
            <div className="spinner"></div>
        </div>
    );
}

export default LoadingOverlay;