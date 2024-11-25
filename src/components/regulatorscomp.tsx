import React, { useState } from 'react';
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
import SortIcon from '../assets/icons/sort_icon';
import ArrowCurveIcon from '../assets/icons/arrow_curve_icon';
import ArrowForkIcon from '../assets/icons/arrow_fork_icon';
import ABarsIcon from '../assets/icons/antena_bars_icon';
import BreakdownIcon from '../assets/icons/breakdown_icon';

type RegulatorProps = {
  icon: string;
  color?: string;
  label: string;
  value?: number;
  units?: string;
  help?: string;
  onChange?: (e: { value: number }) => void;
};

export const ACRegulator: React.FC<RegulatorProps> = ({ icon, color, label, value = null, units, help = '', onChange }) => {
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
        {units != null && value != null && <ACCounter value={value} units={units} onChange={onChange}/>}
      </div>
      <Dialog header={label} visible={dialogVisible} onHide={hideDialog} style={{ width: '500px' }}>
        <p>{help}</p>
      </Dialog>
    </div>
  );
};
