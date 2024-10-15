import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setKey } from '../store/keySlice'
import { useLoginMutation } from '../api/loginApi'
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
    const [inputValue, setInputValue] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [login, { isLoading, error }] = useLoginMutation()

    const handleLogin = async () => {
        try {
            const response = await login(inputValue).unwrap() 
            console.log(response)
            console.log(typeof response); 
            console.log('Response:', response, 'Length:', response.length);

            dispatch(setKey(inputValue)) // Сохраняем ключ в Redux
            if (response.trim() === '4') {
                console.log('Navigating to main page...');
                navigate('/main')
            } else {
                toast.error('Відсутній в базі');
            }
        } catch (error) {
            console.error('Error during login:', error)
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Devaic ID"
                className="login-input"
            />
            <button onClick={handleLogin} className="login-button" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>

        </div>
    )
}

export default LoginPage
