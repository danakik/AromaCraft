import React from 'react';
import { SVGProps } from 'react';

const OutsideSeparatorIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '165', height = '11', viewBox = '0 0 165 11', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.70111" y="1.22119" width="161.925" height="8.105" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export default OutsideSeparatorIcon;