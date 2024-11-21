import '../styles/styles.css'
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import '../styles/blocktemp.css';

type BlockTempProps = {
    color: 'orange' | 'blue' | 'purple' | 'red'; 
    temp: string;
    name: string;
    help?: string;
}

export const ACBlockTemp: React.FC<BlockTempProps> = ({ color, temp, name, help="" }) => {
    
    const [dialogVisible, setDialogVisible] = useState(false); 
    const handleClick = () => {
        setDialogVisible(true); 
    };

    const hideDialog = () => {
        setDialogVisible(false); 
    };

    let color_choosed = "";
    switch(color){
        case 'purple':
            color_choosed = "#9e4ae7";
            break;
        case 'orange':
            color_choosed = "#e7764a";
            break;
        case 'red':
            color_choosed = "#e74a4a";
            break;
        case 'blue':
            color_choosed = "#2942e1";
            break;
        default:
            color_choosed = "#9e4ae7";
            break;
    }
    const circleStyle = {
        width: '50px',        
        height: '50px',       
        borderRadius: '50%',   
        backgroundColor: color_choosed, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    };
    const tempTemp = `${temp.toString().replace('.', ',')}°C`;


return (
    <div
        className="blockTemp">
        <div style={circleStyle} className="imgBlockTemp">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <path d="M16 2.66669C14.6317 2.66669 13.3157 3.1926 12.3242 4.13565C11.3328 5.0787 10.7417 6.36674 10.6733 7.73335L10.6666 8.00002L10.6653 16.9707L10.592 17.048C9.52542 18.2126 8.86325 19.6903 8.70398 21.2614L8.67598 21.6294L8.66665 22C8.66676 23.1771 8.95021 24.3368 9.49304 25.3812C10.0359 26.4256 10.8221 27.324 11.7854 28.0005C12.7486 28.677 13.8605 29.1117 15.0272 29.2678C16.1938 29.4239 17.3809 29.297 18.4882 28.8976C19.5954 28.4982 20.5902 27.8382 21.3886 26.9733C22.187 26.1084 22.7654 25.064 23.075 23.9284C23.3847 22.7928 23.4164 21.5993 23.1676 20.4489C22.9187 19.2985 22.3966 18.2248 21.6453 17.3187L21.4066 17.0454L21.3346 16.9694L21.3333 8.00002C21.3334 6.67848 20.8429 5.40396 19.9568 4.42351C19.0707 3.44305 17.8521 2.8265 16.5373 2.69335L16.2666 2.67335L16 2.66669ZM16 5.33335C16.6727 5.33314 17.3207 5.58723 17.814 6.04468C18.3074 6.50214 18.6095 7.12915 18.66 7.80002L18.6666 8.00002V18.124L19.1106 18.5214C19.8062 19.1434 20.2993 19.9596 20.5262 20.8647C20.7532 21.7698 20.7036 22.7221 20.384 23.5987C20.0643 24.4753 19.4891 25.236 18.7328 25.7825C17.9765 26.3289 17.0737 26.6361 16.141 26.6644C15.2084 26.6926 14.2886 26.4406 13.5006 25.9409C12.7126 25.4413 12.0925 24.7168 11.7203 23.8611C11.3482 23.0055 11.241 22.0579 11.4128 21.1407C11.5846 20.2236 12.0274 19.379 12.684 18.716L12.888 18.5227L13.332 18.1254L13.3333 8.00002C13.3333 7.29278 13.6143 6.6145 14.1144 6.1144C14.6145 5.61431 15.2927 5.33335 16 5.33335ZM16 10.6667C15.6464 10.6667 15.3072 10.8072 15.0572 11.0572C14.8071 11.3073 14.6666 11.6464 14.6666 12V18.944C13.9648 19.2503 13.3898 19.789 13.0384 20.4694C12.6869 21.1498 12.5805 21.9305 12.737 22.6801C12.8934 23.4298 13.3032 24.1027 13.8975 24.5857C14.4917 25.0687 15.2342 25.3324 16 25.3324C16.7658 25.3324 17.5082 25.0687 18.1025 24.5857C18.6967 24.1027 19.1065 23.4298 19.263 22.6801C19.4195 21.9305 19.313 21.1498 18.9616 20.4694C18.6102 19.789 18.0352 19.2503 17.3333 18.944V12C17.3333 11.6464 17.1928 11.3073 16.9428 11.0572C16.6927 10.8072 16.3536 10.6667 16 10.6667Z" fill="white"/>
        </svg>
        </div>
        <p className="tempBlockTemp">{tempTemp}</p>
        <p className="textBlockTemp" onClick={handleClick} style={{ cursor: 'pointer' }} >{name}</p>
        <Dialog
                header={name}
                visible={dialogVisible}
                onHide={hideDialog}
                style={{ width: '500px' }}
            >
                <p>{help}</p>
            </Dialog>
    </div>
);
}

