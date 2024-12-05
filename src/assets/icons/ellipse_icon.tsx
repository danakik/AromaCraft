import React from 'react';
import { SVGProps } from 'react';

const EllipseIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '27', height = '27', viewBox = '0 0 27 27', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox} {...restProps} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="13.2955"
        cy="13.3921"
        r="9.67528"
        transform="rotate(-90 13.2955 13.3921)"
        fill={restProps.fill}
        stroke={color}
        strokeWidth="7"
      />
    </svg>
  );
};

export default EllipseIcon;