import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import '../styles/process_page.css';

type ToggleButtonProps = {
  firstStateLabel: string;
  secondStateLabel: string;
  thirdStateLabel: string;
  disabled?: boolean;
  onChange?: (e: { value: number }) => void;
  initialState?: number;
};
export const ACThreeStateButton: React.FC<ToggleButtonProps> = ({
  onChange,
  initialState = 0,
  firstStateLabel,
  secondStateLabel,
  thirdStateLabel,
}) => {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  const handleClick = () => {
    const newState = (state + 1) % 3;
    setState(newState);
    onChange && onChange({ value: newState });
  };

  const labels = [firstStateLabel, secondStateLabel, thirdStateLabel];
  const colors = ['white', '#8b5cf6', '#42099e'];

  return (
    <Button
      label={labels[state]}
      onClick={handleClick}
      className="custom-toggle-button custom-three-button"
      style={{
        backgroundColor: colors[state],
        color: state === 0 ? '#42099e' : 'white',
      }}
    />
  );
};
