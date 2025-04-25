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
  hint?: string; // additional hint for units
};

const getUnit = (units: string, hint?: string) => {
  let min, max, step;

  switch (units) {
    case '%':
      min = 0;
      max = 100;
      step = 1;
      break;
    case '°C':
      min = 0;
      max = 120;
      step = 2;
      break;
    case 'л/г':
    case 'L/g':
      min = 0.0;
      max = 6;
      step = 0.01;
      break;
    case 'хв':
    case 'm':
      min = 0;
      max = Number.MAX_VALUE;
      step = 1;
      break;
    case 'Вт':
    case 'W':
      min = 50;
      max = 12000;
      step = 50;
      break;
    default:
      min = 0;
      max = 100;
      step = 1;
      break;
  }

  switch (hint) {
    case 'pauses':
      min = 1;
      max = 10;
      step = 1;
      break;
    case 'hysteresis':
      min = 0.1;
      max = 2;
      step = 0.1;
      break;
    case 'calibration':
      min = -20;
      max = 100;
      step = 0.1;
      break;
    case 'cycles':
      min = 1;
      max = 100;
      step = 1;
      break;
    case 'time':
      min = 0;
      max = 600;
      step = 5;
      break;
    case 'temp_step1_max100':
      min = 0;
      max = 100;
      step = 1;
      break;
    case 'temp_step0.1_max120':
      min = 0;
      max = 120;
      step = 0.1;
      break;
    case 'temp_step0.1_max120_min0.1':
      min = 0.1;
      max = 120;
      step = 0.1;
      break;
    case 'temp_step0.1_max99.9':
      min = 0;
      max = 99.9;
      step = 0.1;
      break;
    case 'temp_step1_max120':
      min = 1;
      max = 120;
      step = 1;
      break;
    case 'temp_step0.5_max100':
      min = 0;
      max = 100;
      step = 0.5;
      break;
    case 'time_step1_max240':
      min = 1;
      max = 240;
      step = 1;
      break;
    case 'temp_step0.1_max10':
      min = 0.1;
      max = 10;
      step = 0.1;
      break;
    case 'speed_step0.1_max10':
      min = 0;
      max = 10;
      step = 0.1;
      break;
    case 'poewr_step0.1max120':
      min = 0.1;
      max = 120;
      step = 0.1;
      break;
    case 'power_step1_max100':
      min = 1;
      max = 100;
      step = 1;
      break;
    case 'percent_step1_max100':
      min = 1;
      max = 100;
      step = 1;
      break;
    case 'time_step5_max240':
      min = 5;
      max = 240;
      step = 5;
      break;
    case 'time_step5_max995':
      min = 5;
      max = 995;
      step = 5;
      break;
  }

  return { min, max, step };
};

export const ACCounter: React.FC<CounterProps> = ({ value, units, onChange, disabled = false, hint }) => {
  let min = getUnit(units, hint).min;
  let max = getUnit(units, hint).max;
  let step = getUnit(units, hint).step;

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
      <Button
        icon="pi pi-minus"
        className="custom-button"
        onClick={handleDecrement}
        disabled={disabled || count <= min}
      />
      <div className="custom-input">
        <InputNumber
          suffix={units}
          value={count}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          mode="decimal"
          minFractionDigits={0}
          maxFractionDigits={2}
          disabled={disabled}
        />
      </div>
      <Button
        icon="pi pi-plus"
        className="custom-button right-b"
        onClick={handleIncrement}
        disabled={disabled || count >= max}
      />
    </div>
  );
};

type CounterProps2 = {
  value: number;
  units: string;
  label: string;
  help: string; // hint text in the dialog
  onChange?: (e: { value: number }) => void;
  disabled?: boolean;
  hint?: string; // additional hint for units
};

export const ACCounterLabel: React.FC<CounterProps2> = ({
  value,
  units,
  label,
  help,
  onChange,
  disabled = false,
  hint,
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleLabelClick = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  let min = getUnit(units, hint).min;
  let max = getUnit(units, hint).max;
  let step = getUnit(units, hint).step;

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
        <Button
          icon="pi pi-minus"
          className="custom-button"
          onClick={handleDecrement}
          disabled={disabled || count <= min}
        />
        <div className="custom-input flex justify-content-center align-items-center">
          <InputNumber
            suffix={units}
            value={count}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            mode="decimal"
            minFractionDigits={0}
            maxFractionDigits={2}
            disabled={disabled}
          />
        </div>
        <Button
          icon="pi pi-plus"
          className="custom-button right-b"
          onClick={handleIncrement}
          disabled={disabled || count >= max}
        />
      </div>
      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} className="dialog">
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
  help: string; // hint text in the dialog
  disabled?: boolean;
  onChange?: (e: { value: number }) => void;
  hint?: string; // additional hint for units
  readonly?: boolean;
};

export const ACCounterSpeed: React.FC<CounterProps3> = ({
  value,
  true_value,
  units,
  label,
  help,
  onChange,
  disabled = false,
  hint,
  readonly = false,
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleLabelClick = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  let min = getUnit(units, hint).min;
  let max = getUnit(units, hint).max;
  let step = getUnit(units, hint).step;

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
        <Button icon="pi pi-minus" className="custom-button" onClick={handleDecrement} disabled={disabled} />
        <div className="custom-input flex justify-content-center align-items-center">
          <InputNumber
            suffix={units}
            value={count}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            mode="decimal"
            minFractionDigits={0}
            maxFractionDigits={2}
            disabled={disabled}
            readOnly={readonly}
          />
        </div>
        <Button icon="pi pi-plus" className="custom-button right-b" onClick={handleIncrement} disabled={disabled} />
      </div>
      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} className="dialog">
        <p>{help}</p>
      </Dialog>
    </div>
  );
};
