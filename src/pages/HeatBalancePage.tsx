import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { AxisOptions, Chart } from 'react-charts';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import '../styles/process_page.css';

const HeatBalancePage = () => {
  const key = localStorage.getItem('samogonKey');
  return (
    <>
      <header className="mb-1">
        <div style={{ float: 'right' }}>
          <ACUserComp serial_number={key || ''} />
        </div>
      </header>
      <div>
        
      </div>
    </>
  );
};

export default HeatBalancePage;
