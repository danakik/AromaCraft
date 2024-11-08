import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import SecondPage from '../pages/SecondPage'
import LoginPage from '../pages/LoginPage'
import '../styles/styles.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Layout } from './Layout/Layout'

const App: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<Layout />}>
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/second" element={<SecondPage />} />
                </Route>
            </Routes>
            <ToastContainer />
        </HashRouter>
    )
}

export default App
