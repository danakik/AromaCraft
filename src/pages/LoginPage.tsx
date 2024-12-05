import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setKey } from '../store/keySlice';
import { useLoginMutation } from '../api/loginApi';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import '../styles/login_page.css';

const LoginPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const response = await login(inputValue).unwrap();
      dispatch(setKey(inputValue));
      if (response.trim() === '4') {
        navigate('/main');
      } else {
        toast.error('Відсутній в базі');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center h-screen w-full">
      <div className="login-container flex flex-column align-items-center justify-content-center">
        <h2 className="text-center login-header">Авторизація</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-user user-icon" />
          <InputText
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ID пристрою"
            className="p-inputtext-sm login-input"
          />
        </span>
        <br />
        <Button onClick={handleLogin} className="p-button-primary p-button-block login-button" disabled={isLoading}>
          {isLoading ? 'Вхід в систему...' : 'Увійти'}
        </Button>

      </div>
    </div>
  );
};

export default LoginPage;
