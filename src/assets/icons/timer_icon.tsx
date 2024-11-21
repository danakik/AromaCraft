import React, { SVGProps } from 'react'

const TimerIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '24', height = '24', viewBox = '0 0 24 24', color = "white", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <path d="M9 2H15" stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 10V14" stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z" 
            stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default TimerIcon