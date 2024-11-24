import React, { SVGProps } from 'react'

const ABarsIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '24', height = '24', viewBox = '0 0 24 24', color = "white", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <g clipPath="url(#clip0_159_1242)">
            <path d="M6 18V15" stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 18V12" stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 18V9" stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 18V6" stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_159_1242">
            <rect width="24" height="24" fill={props.color || "white"}/>
            </clipPath>
            </defs>
        </svg>
    )
}

export default ABarsIcon