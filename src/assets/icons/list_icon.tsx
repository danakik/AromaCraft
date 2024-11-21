import React, { SVGProps } from 'react'

const ListIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '24', height = '24', viewBox = '0 0 24 24', color = "white", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <path d="M4 6H15" stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 8V4" stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 14H18.6C18.2686 14 18 13.7314 18 13.4V12.6C18 12.2686 18.2686 12 18.6 12H19.4C19.7314 12 20 11.7314 20 11.4V10.6C20 10.2686 19.7314 10 19.4 10H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 16H19.4C19.7314 16 20 16.2686 20 16.6V19.4C20 19.7314 19.7314 20 19.4 20H18" 
            stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 18H18" stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 12H15" stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 18H15" stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default ListIcon