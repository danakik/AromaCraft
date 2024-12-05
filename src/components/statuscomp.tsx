import React from 'react';
import '../styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/usercomp.css';

type StatusCompProps = {
  status_text: string;
};

export const ACStatusComp: React.FC<StatusCompProps> = ({ status_text }) => {
  return (
    <div className="ac-user-comp flex flex-wrap gap-3">
      <span className="serial-number">Статус: {status_text}</span>
    </div>
  );
};
