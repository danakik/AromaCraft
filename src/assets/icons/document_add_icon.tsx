import React, { SVGProps } from 'react'

const DocAddIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '28', height = '28', viewBox = '0 0 28 28', color = "#58AC43", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <path fillRule="evenodd" clipRule="evenodd" d="M8.39998 2.80005C6.85358 2.80005 5.59998 4.05365 5.59998 5.60005V22.4C5.59998 23.9464 6.85358 25.2 8.39998 25.2H19.6C21.1464 25.2 22.4 23.9464 22.4 22.4V10.3799C22.4 9.63734 22.105 8.92515 21.5799 8.40005L16.8 3.62015C16.2749 3.09505 15.5627 2.80005 14.8201 2.80005H8.39998ZM15.4 11.2C15.4 10.4269 14.7732 9.80005 14 9.80005C13.2268 9.80005 12.6 10.4269 12.6 11.2V14H9.79998C9.02678 14 8.39998 14.6269 8.39998 15.4C8.39998 16.1732 9.02678 16.8 9.79998 16.8H12.6V19.6C12.6 20.3732 13.2268 21 14 21C14.7732 21 15.4 20.3732 15.4 19.6L15.4 16.8H18.2C18.9732 16.8 19.6 16.1732 19.6 15.4C19.6 14.6269 18.9732 14 18.2 14H15.4V11.2Z" 
            fill={props.color ||"#58AC43"}/>
        </svg>
    )
}

export default DocAddIcon