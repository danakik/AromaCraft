import React, { useEffect, useState } from 'react';
import '../styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/regulators.css';
import { ACCounter } from './counter';
import { Dialog } from 'primereact/dialog';
import TenIcon from '../assets/icons/ten_icon';
import PidIcon from '../assets/icons/pid_icon';
import WaterIcon from '../assets/icons/water_icon';
import SelectValveIcon from '../assets/icons/selection_valve_icon';
import ValveHeadsIcon from '../assets/icons/valve_heads_icon';
import ValveTailsIcon from '../assets/icons/valve_tails_icon';
import TempIcon from '../assets/icons/temperature_icon';
import TimeIcon from '../assets/icons/time_icon';
import SpeedIcon from '../assets/icons/speed_icon';
import ListIcon from '../assets/icons/list_icon';
import TimerIcon from '../assets/icons/timer_icon';
import TempMIcon from '../assets/icons/temp_minus_icon';
import TempPIcon from '../assets/icons/temp_plus_icon';
import SortIcon from '../assets/icons/sort_icon';
import ArrowCurveIcon from '../assets/icons/arrow_curve_icon';
import ArrowForkIcon from '../assets/icons/arrow_fork_icon';
import ABarsIcon from '../assets/icons/antena_bars_icon';
import BreakdownIcon from '../assets/icons/breakdown_icon';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

type RegulatorProps1 = {
  icon: string;
  color?: string; // icon color
  label: string;
  value?: number; //if value not mentioned counter won`t be added
  units?: string; //if units not mentioned counter won`t be added
  help?: string; // hint text in the dialog
  onChange?: (e: { value: number }) => void;
  disabled?: boolean;
  hint?: string; // additional hint for units
};

const getIcon = (icon: string) => {
  switch (icon) {
    case 'ten':
      return TenIcon;
    case 'pid':
      return PidIcon;
    case 'water':
      return WaterIcon;
    case 'select_valve':
      return SelectValveIcon;
    case 'valve_heads':
      return ValveHeadsIcon;
    case 'valve_tails':
      return ValveTailsIcon;
    case 'temp':
      return TempIcon;
    case 'time':
      return TimeIcon;
    case 'speed':
      return SpeedIcon;
    case 'list':
      return ListIcon;
    case 'timer':
      return TimerIcon;
    case 'temp_minus':
      return TempMIcon;
    case 'temp_plus':
      return TempPIcon;
    case 'sort':
      return SortIcon;
    case 'arrow_curve':
      return ArrowCurveIcon;
    case 'arrow_fork':
      return ArrowForkIcon;
    case 'antena_bars':
      return ABarsIcon;
    case 'breakdown':
      return BreakdownIcon;
    default:
      return null;
  }
};

const getColor = (color: string) => {
  switch (color) {
    case 'orange':
      return '#E7764A';
    case 'purple':
      return '#6749AE';
    default:
      return 'white';
  }
};

export const ACRegulator: React.FC<RegulatorProps1> = ({
  icon,
  color = 'white',
  label,
  value = null,
  units,
  help = '',
  onChange,
  disabled = false,
  hint,
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleClick = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  let IconComponent = getIcon(icon);
  let iconColor = getColor(color);

  return (
    <div className="ac-regulator">
      <div className="ac-left-content">
        {IconComponent && (
          <IconComponent className="icon" color={iconColor} style={{ cursor: 'pointer' }} onClick={handleClick} />
        )}
        <span className="reg-label" onClick={handleClick} style={{ cursor: 'pointer' }}>
          {label}
        </span>
      </div>
      <div className="ac-right-content">
        {units != null && (
          <ACCounter value={value ?? 0} units={units} onChange={onChange} disabled={disabled} hint={hint} />
        )}
      </div>
      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} className="dialog">
        <p>{help}</p>
      </Dialog>
    </div>
  );
};

const getUnit = (units: string, hint?: string) => {
  let min, max, step;

  switch (hint) {
    case 'speed_step1_max100':
      min = 1;
      max = 100;
      step = 1;
      break;
    case 'speed_step0.5_max100':
      min = 1;
      max = 100;
      step = 0.5;
      break;
    case 'speed_step0.5_max100_min0':
      min = 0;
      max = 100;
      step = 0.5;
      break;
  }

  return { min, max, step };
};

type RegulatorProps2 = {
  value: number;
  true_value: number;
  units: string;
  label: string;
  help: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
  onChange?: (e: { value: number }) => void;
  readonly?: boolean;
  hint?: string;
};

export const ACRegulatorSpeed: React.FC<RegulatorProps2> = ({
  value,
  true_value,
  units,
  label,
  help,
  icon = '',
  color = 'white',
  onChange,
  disabled = false,
  hint,
  readonly = false,
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [count, setCount] = useState(value);
  const [t_count, setT_count] = useState(true_value);

  const handleLabelClick = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  let min = getUnit(units, hint).min;
  let max = getUnit(units, hint).max;
  let step = getUnit(units, hint).step;

  const handleIncrement = () => {
    if (t_count < 100) {
      const newTCount = t_count + 1;
      setT_count(newTCount);
      onChange?.({ value: newTCount });
    }
  };

  const handleDecrement = () => {
    if (t_count > 0) {
      const newTCount = t_count - 1;
      setT_count(newTCount);
      onChange?.({ value: newTCount });
    }
  };

  const handleInputChange = (e: any) => {
    setT_count(e.value);
    onChange?.({ value: e.value });
  };

  useEffect(() => setCount(value), [value]);
  useEffect(() => setT_count(true_value), [true_value]);

  let IconComponent = getIcon(icon);
  let iconColor = getColor(color);

  return (
    <div className="ac-regulator">
      <div className="ac-left-content">
        {IconComponent && (
          <IconComponent className="icon" color={iconColor} style={{ cursor: 'pointer' }} onClick={handleLabelClick} />
        )}
        <p className="reg-label" onClick={handleLabelClick} style={{ cursor: 'pointer' }}>
          {label}
        </p>
      </div>
      <div className="ac-right-content">
        <div className="flex flex-wrap gap-3 justify-content-center align-items-center flex flex-vertical-center">
          <Button icon="pi pi-minus" className="custom-button" onClick={handleDecrement} disabled={disabled} />
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
              readOnly={readonly}
            />
          </div>
          <Button icon="pi pi-plus" className="custom-button right-b" onClick={handleIncrement} disabled={disabled} />
        </div>
      </div>
      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} className="dialog">
        <p>{help}</p>
      </Dialog>
    </div>
  );
};
