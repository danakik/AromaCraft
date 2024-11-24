import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setKey } from '../store/keySlice';
import { useLoginMutation } from '../api/loginApi';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import '../styles/login_page.css';

const DataStatisticsPage: React.FC = () => {
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

  return <div className="flex justify-content-center align-items-center h-screen w-full"></div>;
};

export default DataStatisticsPage;
