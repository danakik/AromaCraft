import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/usercomp.css';

type UserCompProps = {
  serial_number: string;
};

export const ACUserComp: React.FC<UserCompProps> = ({ serial_number }) => {
  const { t } = useTranslation();

  return (
    <div className="ac-user-comp flex flex-wrap gap-3">
      <span className="serial-number">
        {t('usercomp')} {serial_number}
      </span>
    </div>
  );
};
