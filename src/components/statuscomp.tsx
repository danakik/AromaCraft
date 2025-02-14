import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/usercomp.css';

type StatusCompProps = {
  status_text: string;
};

export const ACStatusComp: React.FC<StatusCompProps> = ({ status_text }) => {
  const { t } = useTranslation();
  return (
    <div className="ac-user-comp flex flex-wrap gap-3">
      <span className="serial-number">{t('statuscomp')} {status_text}</span>
    </div>
  );
};