export const ACBlockTempSmall: React.FC<BlockTempProps> = ({ color, temp, name, help="" }) => {
    
    const [dialogVisible, setDialogVisible] = useState(false); 
    const handleClick = () => {
        setDialogVisible(true); 
    };

    const hideDialog = () => {
        setDialogVisible(false); 
    };

    let color_choosed = "";
    switch(color){
        case 'purple':
            color_choosed = "#9e4ae7";
            break;
        case 'orange':
            color_choosed = "#e7764a";
            break;
        case 'red':
            color_choosed = "#e74a4a";
            break;
        case 'blue':
            color_choosed = "#2942e1";
            break;
        default:
            color_choosed = "#9e4ae7";
            break;
    }
    const circleStyle = {
        width: '50px',        
        height: '50px',       
        borderRadius: '50%',   
        backgroundColor: color_choosed, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    };
    const tempTemp = `${temp.toString().replace('.', ',')}°C`;


return (
    <div className="blockTemp-s flex align-items-start justify-content-start p-3">
    <div style={circleStyle} className="imgBlockTemp-s mt-3">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <path d="M16 2.66669C14.6317 2.66669 13.3157 3.1926 12.3242 4.13565C11.3328 5.0787 10.7417 6.36674 10.6733 7.73335L10.6666 8.00002L10.6653 16.9707L10.592 17.048C9.52542 18.2126 8.86325 19.6903 8.70398 21.2614L8.67598 21.6294L8.66665 22C8.66676 23.1771 8.95021 24.3368 9.49304 25.3812C10.0359 26.4256 10.8221 27.324 11.7854 28.0005C12.7486 28.677 13.8605 29.1117 15.0272 29.2678C16.1938 29.4239 17.3809 29.297 18.4882 28.8976C19.5954 28.4982 20.5902 27.8382 21.3886 26.9733C22.187 26.1084 22.7654 25.064 23.075 23.9284C23.3847 22.7928 23.4164 21.5993 23.1676 20.4489C22.9187 19.2985 22.3966 18.2248 21.6453 17.3187L21.4066 17.0454L21.3346 16.9694L21.3333 8.00002C21.3334 6.67848 20.8429 5.40396 19.9568 4.42351C19.0707 3.44305 17.8521 2.8265 16.5373 2.69335L16.2666 2.67335L16 2.66669ZM16 5.33335C16.6727 5.33314 17.3207 5.58723 17.814 6.04468C18.3074 6.50214 18.6095 7.12915 18.66 7.80002L18.6666 8.00002V18.124L19.1106 18.5214C19.8062 19.1434 20.2993 19.9596 20.5262 20.8647C20.7532 21.7698 20.7036 22.7221 20.384 23.5987C20.0643 24.4753 19.4891 25.236 18.7328 25.7825C17.9765 26.3289 17.0737 26.6361 16.141 26.6644C15.2084 26.6926 14.2886 26.4406 13.5006 25.9409C12.7126 25.4413 12.0925 24.7168 11.7203 23.8611C11.3482 23.0055 11.241 22.0579 11.4128 21.1407C11.5846 20.2236 12.0274 19.379 12.684 18.716L12.888 18.5227L13.332 18.1254L13.3333 8.00002C13.3333 7.29278 13.6143 6.6145 14.1144 6.1144C14.6145 5.61431 15.2927 5.33335 16 5.33335ZM16 10.6667C15.6464 10.6667 15.3072 10.8072 15.0572 11.0572C14.8071 11.3073 14.6666 11.6464 14.6666 12V18.944C13.9648 19.2503 13.3898 19.789 13.0384 20.4694C12.6869 21.1498 12.5805 21.9305 12.737 22.6801C12.8934 23.4298 13.3032 24.1027 13.8975 24.5857C14.4917 25.0687 15.2342 25.3324 16 25.3324C16.7658 25.3324 17.5082 25.0687 18.1025 24.5857C18.6967 24.1027 19.1065 23.4298 19.263 22.6801C19.4195 21.9305 19.313 21.1498 18.9616 20.4694C18.6102 19.789 18.0352 19.2503 17.3333 18.944V12C17.3333 11.6464 17.1928 11.3073 16.9428 11.0572C16.6927 10.8072 16.3536 10.6667 16 10.6667Z" fill="white"/>
        </svg>
        </div>
    <div className="flex flex-column align-items-start justify-content-start">
        <p className="tempBlockTemp">{tempTemp}</p>
        <p 
            className="textBlockTemp" 
            onClick={handleClick} 
            style={{ cursor: 'pointer' }}
        >
            {name}
        </p>
    </div>
        <Dialog
                header={name}
                visible={dialogVisible}
                onHide={hideDialog}
                style={{ width: '500px' }}
            >
                <p>{help}</p>
            </Dialog>
    </div>
);
}