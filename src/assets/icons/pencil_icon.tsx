import React, { SVGProps } from 'react'

const PencilIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '28', height = '28', viewBox = '0 0 28 28', color = "#4980E5", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <path d="M19.0201 5.02005C20.1136 3.92658 21.8864 3.92658 22.9799 5.02005C24.0734 6.11352 24.0734 7.88638 22.9799 8.97985L21.8699 10.0899L17.9101 6.1301L19.0201 5.02005Z" 
            fill= {props.color || "#4980E5"}/>
            <path d="M15.9302 8.11L4.20001 19.8402V23.8H8.15981L19.89 12.0698L15.9302 8.11Z" fill= {props.color || "#4980E5"}/>
        </svg>
    )
}

export default PencilIcon