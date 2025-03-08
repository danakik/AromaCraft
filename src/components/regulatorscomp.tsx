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
  color?: string;
  label: string;
  value?: number;
  units?: string;
  help?: string;
  onChange?: (e: { value: number }) => void;
  disabled?: boolean;
  hint?: string;
};

export const ACRegulator: React.FC<RegulatorProps1> = ({
  icon,
  color,
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

  let IconComponent;
  switch (icon) {
    case 'ten':
      IconComponent = TenIcon;
      break;
    case 'pid':
      IconComponent = PidIcon;
      break;
    case 'water':
      IconComponent = WaterIcon;
      break;
    case 'select_valve':
      IconComponent = SelectValveIcon;
      break;
    case 'valve_heads':
      IconComponent = ValveHeadsIcon;
      break;
    case 'valve_tails':
      IconComponent = ValveTailsIcon;
      break;
    case 'temp':
      IconComponent = TempIcon;
      break;
    case 'time':
      IconComponent = TimeIcon;
      break;
    case 'speed':
      IconComponent = SpeedIcon;
      break;
    case 'list':
      IconComponent = ListIcon;
      break;
    case 'timer':
      IconComponent = TimerIcon;
      break;
    case 'temp_minus':
      IconComponent = TempMIcon;
      break;
    case 'temp_plus':
      IconComponent = TempPIcon;
      break;
    case 'sort':
      IconComponent = SortIcon;
      break;
    case 'arrow_curve':
      IconComponent = ArrowCurveIcon;
      break;
    case 'arrow_fork':
      IconComponent = ArrowForkIcon;
      break;
    case 'antena_bars':
      IconComponent = ABarsIcon;
      break;
    case 'breakdown':
      IconComponent = BreakdownIcon;
      break;
    default:
      IconComponent = null;
  }

  let iconColor;
  switch (color) {
    case 'orange':
      iconColor = '#E7764A';
      break;
    case 'purple':
      iconColor = '#6749AE';
      break;
    default:
      iconColor = 'white';
      break;
  }

  return (
    <div className="ac-regulator">
      <div className="ac-left-content">
        {IconComponent && (
          <IconComponent className="icon" color={iconColor} onClick={handleClick} style={{ cursor: 'pointer' }} />
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
      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} style={{ width: '500px' }}>
        <p>{help}</p>
      </Dialog>
    </div>
  );
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
};

export const ACRegulatorSpeed: React.FC<RegulatorProps2> = ({
  value,
  true_value,
  units,
  label,
  help,
  icon,
  color = 'white',
  onChange,
  disabled = false,
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [count, setCount] = useState(value);
  const [t_count, setT_count] = useState(true_value);

  const handleLabelClick = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

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

  let IconComponent;
  switch (icon) {
    case 'speed':
      IconComponent = SpeedIcon;
      break;
    case 'temp':
      IconComponent = TempIcon;
      break;
    case 'time':
      IconComponent = TimeIcon;
      break;
    case 'ten':
      IconComponent = TenIcon;
      break;
    default:
      IconComponent = null;
  }

  return (
    <div className="ac-regulator">
      <div className="ac-left-content">
        {IconComponent && <IconComponent style={{ color, cursor: 'pointer' }} onClick={handleLabelClick} />}
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
              min={0}
              max={100}
              step={1}
              mode="decimal"
              minFractionDigits={0}
              maxFractionDigits={2}
              disabled={disabled}
            />
          </div>
          <Button icon="pi pi-plus" className="custom-button right-b" onClick={handleIncrement} disabled={disabled} />
        </div>
      </div>
      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} style={{ width: '500px' }}>
        <p>{help}</p>
      </Dialog>
    </div>
  );
};
