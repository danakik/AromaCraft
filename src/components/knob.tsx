import '../styles/styles.css'
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { Knob } from 'primereact/knob';
import { Dialog } from 'primereact/dialog';
import { Slider } from 'primereact/slider';
import '../styles/knob.css';

type KnobProps = {
    label: string;
    initialValue: number;
    color: 'orange' | 'blue' | 'purple' | 'red'; 
    readonly?: boolean;
    help?: string;
};

export const ACKnob: React.FC<KnobProps> = ({ label, initialValue, color, readonly = false, help="" }) => {
    const [value, setValue] = useState<number>(initialValue);
    const [dialogVisible, setDialogVisible] = useState(false); 

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    let gradID = color === 'blue' ? 'url(#gradient2)' : 'url(#gradient1)';
    switch(color){
        case 'orange':
            gradID = 'url(#gradient1)';
            break;
        case 'blue':
            gradID = 'url(#gradient2)';
            break;
        case 'purple':
            gradID = 'url(#gradient3)';
            break;
        case 'red':
            gradID = 'url(#gradient4)';
            break;
        default:
            gradID = 'url(#gradient1)';
            break;
    }
    const valueTemp = `${value.toString().replace('.', ',')}°C`;

    const handleLabelClick = () => {
        setDialogVisible(true); 
    };

    const hideDialog = () => {
        setDialogVisible(false); 
    };

    return (
        <div className="card flex flex-column align-items-center justify-content-center">
            <svg width="0" height="0">
                <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#E7724A', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#E84D4B', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#2A41E0', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#6749AE', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#9e4ae7', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#320380', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#e74a4a', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#820738', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
            </svg>
        
            <Knob
                value={value}
                onChange={(e) => setValue(e.value)}
                className="custom-knob"
                valueColor={gradID}   
                rangeColor="#999CA2" 
                valueTemplate={valueTemp}  
                max={120}
                size={200}
                readOnly={readonly}
            />

            <span className="knob-label" onClick={handleLabelClick} style={{ cursor: 'pointer' }}>
                {label}
            </span>

            <Dialog
                header={label}
                visible={dialogVisible}
                onHide={hideDialog}
                style={{ width: '500px' }}
            >
                <p>{help}</p>
            </Dialog>
        </div>
    );
};


export const ACSlider: React.FC<KnobProps> = ({ label, initialValue, color, readonly = false, help="" }) => {
    const [value, setValue] = useState<number | [number, number]>(initialValue);
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    let class_name = 'custom-slider ';
    let gradID;
    switch(color){
        case 'orange':
            gradID = 'url(#gradient1)';
            class_name += 'gradient1';
            break;
        case 'blue':
            gradID = 'url(#gradient2)';
            class_name += 'gradient2';
            break;
        case 'purple':
            gradID = 'url(#gradient3)';
            class_name += 'gradient3';
            break;
        case 'red':
            gradID = 'url(#gradient4)';
            class_name += 'gradient4';
            break;
        default:
            gradID = 'url(#gradient1)';
            class_name += 'gradient1';
            break;
    }
    const valueDisplay = typeof value === 'number' ? `${value.toString().replace('.', ',')}°C` : `${value[0]}, ${value[1]}°C`;

    const handleLabelClick = () => {
        setDialogVisible(true); 
    };

    const hideDialog = () => {
        setDialogVisible(false); 
    };

    return (
        <div className="card flex flex-column align-items-center justify-content-center">
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#E7724A', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#E84D4B', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#2A41E0', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#6749AE', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#9e4ae7', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#320380', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#e74a4a', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#820738', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
            </svg>
        
            <div className="ac-slider-container">
                <Slider
                    value={value}
                    onChange={(e) => setValue(e.value)}
                    className={class_name}
                    max={120}
                    disabled={readonly}
                    style={{
                        '--filled-color': gradID,
                        '--unfilled-color': '#999CA2',
                    } as React.CSSProperties}
                />
                <div className="slider-temp">{valueDisplay}</div>
            </div>
            <span className="knob-label" onClick={handleLabelClick} style={{ cursor: 'pointer' }}>
                {label}
            </span>

            <Dialog
                header={label}
                visible={dialogVisible}
                onHide={hideDialog}
                style={{ width: '500px' }}
            >
                <p>{help}</p>
            </Dialog>
        </div>
    );
}