import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { Layout } from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import DevicePage from './pages/DevicePage';
import ManualProcessPage from './pages/ManualProcessPage';
import DistillationProcessPage from './pages/DistillationProcessPage';
import RectificationProcessPage from './pages/RectificationProcessPage';
import MashingProcessPage from './pages/MashingProcessPage';
import SettingPage from './pages/SettingPage';
import DataTemperaturesPage from './pages/DataTemperaturesPage';
import CalculationPage from './pages/CalculationPage';
import CalcMashingPage from './pages/CalcMashingPage';
import './styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';

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
          <Route path="device" element={<DevicePage />} />
          <Route path="manualprocess" element={<ManualProcessPage />} />
          <Route path="distillationprocess" element={<DistillationProcessPage />} />
          <Route path="rectificationprocess" element={<RectificationProcessPage />} />
          <Route path="mashingprocess" element={<MashingProcessPage />} />
          <Route path="calculation" element={<CalculationPage />} />
          <Route path="datatemperatures" element={<DataTemperaturesPage />} />
          <Route path="calcmashing" element={<CalcMashingPage />} />
          <Route path="setting" element={<SettingPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
      />
    </HashRouter>
  );
};

export default App;
