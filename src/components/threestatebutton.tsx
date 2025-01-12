import React, { useState } from "react";
import { Button } from 'primereact/button';
import '../styles/process_page.css';

type ToggleButtonProps = {
    firstStateLabel: string;
    secondStateLabel: string;
    thirdStateLabel: string;
    disabled?: boolean;
    initialState?: number;
};

export const ACThreeStateButton: React.FC<ToggleButtonProps> = ({ firstStateLabel, secondStateLabel, thirdStateLabel }) => {
    const [state, setState] = useState(0);

    const handleClick = () => {
        setState((prevState) => (prevState + 1) % 3);
    };

    const labels = [firstStateLabel, secondStateLabel, thirdStateLabel];
    const colors = ["white", "#9e4ae7", "#42099e"];

    return (
        <Button
            label={labels[state]}
            onClick={handleClick}
            className="custom-toggle-button"
            style={{
                backgroundColor: colors[state],
                color: state === 0 ? "#42099e" : "white", 
                border: "none",
                width: "48px",
                height: "28px",
                margin: "0",
                padding: "0",
                fontSize: "8px",
                fontWeight: "50",
                borderRadius: "6px",
                transition: "background-color 0.3s ease",
            }}
        />
    );
};