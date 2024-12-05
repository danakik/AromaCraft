import '../styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import '../styles/radiobutton.css';

type RadiobuttonProps = {
  label?: string;
  name?: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
};

export const ACRadiobutton: React.FC<RadiobuttonProps> = ({
  name = '',
  value,
  label,
  checked = false,
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(checked ? value : null);

  const handleRadioChange = (e: any) => {
    setSelectedValue(e.value);
  };

  return (
    <div className={`custom-radiobutton`}>
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
