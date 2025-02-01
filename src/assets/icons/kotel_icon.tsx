import React, { SVGProps } from 'react';

const KotelIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '206', height = '156', viewBox = '0 0 206 156', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M186.512 10.7647L204.468 148.863C204.445 150.284 203.643 151.654 202.187 152.71C200.71 153.781 198.621 154.474 196.268 154.474H9.20008C6.84731 154.474 4.75809 153.781 3.28173 152.71C1.82575 151.654 1.02355 150.285 1.00051 148.865L19.517 10.7687L19.6689 9.63576H18.5258H1V1.53076H204.468V9.63576H187.504H186.365L186.512 10.7647Z"
        fill="url(#paint0_linear_309_1715)"
        stroke={color}
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_309_1715"
          x1="205.468"
          y1="79.4851"
          x2="-3.40576e-05"
          y2="79.4851"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" stopOpacity="0.25" />
          <stop offset="0.415" stopColor="#A4A4A4" stopOpacity="0.05" />
          <stop offset="0.6" stopColor="#A4A4A4" stopOpacity="0.05" />
          <stop offset="1" stopColor="#D9D9D9" stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default KotelIcon;
