import React, { SVGProps } from 'react'

const DocDownloadIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    const { width = '28', height = '28', viewBox = '0 0 28 28', color = "#4980E5", ...restProps } = props;
    return (
        <svg  
        {...restProps} 
        width={width} 
        height={height} 
        viewBox={viewBox}
        fill="none"
        >
            <path fillRule="evenodd" clipRule="evenodd" d="M8.40001 2.80005C6.85361 2.80005 5.60001 4.05365 5.60001 5.60005V22.4C5.60001 23.9464 6.85361 25.2 8.40001 25.2H19.6C21.1464 25.2 22.4 23.9464 22.4 22.4V10.3799C22.4 9.63734 22.105 8.92515 21.5799 8.40005L16.8 3.62015C16.2749 3.09505 15.5627 2.80005 14.8201 2.80005H8.40001ZM15.4 11.2C15.4 10.4269 14.7732 9.80005 14 9.80005C13.2268 9.80005 12.6 10.4269 12.6 11.2V16.2201L10.79 14.4101C10.2432 13.8634 9.35679 13.8634 8.81006 14.4101C8.26332 14.9568 8.26332 15.8433 8.81006 16.39L13.0101 20.59C13.5568 21.1367 14.4432 21.1367 14.99 20.59L19.19 16.39C19.7367 15.8433 19.7367 14.9568 19.19 14.4101C18.6432 13.8634 17.7568 13.8634 17.2101 14.4101L15.4 16.2201V11.2Z" 
            fill={props.color ||"#4980E5"}/>
        </svg>
    )
}

export default DocDownloadIcon