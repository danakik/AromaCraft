import React, { SVGProps } from 'react';

const NagrevIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '255', height = '236', viewBox = '0 0 255 236', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.7256 9.91847H1.69092V1.81348H254V9.91847H240.404H239.404V10.9185V205.474C239.404 221.49 226.42 234.474 210.404 234.474H44.7256C28.7094 234.474 15.7256 221.49 15.7256 205.474V10.9185V9.91847H14.7256Z"
        fill="url(#paint0_linear_303_1590)"
        stroke="white"
        stroke-width="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_303_1590"
          x1="240.404"
          y1="120.389"
          x2="14.7256"
          y2="120.389"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D9D9D9" stop-opacity="0.25" />
          <stop offset="0.2" stop-color="#A4A4A4" stop-opacity="0.05" />
          <stop offset="0.8" stop-color="#A4A4A4" stop-opacity="0.05" />
          <stop offset="1" stop-color="#D9D9D9" stop-opacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default NagrevIcon;
