import React, { SVGProps } from 'react';

const BorderIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const { width = '227', height = '143', viewBox = '0 0 227 143', color = 'white', ...restProps } = props;
  return (
    <svg width={width} height={height} viewBox={viewBox}  fill="none" xmlns="http://www.w3.org/2000/svg" {...restProps}>
      <rect x="1.22565" y="1.45264" width="224.678" height="140.47" fill="#D9D9D9" fill-opacity="0.09" stroke={color} />
    </svg>
  );
};

export default BorderIcon;
