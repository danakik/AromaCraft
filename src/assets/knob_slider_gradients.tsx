import React from 'react';

const Gradients: React.FC = () => {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#E7724A', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#E84D4B', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#2A41E0', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6749AE', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#9e4ae7', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#5514bc', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#e74a4a', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#a9124f', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Gradients;
