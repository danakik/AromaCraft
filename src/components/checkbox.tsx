import React, { useState, useEffect } from 'react';
import '../styles/checkbox.css';

type CheckboxProps = {
    label?: string; // Підпис
    name?: string; // Ім'я
    value: string; // Значення
    size?: 'small' | 'mid' | 'big'; // Розмір
    checked?: boolean; // Чекбокс вибраний чи ні
    disabled?: boolean; // Заблокований чи ні
};

export const ACCheckbox: React.FC<CheckboxProps> = ({
    label,
    name = '',
    value,
    size = 'big',
    checked = false,
    disabled = false
}) => {
    const [isChecked, setIsChecked] = useState<boolean>(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };

    return (
        <div className={`custom-checkbox ${size}`}>
            <input
                type="checkbox"
                id={name}
                name={name}
                value={value}
                checked={isChecked}
                disabled={disabled}
                onChange={handleCheckboxChange}
                className="custom-checkbox-input"
            />
            <label htmlFor={name} className="custom-checkbox-label">
                {label}
            </label>
        </div>
    );
};