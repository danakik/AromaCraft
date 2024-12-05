import React from 'react';
import { SVGProps } from 'react';

const VectorIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '91', height = '4', viewBox = '0 0 91 4', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 2H91" stroke={color} strokeWidth="3" />
    </svg>
  );
};

export default VectorIcon;