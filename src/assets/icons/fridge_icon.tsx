import React from 'react';
import { SVGProps } from 'react';

const FridgeIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '107', height = '105', viewBox = '0 0 107 105', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="1.64777"
        y="1.95752"
        width="103.541"
        height="101.296"
        fill="url(#paint0_linear_308_1710)"
        stroke={color}
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_308_1710"
          x1="100.131"
          y1="53.5937"
          x2="6.47229"
          y2="53.5937"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" stopOpacity="0.5" />
          <stop offset="0.2" stopColor="#A4A4A4" stopOpacity="0.4" />
          <stop offset="0.8" stopColor="#A4A4A4" stopOpacity="0.4" />
          <stop offset="1" stopColor="#D9D9D9" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default FridgeIcon;
