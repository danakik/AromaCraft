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

export const ACKnob: React.FC<KnobProps> = ({ label, initialValue, color, readonly = false, help = '', onChange }) => {
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
          min={0.1}
          max={120}
          step={0.1}
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
            min={0.1}
            max={120}
            step={0.1}
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

  return (
    <div className="card flex flex-column align-items-center justify-content-center">
      <Gradients />

      <div className="ac-slider-container pb-2">
        <Slider
          value={value}
          onChange={handleSliderChange}
          className={`unfilled custom-slider ${gradientClass}`}
          min={0}
          max={120}
          step={0.1}
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
            min={0}
            max={120}
            step={0.1}
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
