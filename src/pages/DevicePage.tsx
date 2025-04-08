import React, { useState, useMemo, useEffect, useCallback } from 'react';
import KotelIcon from '../assets/icons/kotel_icon';
import NagrevIcon from '../assets/icons/nagrev_icon';
import IngredientIcon from '../assets/icons/ingredient_icon';
import HeatIcon from '../assets/icons/heat_icon';
import BorderIcon from '../assets/icons/nagrev_border_icon';
import BarIcon from '../assets/icons/bar_icon';
import VidbirIcon from '../assets/icons/vidbit_icon';
import WaterBarIcon from '../assets/icons/water_bar_icon';
import FridgeIcon from '../assets/icons/fridge_icon';
import KlapanIcon from '../assets/icons/klapan_icon';
import EllipseIcon from '../assets/icons/ellipse_icon';
import VectorIcon from '../assets/icons/vector_icon';
import DashedIcon from '../assets/icons/dashed_icon';
import SeparatorIcon from '../assets/icons/separator_icon';
import OutsideSeparatorIcon from '../assets/icons/separator_outside';
import UnderTextIcon from '../assets/icons/under_text_icon';
import ArrowUpIcon from '../assets/icons/arrow_up_icon';
import OutputIcon from '../assets/icons/output_icon';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetDataQuery } from '../api/samogonApi';
import { Dialog } from 'primereact/dialog';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { Button } from 'primereact/button';
import { useDisableLiProcess } from '../hooks/useDisableLiProcess';
import { useTranslation } from 'react-i18next';
import '../styles/styles.css';
import { set } from 'lodash';
import { useClearErrorMutation } from '../api/clearErrorApi';

