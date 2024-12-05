import React from 'react';
import { SVGProps } from 'react';

const SeparatorIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '107', height = '9', viewBox = '0 0 107 9', color = '#030712', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.647766" y="0.834961" width="105.541" height="7.85944" fill={color} />
    </svg>
  );
};

export default SeparatorIcon;