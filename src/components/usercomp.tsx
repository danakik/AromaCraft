import React from 'react';
import '../styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/usercomp.css';

type UserCompProps = {
    serial_number: string;
};

export const ACUserComp: React.FC<UserCompProps> = ({ serial_number }) => {
    return (
        <div className="ac-user-comp flex flex-wrap gap-3">
           <span className="serial-number">Серійний номер: {serial_number}</span>
        </div>
    );
};
