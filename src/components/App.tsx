import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import ManualProcessPage from '../pages/ManualProcessPage'
import LoginPage from '../pages/LoginPage'
import '../styles/styles.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from './Layout/Layout'
import DistillationProcessPage from '../pages/DistillationProcessPage';
import RectificationProcessPage from '../pages/RectificationProcessPage';
import SettingPage from '../pages/SettingPage';
import DataTemperaturesPage from '../pages/DataTemperaturesPage';
import DataStatisticsPage from '../pages/DataStatisticsPage';


const App: React.FC = () => {

    return (
        <HashRouter>
             <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Layout />}>
                    <Route path="/main" element={<MainPage />} />
                </Route>

                <Route path="/" element={<Layout />}>
                    <Route path="manualprocess" element={<ManualProcessPage />} />
                    <Route path="distillationprocess" element={<DistillationProcessPage />} />
                    <Route path="rectificationprocess" element={<RectificationProcessPage />} />
                    <Route path="datatemperatures" element={<DataTemperaturesPage />} />
                    <Route path="datastatistics" element={<DataStatisticsPage />} />
                    <Route path="setting" element={<SettingPage />} />
                    <Route path="login" element={<LoginPage />} />
                </Route>
            </Routes>
            <ToastContainer />
            
        </HashRouter>
    )
}

export default App
