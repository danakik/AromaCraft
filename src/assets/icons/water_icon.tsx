import React, { SVGProps } from 'react'

const WaterIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '14', height = '20', viewBox = '0 0 14 20', color = "white", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <path d="M7 0.0582886C7 0.0582886 0.25 7.4786 0.25 12.7286C0.25 16.8705 2.85812 19.4786 7 19.4786C11.1419 19.4786 13.75 16.8705 13.75 12.7286C13.75 7.4786 7 0.0582886 7 0.0582886ZM7.75 17.0411V15.9161C8.49566 15.9152 9.21052 15.6186 9.73778 15.0914C10.265 14.5641 10.5616 13.8493 10.5625 13.1036H11.6875C11.6864 14.1475 11.2712 15.1484 10.533 15.8866C9.79482 16.6248 8.79395 17.04 7.75 17.0411Z" 
            fill={props.color || "white"}
            />
        </svg>
    )
}

export default WaterIcon