import React, { SVGProps } from 'react'

const ArrowCurveIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '24', height = '24', viewBox = '0 0 24 24', color = "white", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <g clip-path="url(#clip0_159_1206)">
            <path d="M14 7L10 3L6 7" stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 3V7.394C9.99992 8.50318 10.2737 9.59522 10.7971 10.5732C11.3204 11.5511 12.0771 12.3847 13 13C13.9229 13.6153 14.6796 14.4489 15.2029 15.4268C15.7263 16.4048 16.0001 17.4968 16 18.606V21" 
            stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_159_1206">
            <rect width="24" height="24" fill={props.color || "white"}/>
            </clipPath>
            </defs>
        </svg>
    )
}

export default ArrowCurveIcon