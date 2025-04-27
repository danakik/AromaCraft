import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setKey } from '../store/keySlice';
import { useLoginMutation } from '../api/loginApi';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import '../styles/login_page.css';
import { SelectButton } from 'primereact/selectbutton';
import i18n from '../i18n/config';
import { useTranslation } from 'react-i18next';

const LoginPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const { t } = useTranslation();

  const defaultLanguage = localStorage.getItem('language') || 'uk';
  const [selectedOption, setSelectedOption] = useState(defaultLanguage);

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage);
    setSelectedOption(defaultLanguage);
  }, []);

  const handleLanguageChange = (value: string) => {
    if (value === null) {
      return;
    }
    setSelectedOption(value);
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  };

  const selectButtonOptions = [
    { label: 'ENG', value: 'en' },
    { label: 'UKR', value: 'uk' },
  ];

  const handleLogin = async () => {
    try {
      const response = await login(inputValue).unwrap();
      dispatch(setKey(inputValue));
      if (response.trim() === '4') {
        navigate('/main');
      } else {
        toast.error(t('login_error_login1'));
      }
    } catch (error) {
      console.error(t('login_error_login2'), error);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center h-screen w-full">
      <div className="login-container flex flex-column align-items-center justify-content-center">
        <h2 className="text-center login-header">{t('login_header')}</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-user user-icon" />
          <InputText
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('login_input_placeholder')}
            className="p-inputtext-sm login-input"
          />
        </span>
        <br />
        <Button onClick={handleLogin} className="p-button-primary p-button-block login-button" disabled={isLoading}>
          {isLoading ? t('login_button_process') : t('login_button')}
        </Button>
        <br />
        <div className="flex flex-row align-items-center justify-content-center w-full select-lang">
          <SelectButton
            value={selectedOption}
            options={selectButtonOptions}
            onChange={(e) => handleLanguageChange(e.value)}
            optionLabel="label"
            dataKey="value"
            className="custom-select-button"
          />
        </div>
        <p>20111111111111</p>
        <p>20222222222222</p>
        <p>20333333333333</p>
        <p>20444444444444</p>
      </div>
    </div>
  );
};

export default LoginPage;
