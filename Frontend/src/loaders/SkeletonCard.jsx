import React from 'react';
import '../styles/loaders.css';

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img pulse"></div>
      <div className="skeleton-content">
        <div className="skeleton-title pulse"></div>
        <div className="skeleton-text pulse"></div>
        <div className="skeleton-text short pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
