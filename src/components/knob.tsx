import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { Knob } from 'primereact/knob';
import { Dialog } from 'primereact/dialog';
import { Slider, SliderChangeEvent } from 'primereact/slider';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import Gradients from '../assets/knob_slider_gradients';
import '../styles/styles.css';
import '../styles/knob.css';

type KnobProps = {
  label: string;
  initialValue: number;
  color: 'orange' | 'blue' | 'purple' | 'red';
  readonly?: boolean;
  help?: string; // hint text in the dialog
  hint?: string; // hint for min, max, step
  onChange?: (e: { value: number | [number, number] }) => void;
};

const getGradientClass = (color: 'orange' | 'blue' | 'purple' | 'red'): string => {
  switch (color) {
    case 'orange':
      return 'url(#gradient1)';
    case 'blue':
      return 'url(#gradient2)';
    case 'purple':
      return 'url(#gradient3)';
    case 'red':
      return 'url(#gradient4)';
    default:
      return 'url(#gradient1)';
  }
};
const getGradientClassSlider = (color: 'orange' | 'blue' | 'purple' | 'red'): string => {
  switch (color) {
    case 'orange':
      return 'gradient1';
    case 'blue':
      return 'gradient2';
    case 'purple':
      return 'gradient3';
    case 'red':
      return 'gradient4';
    default:
      return 'gradient1';
  }
};
const getHint = (hint?: string) => {
  let min, max, step;

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
    case 'temp_step1_max100':
      min = 0;
      max = 100;
      step = 1;
      break;
    case 'temp_step0.1_max120': //rect 1, 3, 4 slider
      min = 0;
      max = 120;
      step = 0.1;
      break;
    case 'temp_step0.1_max120_min0.1': //rect 2 slider, manual 2 knob
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
      min = 0;
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
    case 'temp_step0.1_max10': // mashing
      min = 0.1;
      max = 10;
      step = 0.1;
      break;
    default:
      min = 0.1;
      max = 120;
      step = 0.1;
      break;
  }

  return { min, max, step };
};

export const ACKnob: React.FC<KnobProps> = ({ label, initialValue, color, readonly = false, help = '', hint='', onChange }) => {
  const [value, setValue] = useState<number>(initialValue);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const gradID = getGradientClass(color);

  const handleKnobChange = (e: { value: number }) => {
    setValue(e.value);
    if (onChange) onChange(e);
  };

  const handleInputNumberChange = (e: InputNumberValueChangeEvent) => {
    const newValue = e.value ?? 0;
    setValue(newValue);
    if (onChange) onChange({ value: newValue });
  };

  const handleLabelClick = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  let min = getHint(hint).min;
  let max = getHint(hint).max;
  let step = getHint(hint).step;

  return (
    <div className="card flex flex-column align-items-center justify-content-center pb-2">
      <Gradients />

      <div className="knob-container">
        <Knob
          value={value}
          onChange={handleKnobChange}
          className="custom-knob"
          valueColor={gradID}
          rangeColor="#999CA2"
          valueTemplate={`${value.toFixed(1)}°C`}
          min={min}
          max={max}
          step={step}
          size={200}
          readOnly={readonly}
        />
        <div className="knob-input">
          <InputNumber
            value={value}
            onValueChange={handleInputNumberChange}
            disabled={readonly}
            mode="decimal"
            minFractionDigits={1}
            maxFractionDigits={1}
            suffix="°C"
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>

      <span className="knob-label" onClick={handleLabelClick} style={{ cursor: 'pointer' }}>
        {label}
      </span>

      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} className='dialog'>
        <p>{help}</p>
      </Dialog>
    </div>
  );
};

export const ACSlider: React.FC<KnobProps> = ({
  label,
  initialValue,
  color,
  readonly = false,
  help = '',
  hint='',
  onChange,
}) => {
  const [value, setValue] = useState<number>(initialValue);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const gradientClass = getGradientClassSlider(color);

  const handleSliderChange = (e: SliderChangeEvent) => {
    const newValue = Array.isArray(e.value) ? e.value[0] : e.value;
    setValue(newValue);
    if (onChange) onChange({ value: newValue });
  };

  const handleInputNumberChange = (e: InputNumberValueChangeEvent) => {
    const newValue = e.value ?? 0;
    setValue(newValue);
    if (onChange) onChange({ value: newValue });
  };

  const handleLabelClick = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  let min = getHint(hint).min;
  let max = getHint(hint).max;
  let step = getHint(hint).step;

  return (
    <div className="card flex flex-column align-items-center justify-content-center">
      <Gradients />

      <div className="ac-slider-container pb-2">
        <Slider
          value={value}
          onChange={handleSliderChange}
          className={`unfilled custom-slider ${gradientClass}`}
          min={min}
          max={max}
          step={step}
          disabled={readonly}
        />
        <div className="slider-temp flex flex-row align-items-center justify-content-center">
          <InputNumber
            value={value}
            onValueChange={handleInputNumberChange}
            disabled={readonly}
            mode="decimal"
            minFractionDigits={1}
            maxFractionDigits={1}
            suffix="°C"
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>

      <span className="knob-label" onClick={handleLabelClick} style={{ cursor: 'pointer' }}>
        {label}
      </span>

      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} className='dialog'>
        <p>{help}</p>
      </Dialog>
    </div>
  );
};
