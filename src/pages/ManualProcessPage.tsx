import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as yup from 'yup';
import { ACBlockTemp } from '../components/blocktemp';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACKnob } from '../components/knob';
import { ACCounterSpeed } from '../components/counter';
import { ACRegulator } from '../components/regulatorscomp';
import { ACSwitch } from '../components/switch';
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { useForm, Controller } from 'react-hook-form';
import { calculateHandPercent } from '../utils/calculate';
import { useSaveHandMutation } from '../api/manualSave';
import { debounce } from 'lodash';

type FormData = {
  tempSelect: number;
  handPercent: {
    value: number;
    true_value: number;
  };
  handTempGyst: number;
  handSpeedTail: {
    value: number;
    true_value: number;
  };
  handTen: boolean;
  handPower: number;
  handPin1: number;
  handPin2: boolean;
  handK1: boolean;
  handK2: boolean;
  handK3: boolean;
  handK4: boolean;
  handWoterError: boolean;
  handLevelError: boolean;
  handTempWoterError: number;
  handTempCubeError: number;
};

const ManualProcessPage = () => {
  const key = localStorage.getItem('samogonKey');
  const [isFormChanging, setIsFormChanging] = useState(false);
  const [save] = useSaveHandMutation();
  const dataSamagon = useMemo(() => {
    return {
      key: key,
    };
  }, [key]);

  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(dataSamagon, { pollingInterval: isFormChanging ? 0 : SYNC_INTERVAL });
  
  const schema = yup.object().shape({
    tempSelect: yup.number().max(120, 'Максимальне значення 120').min(0, 'Мінімальне значення 0'),
    handPercent: yup.number().max(6, 'Максимальне значення 6').min(0.06, 'Мінімальне значення 0.06'),
    handTempGyst: yup.number().max(101, 'Максимальне значення 101').min(0.1, 'Мінімальне значення 0.1'),
    handSpeedTail: yup.number().max(6, 'Максимальне значення 6').min(0.06, 'Мінімальне значення 0.06'),
    handPower: yup.number().max(100, 'Максимальне значення 100').min(1, 'Мінімальне значення 1'),
    handPin1: yup.number().max(101, 'Максимальне значення 101').min(1, 'Мінімальне значення 1'),
    handTempWoterError: yup.number().max(120, 'Максимальне значення 120').min(1, 'Мінімальне значення 1'),
    handTempCubeError: yup.number().max(120, 'Максимальне значення 120').min(1, 'Мінімальне значення 1'),
  });

  const { control, watch } = useForm<FormData>({
    values: {
      tempSelect: data.handTempSelect,
      handPercent: {
        value: calculateHandPercent(data.handPercent, data.selectionSpeed, data.version, data.selection),
        true_value: data.handPercent,
      },
      handTempGyst: data.handTempGyst,
      handSpeedTail: {
        value: calculateHandPercent(data.handSpeedTail, data.selectionSpeed, data.version, data.selection),
        true_value: data.handSpeedTail,
      },
      handTen: !!data.handTen,
      handPower: data.handPower,
      handPin1: data.handPin1,
      handPin2: !!data.handPin2,
      handK1: !!data.handK1,
      handK2: !!data.handK2,
      handK3: !!data.handK3,
      handK4: !!data.handK4,
      handWoterError: !!data.handWoterError,
      handLevelError: !!data.handLevelError,
      handTempWoterError: data.handTempWoterError,
      handTempCubeError: data.handTempCubeError,
    },
  });

  const formatFormData = (formValues: FormData) => {
    return {
      key: key,
      h:
        (formValues.handTen ? 1 : 0) +
        (formValues.handK1 ? 1 : 0) +
        (formValues.handK2 ? 1 : 0) +
        (formValues.handK3 ? 1 : 0),
      op: formValues.handTen ? 1 : 0,
      k1: formValues.handK1 ? 1 : 0,
      k2: formValues.handK2 ? 1 : 0,
      k3: formValues.handK3 ? 1 : 0,
      ow: formValues.handWoterError ? 1 : 0,
      ol: formValues.handLevelError ? 1 : 0,
      p: formValues.handPower,
      w: formValues.handTempWoterError,
      c: formValues.handTempCubeError,
      to: formValues.tempSelect,
      go: formValues.handTempGyst,
      so: formValues.handPercent.true_value,
      pi: formValues.handPin1,
      po: formValues.handPin2 ? 1 : 0,
      k4: formValues.handK4 ? 1 : 0,
      sT: formValues.handSpeedTail.true_value,
    };
  };

  const formValues = watch();
  const prevFormValues = useRef(formValues);

  useEffect(() => {
    if (JSON.stringify(formValues) !== JSON.stringify(prevFormValues.current)) {
      setIsFormChanging(true);
      prevFormValues.current = formValues;
    }

    const debouncedLog = debounce(() => {
      const formattedData = formatFormData(formValues);
      /* console.log(formattedData);
      save(formattedData); 
      protection against children */

      setIsFormChanging(false);
    }, 5000);

    if (isFormChanging) {
      debouncedLog();
    }

    return () => {
      debouncedLog.cancel();
    };
  }, [formValues, isFormChanging]);

  const [symbol, setSymbol] = useState('');
  const [disabledK4, setDisabledK4] = useState(false);
  const [disabledPID, setDisabledKPID] = useState(false);
  useEffect(() => {
    if (data.version !== 0) {
      if (data.version >= 2.3 && data.version < 4) {
        setDisabledK4(true);
      } else if (data.version < 2.3) {
        setDisabledKPID(true);
        setDisabledK4(true);
      }

      if (data.selection === 0 && (data.version >= 4.42 || (data.version >= 3.42 && data.version < 4))) {
        setSymbol('%');
      } else if (data.selection === 1 && data.version >= 2.5) {
        setSymbol('л/г');
      }
    }
  }, [data]);

  if (isLoading || data.version === 0) return <p>Завантаження...</p>;
  if (error) return <p>Помилка у завантаженні даних.</p>;

  return (
    <>
      <header className="mb-1">
        <div style={{ float: 'right' }}>
          <ACUserComp serial_number={key || ''} />
        </div>
        <div style={{ float: 'left' }}>
          <ACStatusComp status_text={'Очікування...'} />
        </div>
      </header>
      <div className="flex flex-row gap-2 w-full align-items-start justify-content-start">
        <div className="flex flex-column w-3/4 ">
          <div className="grid grid-cols-2 w-full">
            <div className="col-6">
              <ACBlockTemp name="Куб" color="purple" temp={String(data.tempCube)} help={helpM.temp_cube_m} />
            </div>
            <div className="col-6">
              <ACBlockTemp name="Царга" color="orange" temp={String(data.tempCargi)} help={helpM.temp_cargi_m} />
            </div>
            <div className="col-6">
              <ACBlockTemp name="Дефлегматор" color="red" temp={String(data.tempDef)} help={helpM.temp_defl_m} />
            </div>
            <div className="col-6">
              <ACBlockTemp name="Вода" color="blue" temp={String(data.tempWater)} help={helpM.temp_water_m} />
            </div>
          </div>

          <div className="flex flex-row gap-3 p-2 w-full -mt-2 justify-content-between align-items-stretch">
            <div className="block p-2 flex-1 col-6 h-full">
              <div className="flex flex-column align-items-center justify-content-center">
                <Controller
                  name="tempSelect"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACKnob
                      label="Температура відбору"
                      color="orange"
                      initialValue={value}
                      help={helpM.temp_selection_m}
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
                 <Controller
                  name="handPercent"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACCounterSpeed
                      value={value.value}
                      true_value={value.true_value}
                      units={symbol}
                      label="Швидкість відбору"
                      help={helpM.speed_selection_m}
                      onChange={(e) => {
                        const updatedValue = calculateHandPercent(
                          e.value,
                          data.selectionSpeed,
                          data.version,
                          data.selection,
                        );
                        onChangeForm({
                          value: updatedValue,
                          true_value: e.value,
                        });
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="block p-2 flex-1 col-6 h-full">
              <div className="flex flex-column align-items-center justify-content-center">
                <Controller
                  name="handTempGyst"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACKnob
                      label="Гістерезис відбору"
                      color="blue"
                      initialValue={value}
                      help="helpM.gist_selection_m"
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
                 <Controller
                  name="handSpeedTail"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACCounterSpeed
                      value={value.value}
                      true_value={value.true_value}
                      units={symbol}
                      label="Швидкість відб. хвостів"
                      help={helpM.speed_selection_tails_m}
                      disabled={disabledK4}
                      onChange={(e) => {
                        const updatedValue = calculateHandPercent(
                          e.value,
                          data.selectionSpeed,
                          data.version,
                          data.selection,
                        );
                        onChangeForm({
                          value: updatedValue,
                          true_value: e.value,
                        });
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-column gap-3 w-1/4 align-items-start justify-content-start">
          <div className="block p-3  w-full">
            <h3>Нагрівач/Регулятор</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <Controller
                name="handPower"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label="Електронагрівач (ТЕН)"
                    value={value}
                    units="%"
                    help={helpM.ten_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
              <Controller
                name="handTen"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <Controller
                name="handPin1"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="pid"
                    label="ПІД-регулятор"
                    value={value}
                    units="°C"
                    help={helpM.pid_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />

              <Controller
                name="handPin2"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} disabled={disabledPID} />
                )}
              />
            </div>
          </div>
          <div className="block p-3  w-full">
            <h3>Механізми/Клапани</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="water" label="Подача води" help={helpM.water_m} />
              <Controller
                name="handK1"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="select_valve" label="Клапан відбору" help={helpM.selection_m} />
              <Controller
                name="handK2"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="valve_heads" label="Клапан голів" help={helpM.heads_m} />
              <Controller
                name="handK3"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="valve_tails" label="Клапан хвостів" help={helpM.tails_m} />
              <Controller
                name="handK4"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} disabled={disabledK4} />
                )}
              />
            </div>
          </div>
          <div className="block p-3  w-full">
            <h3>Аварії</h3>
            <div className="flex flex-row align-items-start  justify-content-start w-full gap-2">
              <Controller
                name="handTempWoterError"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="breakdown"
                    color="white"
                    label="Аварія води"
                    value={value}
                    units="°C"
                    help={helpM.water_break_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
              <Controller
                name="handWoterError"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="handTempCubeError"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="breakdown"
                    color="purple"
                    label="Аварія куб"
                    value={value}
                    units="°C"
                    help={helpM.cube_break_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start  justify-content-start  w-full gap-2">
              <ACRegulator icon="breakdown" color="orange" label="Аварія рівень" help={helpM.level_break_m} />
              <Controller
                name="handLevelError"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManualProcessPage;
