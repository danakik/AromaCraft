import React from 'react';
import { SVGProps } from 'react';

const WaterBarIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '273', height = '238', viewBox = '0 0 273 238', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M104.156 235.437C104.157 235.661 104.159 235.863 104.162 236.043L1.2967 236.043C1.44032 177.596 14.1778 133.776 34.2052 100.908C54.3456 67.8545 81.8976 45.8131 111.571 31.1089C170.379 1.96674 237.456 1.66872 271.483 1.6657L271.483 92.4471C184.809 92.7213 142.883 128.657 122.701 164.756C112.593 182.837 107.968 200.909 105.867 214.453C104.817 221.227 104.397 226.874 104.24 230.833C104.162 232.813 104.149 234.371 104.156 235.437Z"
        fill="url(#paint0_radial_308_1705)"
        stroke={color}
        strokeWidth="2"
      />
      <defs>
        <radialGradient
          id="paint0_radial_308_1705"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(199.502 217.361) rotate(-156.332) scale(188.788 241.012)"
        >
          <stop offset="0.507539" stopColor="#D9D9D9" stopOpacity="0.5" />
          <stop offset="0.643814" stopColor="#A4A4A4" stopOpacity="0.4" />
          <stop offset="0.856234" stopColor="#A4A4A4" stopOpacity="0.4" />
          <stop offset="1" stopColor="#D9D9D9" stopOpacity="0.5" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default WaterBarIcon;
