import React from 'react';
import { SVGProps } from 'react';

const UnderTextIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '177', height = '39', viewBox = '0 0 177 39', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 1.5H139.5L175 37" stroke={color} strokeWidth="3" />
    </svg>
  );
};

export default UnderTextIcon;