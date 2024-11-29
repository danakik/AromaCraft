import React, { SVGProps } from 'react';

const HeatIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '227', height = '39', viewBox = '0 0 227 39', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.725647 0.299805H226.404V6.47424C226.404 24.1474 212.077 38.4742 194.404 38.4742H32.7257C15.0525 38.4742 0.725647 24.1473 0.725647 6.47424V0.299805Z"
        fill="url(#paint0_linear_303_1687)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_303_1687"
          x1="114.126"
          y1="38.4742"
          x2="114.126"
          y2="0.299805"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF0000" stop-opacity="0.61" />
          <stop offset="1" stop-color="#737373" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default HeatIcon;
