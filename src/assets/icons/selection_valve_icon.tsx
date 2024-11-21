import React, { SVGProps } from 'react'

const SelectValveIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '18', height = '18', viewBox = '0 0 18 18', color = "white", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <path d="M8 4.00002L14 10M1 13L12.7 1.30002C12.8869 1.11679 13.1382 1.01416 13.4 1.01416C13.6618 1.01416 13.9131 1.11679 14.1 1.30002L16.7 3.90002C16.8832 4.08695 16.9859 4.33826 16.9859 4.60002C16.9859 4.86177 16.8832 5.11309 16.7 5.30002L5 17H1V13Z" 
            stroke={props.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
        </svg>
    )
}

export default SelectValveIcon