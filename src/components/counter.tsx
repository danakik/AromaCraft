import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import '../styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/counter.css';

type CounterProps = {
    value: number; 
    units: string;
};

export const ACCounter: React.FC<CounterProps> = ({ value, units }) => {

    let min = 0, max = 100, step = 1;
    switch(units){
        case '%':
            step = 1;
            min = 0;
            max = 100;
            break;
        case 'л/г':
            step = 0.1;
            min = 0;
            max = 2;
            break;
        case '°C':
            step = 1;
            min = 0;
            max = 120;
            break;
        default:
            step = 1;
            min = 0;
            max = 100;
            break;
    }

    const [count, setCount] = useState(value);

    const handleIncrement = () => {
        if (count < max) {
            setCount(prevCount => prevCount + step);
        }
    };

    const handleDecrement = () => {
        if (count > min) {
            setCount(prevCount => prevCount - step);
        }
    };

    const handleInputChange = (e: any) => {
        setCount(e.value);
    };

    useEffect(() => {
        setCount(value);
    }, [value]);

    return (
        <div className="flex flex-wrap gap-3 justify-content-center align-items-center flex flex-vertical-center">
            <Button 
                icon="pi pi-minus" 
                className="custom-button" 
                onClick={handleDecrement}
            />
            <input
                type="text"
                value={count}
                onChange={handleInputChange}
                min={min}
                max={max}
                step={step}
                className="custom-input"
            />
            <span className="custom-label">{units}</span>
            <Button 
                icon="pi pi-plus" 
                className="custom-button" 
                onClick={handleIncrement}
            />
        </div>
    );
};

type CounterProps2 = {
    value: number; 
    units: string;
    label: string;
    help: string;
};

export const ACCounterLabel: React.FC<CounterProps2> = ({ value, units, label, help }) => {
    const [dialogVisible, setDialogVisible] = useState(false);

    const handleLabelClick = () => {
        setDialogVisible(true); 
    };

    const hideDialog = () => {
        setDialogVisible(false); 
    };

    let min = 0, max = 100, step = 1;
    switch(units){
        case '%':
            step = 1;
            min = 0;
            max = 100;
            break;
        case 'л/г':
            step = 0.1;
            min = 0;
            max = 2;
            break;
        case '°C':
            step = 1;
            min = 0;
            max = 120;
            break;
        default:
            step = 1;
            min = 0;
            max = 100;
            break;
    }

    const [count, setCount] = useState(value);

    const handleIncrement = () => {
        if (count < max) {
            setCount(prevCount => prevCount + step);
        }
    };

    const handleDecrement = () => {
        if (count > min) {
            setCount(prevCount => prevCount - step);
        }
    };

    const handleInputChange = (e: any) => {
        setCount(e.value);
    };

    return (
        <div className="flex label-container">
            <p className="label" onClick={handleLabelClick} style={{ cursor: 'pointer' }}>{label}</p>
            <div className="flex flex-wrap gap-3 justify-content-center align-items-center flex flex-vertical-center">
                <Button 
                    icon="pi pi-minus" 
                    className="custom-button" 
                    onClick={handleDecrement}
                />
                <input
                    type="text"
                    value={count}
                    onChange={handleInputChange}
                    min={min}
                    max={max}
                    step={step}
                    className="custom-input"
                />
                <span className="custom-label">{units}</span>
                <Button 
                    icon="pi pi-plus" 
                    className="custom-button" 
                    onClick={handleIncrement}
                />
            </div>
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
