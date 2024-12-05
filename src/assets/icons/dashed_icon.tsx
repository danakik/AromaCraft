import React from 'react';
import { SVGProps } from 'react';

const DashedIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '145', height = '153', viewBox = '0 0 145 153', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="1.58423"
        y="1.47339"
        width="141.715"
        height="149.575"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="7 7"
      />
    </svg>
  );
};

export default DashedIcon;