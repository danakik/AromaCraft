import React, { useState, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import '../styles/checkbox.css';

type CheckboxProps = {
  label?: string;
  name?: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
};

export const ACCheckbox: React.FC<CheckboxProps> = ({ label, name = '', value, checked = false, disabled = false }) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className={`custom-checkbox`}>
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
