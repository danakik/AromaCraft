import React from 'react';
import { SVGProps } from 'react';

const KlapanIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '97', height = '15', viewBox = '0 0 97 15', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="0.138855"
        y="14.1289"
        width="13.4733"
        height="96.5588"
        transform="rotate(-90 0.138855 14.1289)"
        fill={color}
      />
    </svg>
  );
};

export default KlapanIcon;