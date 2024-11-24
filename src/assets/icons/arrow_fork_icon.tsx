import React, { SVGProps } from 'react'

const ArrowForkIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '24', height = '24', viewBox = '0 0 24 24', color = "white", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <g clipPath="url(#clip0_159_1221)">
            <path d="M16 3H21V8" stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 3H3V8" stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 3L13.464 10.536C12.5269 11.4734 12.0003 12.7445 12 14.07V21" stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 3L10.536 10.536C11.4731 11.4734 11.9997 12.7445 12 14.07V15" stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_159_1221">
            <rect width="24" height="24" fill={props.color || "white"}/>
            </clipPath>
            </defs>
        </svg>
    )
}

export default ArrowForkIcon