const DevicePage = () => {
  const key = localStorage.getItem('samogonKey');
  const dataSamagon = useMemo(() => {
    return {
      key: key,
    };
  }, [key]);

  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(dataSamagon, { pollingInterval: SYNC_INTERVAL });

  useDisableLiProcess(data);
  const [errorClear] = useClearErrorMutation();

  const { t } = useTranslation();
  const [n, setN] = useState<number>(0);

  const createExplainingDiv = (
    color: string,
    temp: string,
    name: string,
    coord: { top: number; left: number },
    help: string,
  ) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const handleClick = () => {
      setDialogVisible(true);
    };

    const hideDialog = () => {
      setDialogVisible(false);
    };
    const formattedTemp = `${temp.toString().replace('.', ',')} °C`;
    const circleStyle = {
      width: '40.47px',
      height: '40.47px',
      borderRadius: '50%',
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    };
    return (
      <div
        style={{
          position: 'absolute',
          width: 193,
          height: 65.37,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...coord,
        }}
      >
        <div style={circleStyle}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ cursor: 'pointer' }}
            onClick={handleClick}
          >
            <path
              d="M16 2.66669C14.6317 2.66669 13.3157 3.1926 12.3242 4.13565C11.3328 5.0787 10.7417 6.36674 10.6733 7.73335L10.6666 8.00002L10.6653 16.9707L10.592 17.048C9.52542 18.2126 8.86325 19.6903 8.70398 21.2614L8.67598 21.6294L8.66665 22C8.66676 23.1771 8.95021 24.3368 9.49304 25.3812C10.0359 26.4256 10.8221 27.324 11.7854 28.0005C12.7486 28.677 13.8605 29.1117 15.0272 29.2678C16.1938 29.4239 17.3809 29.297 18.4882 28.8976C19.5954 28.4982 20.5902 27.8382 21.3886 26.9733C22.187 26.1084 22.7654 25.064 23.075 23.9284C23.3847 22.7928 23.4164 21.5993 23.1676 20.4489C22.9187 19.2985 22.3966 18.2248 21.6453 17.3187L21.4066 17.0454L21.3346 16.9694L21.3333 8.00002C21.3334 6.67848 20.8429 5.40396 19.9568 4.42351C19.0707 3.44305 17.8521 2.8265 16.5373 2.69335L16.2666 2.67335L16 2.66669ZM16 5.33335C16.6727 5.33314 17.3207 5.58723 17.814 6.04468C18.3074 6.50214 18.6095 7.12915 18.66 7.80002L18.6666 8.00002V18.124L19.1106 18.5214C19.8062 19.1434 20.2993 19.9596 20.5262 20.8647C20.7532 21.7698 20.7036 22.7221 20.384 23.5987C20.0643 24.4753 19.4891 25.236 18.7328 25.7825C17.9765 26.3289 17.0737 26.6361 16.141 26.6644C15.2084 26.6926 14.2886 26.4406 13.5006 25.9409C12.7126 25.4413 12.0925 24.7168 11.7203 23.8611C11.3482 23.0055 11.241 22.0579 11.4128 21.1407C11.5846 20.2236 12.0274 19.379 12.684 18.716L12.888 18.5227L13.332 18.1254L13.3333 8.00002C13.3333 7.29278 13.6143 6.6145 14.1144 6.1144C14.6145 5.61431 15.2927 5.33335 16 5.33335ZM16 10.6667C15.6464 10.6667 15.3072 10.8072 15.0572 11.0572C14.8071 11.3073 14.6666 11.6464 14.6666 12V18.944C13.9648 19.2503 13.3898 19.789 13.0384 20.4694C12.6869 21.1498 12.5805 21.9305 12.737 22.6801C12.8934 23.4298 13.3032 24.1027 13.8975 24.5857C14.4917 25.0687 15.2342 25.3324 16 25.3324C16.7658 25.3324 17.5082 25.0687 18.1025 24.5857C18.6967 24.1027 19.1065 23.4298 19.263 22.6801C19.4195 21.9305 19.313 21.1498 18.9616 20.4694C18.6102 19.789 18.0352 19.2503 17.3333 18.944V12C17.3333 11.6464 17.1928 11.3073 16.9428 11.0572C16.6927 10.8072 16.3536 10.6667 16 10.6667Z"
              fill="white"
            />
          </svg>
        </div>
        <div style={{ display: 'block', marginLeft: 7 }}>
          <p
            className="textBlockTemp"
            style={{
              width: 122.96,
              height: 31.91,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              fontSize: 28.02,
              fontWeight: 400,
            }}
          >
            {formattedTemp}
          </p>
          <p
            className="textBlockTemp"
            style={{
              width: 122.96,
              height: 22.57,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              fontSize: 15.56,
              fontWeight: 400,
            }}
          >
            {name}
          </p>
        </div>
        <Dialog header={name} visible={dialogVisible} onHide={hideDialog} className="dialog">
          <p>{help}</p>
        </Dialog>
      </div>
    );
  };
  //arrows
  const [arrows, setArrows] = useState<React.ReactNode>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setN((prev) => (prev < 3 ? prev + 1 : 0));

      const displayArrows = [false, false];

      if (data.power !== 0) {
        if (n === 1) displayArrows[0] = true;
        else if (n === 2) displayArrows[0] = displayArrows[1] = true;
        else displayArrows[1] = true;
      }

      setArrows(
        <>
          <ArrowUpIcon
            style={{
              position: 'absolute',
              top: 185,
              left: 530,
              display: displayArrows[0] ? 'block' : 'none',
            }}
          />
          <ArrowUpIcon
            style={{
              position: 'absolute',
              top: 246,
              left: 530,
              display: displayArrows[1] ? 'block' : 'none',
            }}
          />
        </>,
      );
    }, 750);

    return () => clearInterval(intervalId);
  }, [data, n]);

  useDisableLiProcess(data);

  //valves rotation
  const [rotation1, setRotation1] = useState('rotate(90deg)');
  const [rotation2, setRotation2] = useState('rotate(90deg)');
  const [rotation3, setRotation3] = useState('rotate(0deg)');
  const [rotation4, setRotation4] = useState('rotate(0deg)');

  const rotateKalpan1 = useCallback(() => {
    let rotation1 = 'rotate(90deg)';
    if (data.klapan1 === 0) {
      rotation1 = 'rotate(0deg)';
    }
    setRotation1(rotation1);
  }, [data.klapan1]);

  const rotateKalpan2 = useCallback(() => {
    let rotation2 = 'rotate(90deg)';
    if (
      data.klapan2 === 1 ||
      (data.handK2 === 1 &&
        data.handPercent > 0 &&
        (data.readyKlapan === 2 || data.version < 3.2 || data.version === 4.0 || data.version === 4.1)) ||
      (data.rectController === 3 &&
        (data.readyKlapan === 2 || data.version < 3.2 || data.version === 4.0 || data.version === 4.1)) ||
      (data.rectController === 4 &&
        data.accumulation > 0 &&
        (data.readyKlapan === 2 || (data.rectSwitchTail === 0 && data.readyKlapan === 0)))
    ) {
      rotation2 = 'rotate(0deg)';
    }
    setRotation2(rotation2);
  }, [
    data.klapan2,
    data.handK2,
    data.handPercent,
    data.readyKlapan,
    data.rectController,
    data.accumulation,
    data.rectSwitchTail,
    data.version,
  ]);

  const rotateKalpan3 = useCallback(() => {
    let rotation3 = 'rotate(90deg)';
    if (data.k3 === 0) {
      rotation3 = 'rotate(0deg)';
    }
    setRotation3(rotation3);
  }, [data.k3]);

  const rotateKalpan4 = useCallback(() => {
    if (data.version >= 4) {
      let rotation4 = 'rotate(0deg)';
      if (data.klapan4 === 1 || (data.rectController === 4 && data.tempCube >= data.rectCubeTail)) {
        rotation4 = 'rotate(90deg)';
      }
      setRotation4(rotation4);
    }
  }, [data.klapan4, data.rectController, data.tempCube, data.rectCubeTail, data.version]);

  useEffect(() => {
    rotateKalpan1();
    rotateKalpan2();
    rotateKalpan3();
    rotateKalpan4();
  }, [rotateKalpan1, rotateKalpan2, rotateKalpan3, rotateKalpan4]);

  const [t1cDisplay, setT1cDisplay] = useState('none');
  const [t1bDisplay, setT1bDisplay] = useState('none');
  const [t2bDisplay, setT2bDisplay] = useState('none');
  const [t4bDisplay, setT4bDisplay] = useState('none');
  const [t3bDisplay, setT3bDisplay] = useState('none');
  const [speedDisplay, setSpeedDisplay] = useState('none');
  const [cycleDisplay, setCycleDisplay] = useState('none');
  const [tailDisplay, setTailDisplay] = useState('none');
  const [timerDisplay, setTimerDisplay] = useState('none');
  const [buttonErrorDisplay, setButtonErrorDisplay] = useState('none');
  const [PIDDisplay, setPIDDisplay] = useState('none');

  const [t1cValue, setT1cValue] = useState('');
  const [t1bValue, setT1bValue] = useState('');
  const [t2bValue, setT2bValue] = useState('');
  const [t4bValue, setT4bValue] = useState('');
  const [t3bValue, setT3bValue] = useState('');
  const [speedValue, setSpeedValue] = useState('');
  const [tailValue, setTailValue] = useState('');
  const [timerValue, setTimerValue] = useState('');
  const [errorText, setErrorText] = useState('');
  const [PIDValues, setPIDValues] = useState('');

  const [speedSymbol, setSpeedSymbol] = useState('');
  const [tailSymbol, setTailSymbol] = useState('');

  const [updateStatus, setUpdateStatus] = useState('');

  const statusUpdate = useCallback(() => {
    setT1cDisplay('none');
    setT1bDisplay('none');
    setT4bDisplay('none');

    let status = '';
    let name = '';

    if (data.distController >= 1) {
      if (data.isProcessSuccess) {
        name = t('menu_process_distillation');
      } else {
        name = t('device_no_connection');
      }

      if (data.distController === 1) {
        status = t('status_acceleration');
      } else if (data.distController === 2) {
        if (data.distTimeBody > 0 || data.distCubeSwitch === 1) {
          if (data.distCubeSwitch === 1) {
            setT1bValue(data.distCubeHead.toFixed(1));
          } else {
            setT1bValue(data.distTempPower.toFixed(1));
          }

          if (data.k3 === 1) {
            status = t('status_selection_heads');
          } else {
            status = t('status_selection_body');
          }
        } else {
          status = t('status_selection');
        }
      } else if (data.distController === 3) {
        status = t('status_stop');
      } else {
        status = t('status_completed');
      }

      setT1cValue(data.distTempStop.toFixed(1));
      setT4bValue(data.distTempError.toFixed(1));

      setT1cDisplay('block');
      setT1bDisplay('block');
      setT4bDisplay('block');
    }
    if (data.rectController >= 1) {
      if (data.isProcessSuccess) {
        name = t('menu_process_rectification');
      } else {
        name = t('device_no_connection');
      }

      if (data.rectController === 1) {
        status = t('status_acceleration');
      } else if (data.rectController === 2) {
        status = t('status_pause') + (data.rectPause < 10 ? '0' : '') + data.rectPause;
      } else if (data.rectController === 3) {
        status = t('status_selection_heads');

        setT3bDisplay('block');
        if (data.transitBody === 1) {
          setT3bValue(data.rectTempTransit.toFixed(1));
        } else {
          setT3bValue(data.rectTempHead.toFixed(1));
        }

        if (data.version >= 2.3) {
          if (data.selection === 0 || data.version < 2.5) {
            setSpeedValue(`${data.rectPercentHead < 10 ? '0' : ''}${data.rectPercentHead}`);
            setSpeedSymbol('%');
          } else if (data.selection === 1 || data.version >= 2.5) {
            setSpeedValue((data.selectionSpeed * data.rectPercentHead * 0.05).toFixed(2));
            setSpeedSymbol(t('unit_liter_per_gram'));
          }
          setSpeedDisplay('block');
        } else {
          setSpeedValue(data.rectPercentHead.toString());
          setSpeedSymbol('%');
          setSpeedDisplay('block');
        }
      } else if (data.rectController === 4) {
        status = t('status_selection_body');

        setT3bDisplay('block');
        setSpeedDisplay('block');
        setT3bValue((data.rectTempHead + data.rectTempBody).toFixed(1));
        setCycleDisplay('block');

        if (data.version > 2.3) {
          if (data.selection === 0 || data.version < 2.5) {
            if (data.rectSwitchTail === 0 || (data.klapan4 === 0 && data.rectSwitchTail === 1)) {
              setSpeedValue(`${data.accumulation < 10 ? '0' : ''}${data.accumulation}`);
              setSpeedSymbol('%');
            } else {
              setSpeedValue('');
              setSpeedSymbol('');
            }
            if (data.rectSwitchTail === 0) {
              if (data.version > 4) {
                setTailValue(`${data.rectSpeedTail < 10 ? '0' : ''}${data.rectSpeedTail}`);
                setTailSymbol('%');
              } else {
                setTailValue(t('device_column'));
              }
            }
          } else if (data.selection === 1 && data.version >= 2.5) {
            if (data.rectSwitchTail === 0 || (data.klapan4 === 0 && data.rectSwitchTail === 1)) {
              setSpeedValue((data.selectionSpeed * data.accumulation * 0.05).toFixed(2));
              setSpeedSymbol(t('unit_liter_per_gram'));
            } else {
              setSpeedValue('');
              setSpeedSymbol('');
            }
            if (data.version > 4) {
              if (data.rectSwitchTail === 0) {
                setTailValue((data.selectionSpeed * data.rectSpeedTail * 0.05).toFixed(2));
                setTailSymbol(t('unit_liter_per_gram'));
              } else {
                setTailValue(t('device_column'));
              }
            }
          }
          setSpeedDisplay('block');
          setTailDisplay('block');
        } else {
          setSpeedValue(data.rectPercentBody.toString());
          setSpeedSymbol('%');
          setSpeedDisplay('block');
        }
      } else if (data.rectController === 5) {
        status = t('status_stop');
      } else {
        status = t('status_completed');
      }
      if (data.rectController < 4 || data.rectTempCarge === 0) {
        setT2bValue(data.rectTempPower.toFixed(1));
      } else {
        if (data.rectSwitchCarge === 0) {
          setT2bValue(data.rectTempCarge.toFixed(1));
        } else {
          setT2bValue(data.rectSelectCarge.toFixed(1));
        }
      }

      setT2bDisplay('block');
      setT1cDisplay('block');
      setT4bDisplay('block');
      if (data.rectController < 3 && data.rectController > 4) {
        setT3bDisplay('none');
      }
    }
    if (data.handController >= 1) {
      if (data.isProcessSuccess) {
        name = t('device_manual');
      } else {
        name = t('device_no_connection');
      }
    }
    if (data.mashingController >= 1) {
      if (data.isProcessSuccess) {
        name = t('menu_process_mashing');
      } else {
        name = t('device_no_connection');
      }
      if (data.mashingController <= 10) {
        const mashingTemps = [
          data.mashingTemp0,
          data.mashingTemp1,
          data.mashingTemp2,
          data.mashingTemp3,
          data.mashingTemp4,
          data.mashingTemp5,
          data.mashingTemp6,
          data.mashingTemp7,
          data.mashingTemp8,
          data.mashingTemp9,
        ];
        const temp = mashingTemps[data.mashingController - 1];

        status = `${t('status_pause_number')} ${data.mashingController} - ${temp}°`;
      } else if (data.mashingController === 11) {
        status = t('status_waiting_boiling');
      } else if (data.mashingController === 12) {
        status = `${t('status_boiling')} ${data.mashingHeatPower}% ${t('device_boiling_power')} ${data.mashingHeatTemp.toFixed(1)}°`;
      } else if (data.mashingController === 13) {
        status = t('status_waiting_cooling');
      } else if (data.mashingController === 14) {
        status = `${t('status_cooling')} ${data.mashingCoolTemp.toFixed(1)}°`;
      } else {
        status = t('status_completed');
      }
    }
    if (
      data.distController === 0 &&
      data.rectController === 0 &&
      data.handController === 0 &&
      data.mashingController === 0
    ) {
      if (data.isProcessSuccess) {
        name = t('device_ready');
      } else {
        name = t('device_no_connection');
      }
      setTimerDisplay('none');
    } else if (data.handController === 0 && data.mashingController === 0) {
      setTimerValue(
        `${data.jobHours < 10 ? `0${data.jobHours}` : data.jobHours}:${data.mashingVarkaMinute < 10 ? `0${data.mashingVarkaMinute}` : data.mashingVarkaMinute}`,
      );
      setTimerDisplay('block');
    } else if (data.mashingController > 0) {
      if (data.flagPause === 0) {
        setTimerDisplay('none');
      } else {
        setTimerValue(
          `${data.jobHours < 10 ? `0${data.jobHours}` : data.jobHours}:${data.mashingVarkaMinute < 10 ? `0${data.mashingVarkaMinute}` : data.mashingVarkaMinute}`,
        );
        setTimerDisplay('block');
      }
    } else if (data.handController > 0) {
      setTimerDisplay('none');
    }
    if (data.errorWork >= 3) {
      setButtonErrorDisplay('block');
    } else {
      setButtonErrorDisplay('none');
    }
    if (data.errorWork >= 3) {
      if (data.errorWork === 3) {
        status = `${t('device_alarm')} ${data.errorData}`;
      } else {
        status = `${t('device_alarm_fire')} ${data.errorData}`;
      }
    } else if (data.distError === 1 || data.rectError === 1 || data.errorMashing === 1) {
      status = t('status_error_cube');
    } else if (data.distError === 2 || data.rectError === 4) {
      status = t('status_error_water');
    } else if (data.distError === 3 || data.errorMashing === 7) {
      status = t('status_error_level');
    } else if (data.distError === 4 || data.rectError === 5) {
      status = t('status_error_heat');
    } else if (data.rectError === 2) {
      status = t('status_error_column');
    } else if (data.rectError === 3) {
      status = t('status_error_defl');
    } else if (data.errorHand === 5) {
      status = t('status_cube_overheat');
    } else if (data.errorHand === 6) {
      status = t('status_water_overheat');
    } else if (data.handController >= 1 && data.errorHand === 0) {
      status = t('device_in_process');
    } else if (
      data.distError === 0 &&
      data.rectError === 0 &&
      data.errorMashing === 0 &&
      data.errorHand === 0 &&
      data.distController === 0 &&
      data.rectController === 0 &&
      data.handController === 0 &&
      data.mashingController === 0
    ) {
      status = t('status_waiting');
    }
    if (data.version > 2.3 && data.handController > 0) {
      setPIDDisplay('block');
      if (data.handPid2 === 1) {
        setPIDValues(`${data.handPid2.toFixed(1)}°`);
      } else {
        setPIDValues(t('off'));
      }
    } else {
      setPIDDisplay('none');
    }

    setUpdateStatus(name + '. ' + status);
  }, [data]);

  useEffect(() => {
    statusUpdate();
  }, [statusUpdate]);

  const clickError = async () => {
    await errorClear({ key: key || '' });
  };

  return (
    <>
      <header className="mb-1">
        <div style={{ float: 'right' }}>
          <ACUserComp serial_number={key || ''} />
        </div>
        <div style={{ float: 'left' }}>
          <ACStatusComp status_text={updateStatus} />
        </div>
      </header>
      <div className="relative w-full h-full">
        <UnderTextIcon style={{ position: 'absolute', top: 140.5, left: 89 }} />
        <UnderTextIcon style={{ position: 'absolute', top: 123, left: 818, transform: 'scaleX(-1)' }} />
        <UnderTextIcon style={{ position: 'absolute', top: 309, left: 818, transform: 'scale(-1, -1)' }} />
        <UnderTextIcon style={{ position: 'absolute', top: 567, left: 844, transform: 'scale(-1, -1)' }} />

        {createExplainingDiv(
          '#2942e1',
          String(data.tempWater),
          t('water'),
          { top: 70, left: 84 },
          t('help_temp_water'),
        )}
        {createExplainingDiv('#e74a4a', String(data.tempDef), t('defl'), { top: 58, left: 816.5 }, t('help_temp_defl'))}
        {createExplainingDiv(
          '#e7764a',
          String(data.tempCargi),
          t('carga'),
          { top: 271, left: 827 },
          t('help_temp_cargi'),
        )}
        {createExplainingDiv('#9e4ae7', String(data.tempCube), t('cube'), { top: 529, left: 860 }, t('help_temp_cube'))}
        <p
          className="textBlockTemp"
          style={{
            position: 'absolute',
            top: 351,
            left: 368,
            width: 114,
            height: 52,
            fontSize: 21.06,
            fontWeight: 400,
          }}
        >
          {t('device_water_supply')}
        </p>
        <p
          className="textBlockTemp"
          style={{
            position: 'absolute',
            top: 41,
            left: 546,
            width: 73.06,
            height: 23,
            fontSize: 21.06,
            fontWeight: 400,
          }}
        >
          {t('device_selection')}
        </p>
        <p
          className="textBlockTemp"
          style={{
            position: 'absolute',
            top: 458,
            left: 368,
            width: 114,
            height: 52,
            fontSize: 21.06,
            fontWeight: 400,
          }}
        >
          {t('device_valve_head')}
        </p>

        <div
          style={{
            position: 'relative',
            width: 663,
            height: 644.47,
            top: 51,
            left: 188,
          }}
        >
          <KotelIcon style={{ position: 'absolute', top: 489.53 }} />
          <NagrevIcon style={{ position: 'absolute', top: 409.81, left: 408.69 }} />
          <IngredientIcon style={{ position: 'absolute', top: 473.81, left: 446.3 }} />
          <HeatIcon style={{ position: 'absolute', top: 606.3, left: 422.72 }} />
          <BorderIcon style={{ position: 'absolute', top: 465.95, left: 422.72 }} />
          <BarIcon style={{ position: 'absolute', top: 0, left: 490 }} />
          <VidbirIcon style={{ position: 'absolute', top: 42.67, left: 326.73 }} />
          <WaterBarIcon style={{ position: 'absolute', top: 42.67, left: 52.3 }} />
          <FridgeIcon style={{ position: 'absolute', top: 273.936, left: 51.65 }} />
          <OutputIcon style={{ position: 'absolute', top: 540, left: -4 }} />
          <KlapanIcon style={{ position: 'absolute', top: 426.66, left: 56.14, transform: rotation3 }} id="k3_heads" />
          <KlapanIcon
            color="black"
            style={{ position: 'absolute', top: 318.87, left: 56.14, transform: rotation1 }}
            id="k1_watersupply"
          />
          <EllipseIcon color="white" fill="black" style={{ position: 'absolute', top: 421.22, left: 90.77 }} />
          <EllipseIcon color="black" fill="white" style={{ position: 'absolute', top: 313.08, left: 90.77 }} />
          <VectorIcon style={{ position: 'absolute', top: 357, left: 180 }} />
          <VectorIcon style={{ position: 'absolute', top: 463, left: 180 }} />
          <VectorIcon style={{ position: 'absolute', top: 19, left: 357 }} />
          <KlapanIcon
            width={83.09}
            height={14.6}
            color="black"
            id="k2_selection"
            style={{ position: 'absolute', top: 84.2, left: 354.5, transform: rotation2 }}
          />
          <EllipseIcon color="black" fill="white" style={{ position: 'absolute', top: 77.09, left: 383.6 }} />
          <DashedIcon style={{ position: 'absolute', top: 13.47, left: 462.58 }} />
          <OutsideSeparatorIcon style={{ position: 'absolute', top: 267.22, left: 24.7 }} />
          <OutsideSeparatorIcon style={{ position: 'absolute', top: 230.17, left: 454.72 }} />
          <OutsideSeparatorIcon style={{ position: 'absolute', top: 275.08, left: 454.72 }} />
          <OutsideSeparatorIcon style={{ position: 'absolute', top: 90, left: 242.48, transform: 'rotate(90deg)' }} />
          <SeparatorIcon style={{ position: 'absolute', top: 272.83, left: 51.65 }} />
          <SeparatorIcon style={{ position: 'absolute', top: 235.73, left: 488.41 }} width={95.44} />
          <SeparatorIcon style={{ position: 'absolute', top: 280.69, left: 488.41 }} width={95.44} />
          <SeparatorIcon
            style={{ position: 'absolute', top: 84, left: 273.39, transform: 'rotate(90deg)' }}
            width={95.44}
          />
          <KlapanIcon
            width={83.09}
            height={14.6}
            color="black"
            id="k4_tails"
            style={{
              position: 'absolute',
              top: 340,
              left: 496,
              transform: rotation4,
              display: data.version >= 4 ? 'block' : 'none',
            }}
          />
          <EllipseIcon
            color="black"
            fill="white"
            style={{ position: 'absolute', top: 333, left: 524, display: data.version >= 4 ? 'block' : 'none' }}
          />

          {arrows}

          <Button
            label={t('device_reset_button')}
            style={{
              width: '200px',
              background: 'linear-gradient(45deg, #b31827, #950a42)',
              position: 'absolute',
              top: -30,
              left: -160,
              display: buttonErrorDisplay,
            }}
            onClick={clickError}
          />
          <span id="cycle" style={{ position: 'absolute', top: -30, left: 515, display: cycleDisplay }}>
            {t('device_cycle') + ' ' + data.cycles}
          </span>
          <span id="timer" style={{ position: 'absolute', top: -30, left: 700, display: timerDisplay }}>
            {timerValue}
          </span>
          <span id="select_percent" style={{ position: 'absolute', top: 140, left: 400, display: speedDisplay }}>
            {speedValue + speedSymbol} {/* speed */}
          </span>
          <span id="temp" style={{ position: 'absolute', top: 110, left: -100, display: t4bDisplay }}>
            {t4bValue}° {/* t4b */}
          </span>

          <span id="temp" style={{ position: 'absolute', top: 25, left: 500, display: t3bDisplay }}>
            {t3bValue}° {/* t3b */}
          </span>
          <span id="temp" style={{ position: 'absolute', top: 200, left: 500, display: t2bDisplay }}>
            {t2bValue}° {/* t2b */}
          </span>

          <span
            id="baro_text"
            style={{ position: 'absolute', top: 200, left: 360, display: data.version >= 4 ? 'block' : 'none' }}
          >
            {t('device_barometer')}
          </span>
          <span
            id="baro"
            style={{ position: 'absolute', top: 220, left: 360, display: data.version >= 4 ? 'block' : 'none' }}
          >
            {data.settingBrometr >= 1 ? data.settingValueBrometr : ''}
            {data.settingBrometr >= 1 ? t('unit_mm') : t('off')}
          </span>
          <span
            id="tails_text"
            style={{ position: 'absolute', top: 300, left: 600, display: data.version >= 4 ? 'block' : 'none' }}
          >
            {t('device_tails')}
          </span>
          <span id="tails_percent" style={{ position: 'absolute', top: 320, left: 610, display: tailDisplay }}>
            {tailValue + tailSymbol} {/* tails */}
          </span>

          <span id="temp" style={{ position: 'absolute', top: 420, left: 440, display: t1cDisplay }}>
            {t1cValue}° {/* t1c */}
          </span>
          <span id="temp" style={{ position: 'absolute', top: 420, left: 600, display: t1bDisplay }}>
            {t1bValue}° {/* t1b */}
          </span>

          <span id="pid" style={{ position: 'absolute', top: 500, left: 350, display: PIDDisplay }}>
            {t('device_pid')}
          </span>
          <span id="pid_temp" style={{ position: 'absolute', top: 520, left: 355, display: PIDDisplay }}>
            {PIDValues}
          </span>
          <span
            id="pid_percent"
            style={{ position: 'absolute', top: 535, left: 355, display: data.power === 0 ? 'none' : 'block' }}
          >
            {data.power < 100 ? data.power + ' %' : 'MAX'}
          </span>
        </div>
      </div>
    </>
  );
};

export default DevicePage;
