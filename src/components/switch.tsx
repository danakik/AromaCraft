import '../styles/styles.css'
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

type SwitchProps = {
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
}

export const ACSwitch: React.FC<SwitchProps> = ({ checked = false, disabled = false, onChange }) => {
    const [isChecked, setChecked] = useState<boolean>(checked);

    useEffect(() => {
        setChecked(checked);
    }, [checked]);

    const handleSwitchChange = (e: any) => {
        setChecked(e.value);
        if (onChange) {
            onChange(e.value);
        }
    };

    return (
        <div
            onClick={() => !disabled && setChecked(!isChecked)}  
            className={disabled ? 'ac-switch-disabled' : ''} 
        >
            <InputSwitch
                className="custom-switch"
                checked={isChecked}
                onChange={handleSwitchChange}
                readOnly={disabled}
                disabled={disabled}
                style={{
                    ['--inputswitch-checked-bg' as any]: '#6f42c1'
                }} 
            />
        </div>
    );
}
