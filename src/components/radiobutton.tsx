import '../styles/styles.css'; 
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import '../styles/radiobutton.css';

type RadiobuttonProps = {
    label?: string; // Пропс для підпису
    name?: string;   // Пропс для ім'я
    value: string;  // Пропс для значення
    size?: 'small' | 'mid' | 'big'; // Пропс для розміру
    checked?: boolean;
    disabled?: boolean;
}

export const ACRadiobutton: React.FC<RadiobuttonProps> = ({
    name = '',
    value,
    size = 'big',
    label,
    checked = false,
    disabled = false
}) => {
    const [selectedValue, setSelectedValue] = useState<string | null>(checked ? value : null);

    const handleRadioChange = (e: any) => {
        setSelectedValue(e.value);
    };

    return (
        <div className={`custom-radiobutton ${size}`}>
            <RadioButton
                onChange={handleRadioChange}
                checked={selectedValue === value} 
                name={name} 
                value={value} 
                disabled={disabled}
            />
            <label htmlFor={name}>{label}</label>
        </div>
    );
};