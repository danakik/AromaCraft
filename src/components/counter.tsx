import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import '../styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/counter.css';

type CounterProps = {
  value: number;
  units: string;
  onChange?: (e: { value: number }) => void;
  disabled?: boolean;
  hint?: string;
};

export const ACCounter: React.FC<CounterProps> = ({ value, units, onChange, disabled = false, hint }) => {
  let min = 0,
    max = 100,
    step = 1;
  switch (units) {
    case '%':
      step = 1;
      min = 0;
      max = 100;
      break;
    case 'л/г':
      step = 0.01;
      min = 0.0;
      max = 6;
      break;
    case '°C':
      step = 2;
      min = 0;
      max = 120;
      break;
    case ' °C': //гістерезис
      step = 0.1;
      min = 0.1;
      max = 2;
      break;
    case '°C ': //зміна температури в налаштуваннях
      step = 0.1;
      min = -20;
      max = 100;
      break;
    case 'хв':
      step = 1;
      min = 0;
      max = Number.MAX_VALUE;
      break;
    case 'Вт':
      step = 100;
      min = 0;
      max = 12000;
      break;
    default:
      step = 1;
      min = 0;
      max = 100;
      break;
  }

  switch(hint){
    case 'pauses':
      step = 1;
      min = 1;
      max = 10;
  }

  const [count, setCount] = useState(value);

  const handleIncrement = () => {
    if (count < max) {
      setCount((prevCount) => prevCount + step);
      onChange && onChange({ value: count + step });
    }
  };

  const handleDecrement = () => {
    if (count > min) {
      setCount((prevCount) => prevCount - step);
      onChange && onChange({ value: count - step });
    }
  };

  const handleInputChange = (e: any) => {
    setCount(e.value);
    onChange && onChange({ value: e.value });
  };

  useEffect(() => {
    setCount(value);
  }, [value]);

  return (
    <div className="flex flex-wrap gap-3 justify-content-center align-items-center flex flex-vertical-center">
      <Button icon="pi pi-minus" className="custom-button" onClick={handleDecrement} disabled={disabled}/>
      <div className="custom-input">
        <InputNumber suffix={units} value={count} onChange={handleInputChange} min={min} max={max} step={step} mode="decimal" minFractionDigits={0} maxFractionDigits={2} disabled={disabled}/>     
      </div>
      <Button icon="pi pi-plus" className="custom-button right-b" onClick={handleIncrement} disabled={disabled} />
    </div>
  );
};

type CounterProps2 = {
  value: number;
  units: string;
  label: string;
  help: string;
  onChange?: (e: { value: number }) => void;
  disabled?: boolean;
};

export const ACCounterLabel: React.FC<CounterProps2> = ({ value, units, label, help, onChange, disabled = false }) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleLabelClick = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  let min = 0,
    max = 100,
    step = 1;
  switch (units) {
    case '%':
      step = 1;
      min = 0;
      max = 100;
      break;
    case 'л/г':
      step = 0.01;
      min = 0.0;
      max = 50;
      break;
    case '°C':
      step = 2;
      min = 0;
      max = 120;
      break;
    case ' °C': //гістерезис
      step = 0.1;
      min = 0.1;
      max = 2;
      break;
    case '°C ': //зміна температури в налаштуваннях
      step = 0.1;
      min = -20;
      max = 100;
      break;
    case 'хв':
      step = 1;
      min = 1;
      max = Number.MAX_VALUE;
      break;
    case 'Вт':
      step = 100;
      min = 0;
      max = 12000;
      break;
    default:
      step = 1;
      min = 0;
      max = 100;
      break;
  }

  const [count, setCount] = useState(value);

  const handleIncrement = () => {
    if (count < max) {
      setCount((prevCount) => prevCount + step);
      onChange && onChange({ value: count + step });
    }
  };

  const handleDecrement = () => {
    if (count > min) {
      setCount((prevCount) => prevCount - step);
      onChange && onChange({ value: count - step });
    }
  };

  const handleInputChange = (e: any) => {
    setCount(e.value);
    onChange && onChange({ value: e.value });
  };

  useEffect(() => {
    setCount(value);
  }, [value]);

  return (
    <div className="flex flex-column justify-content-center  align-items-center">
      <p className="custom-label" onClick={handleLabelClick} style={{ cursor: 'pointer' }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-3 justify-content-center align-items-center">
        <Button icon="pi pi-minus" className="custom-button" onClick={handleDecrement} disabled={disabled}/>
        <div className="custom-input flex justify-content-center align-items-center">
           <InputNumber suffix={units} value={count} onChange={handleInputChange} min={min} max={max} step={step} mode="decimal" minFractionDigits={0} maxFractionDigits={2} disabled={disabled}/>        
        </div>
        <Button icon="pi pi-plus" className="custom-button right-b" onClick={handleIncrement} disabled={disabled}/>
      </div>
      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} style={{ width: '500px' }}>
        <p>{help}</p>
      </Dialog>
    </div>
  );
};

type CounterProps3 = {
  value: number;
  true_value: number;
  units: string;
  label: string;
  help: string;
  disabled?: boolean;
  onChange?: (e: { value: number }) => void;
};

export const ACCounterSpeed: React.FC<CounterProps3> = ({ value, true_value, units, label, help, onChange, disabled = false }) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleLabelClick = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  let min = 0.0,
    max = 100,
    step = 1;

  const [count, setCount] = useState(value);
  const [t_count, setT_count] = useState(true_value);

  const handleIncrement = () => {
    if (t_count < max) {
      const newTCount = t_count + step;
      setT_count(newTCount);
      onChange && onChange({ value: newTCount });
    }
  };

  const handleDecrement = () => {
    if (t_count > min) {
      const newTCount = t_count - step;
      setT_count(newTCount);
      onChange && onChange({ value: newTCount });
    }
  };

  const handleInputChange = (e: any) => {
    setT_count(e.value);
    onChange && onChange({ value: e.value });
  };

  useEffect(() => {
    setCount(value);
  }, [value]);

  useEffect(() => {
    setT_count(true_value);
  }, [true_value]);

  return (
    <div className="flex flex-column justify-content-center  align-items-center">
      <p className="custom-label" onClick={handleLabelClick} style={{ cursor: 'pointer' }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-3 justify-content-center align-items-center">
        <Button icon="pi pi-minus" className="custom-button" onClick={handleDecrement} disabled={disabled}/>
        <div className="custom-input flex justify-content-center align-items-center">
          <InputNumber suffix={units} value={count} onChange={handleInputChange} min={min} max={max} step={step} mode="decimal" minFractionDigits={0} maxFractionDigits={2} disabled={disabled}/>
        </div>
        <Button icon="pi pi-plus" className="custom-button right-b" onClick={handleIncrement} disabled={disabled}/>
      </div>
      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} style={{ width: '500px' }}>
        <p>{help}</p>
      </Dialog>
    </div>
  );
};