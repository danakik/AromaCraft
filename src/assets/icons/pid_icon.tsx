import React, { SVGProps } from 'react'

const PidIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '14', height = '19', viewBox = '0 0 14 19', color = "white", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <path d="M7 9C9 6.04 7 2 6 1C6 4.038 4.227 5.741 3 7C1.774 8.26 1 10.24 1 12C1 13.5913 1.63214 15.1174 2.75736 16.2426C3.88258 17.3679 5.4087 18 7 18C8.5913 18 10.1174 17.3679 11.2426 16.2426C12.3679 15.1174 13 13.5913 13 12C13 10.468 11.944 8.06 11 7C9.214 10 8.209 10 7 9Z" 
            stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"
            />
        </svg>
    )
}

export default PidIcon