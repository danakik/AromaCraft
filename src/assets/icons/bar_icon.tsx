import React from 'react';
import { SVGProps } from 'react';

const BarIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '94', height = '412', viewBox = '0 0 94 412', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="92" height="410" fill="url(#paint0_linear_303_1690)" stroke={color} stroke-width="2" />
      <defs>
        <linearGradient
          id="paint0_linear_303_1690"
          x1="88.6049"
          y1="209.943"
          x2="5.18761"
          y2="209.943"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D9D9D9" stop-opacity="0.5" />
          <stop offset="0.2" stop-color="#A4A4A4" stop-opacity="0.4" />
          <stop offset="0.8" stop-color="#A4A4A4" stop-opacity="0.4" />
          <stop offset="1" stop-color="#D9D9D9" stop-opacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BarIcon;