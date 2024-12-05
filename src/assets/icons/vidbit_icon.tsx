import React from 'react';
import { SVGProps } from 'react';

const VidbirIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '166', height = '95', viewBox = '0 0 166 95', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="1.72821"
        y="93.9788"
        width="92.3133"
        height="163.048"
        transform="rotate(-90 1.72821 93.9788)"
        fill="url(#paint0_linear_308_1697)"
        stroke={color}
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_308_1697"
          x1="89.6284"
          y1="179.082"
          x2="5.93311"
          y2="179.082"
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

export default VidbirIcon;
