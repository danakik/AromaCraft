import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import * as yup from 'yup';
import { ACBlockTemp } from '../components/blocktemp';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACKnob } from '../components/knob';
import { ACCounterSpeed } from '../components/counter';
import { ACRegulator } from '../components/regulatorscomp';
import { ACSwitch } from '../components/switch';
import '../styles/process_page.css';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { useForm, Controller } from 'react-hook-form';
import { calculateHandPercent } from '../utils/calculate';
import { useSaveHandMutation } from '../api/manualSave';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

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
  handPid1: number;
  handPid2: boolean;
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

  const { t, i18n } = useTranslation();

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
      handPid1: data.handPid1,
      handPid2: !!data.handPid2,
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
      pi: formValues.handPid1,
      po: formValues.handPid2 ? 1 : 0,
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
      //console.log(formattedData);
      save(formattedData);
      //protection against children

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
        setSymbol(t('unit_liter_per_gram'));
      }
    }
  }, [data]);

  const [status, setStatus] = useState('');

  const statusUpdate = useCallback(() => {
    let updateStatus = '';
    switch (data.handController) {
      case 0:
        updateStatus = t('status_waiting');
        break;
      case 1:
        updateStatus = t('status_process');
        break;
      default:
        updateStatus = t('status_error_unknown');
        break;
    }

    switch (data.errorHand) {
      case 0:
        updateStatus += t('status_success');
        break;
      case 7:
        updateStatus = t('status_error_level');
        break;
      case 5:
        updateStatus = t('status_cube_overheat');
        break;
      case 6:
        updateStatus = t('status_water_overheat');
        break;
      default:
        updateStatus = t('status_error_unknown');
        break;
    }
    setStatus(updateStatus);
  }, [data.errorHand, data.handController]);

  useEffect(() => {
    statusUpdate();
  }, [statusUpdate, i18n.language]);

  if (isLoading || data.version === 0) return <p>{t('loading')}</p>;
  if (error) return <p>{t('loading_error_t')}</p>;

  return (
    <>
      <header className="mb-1">
        <div style={{ float: 'right' }}>
          <ACUserComp serial_number={key || ''} />
        </div>
        <div style={{ float: 'left' }}>
          <ACStatusComp status_text={status} />
        </div>
      </header>
      <div className="flex flex-row gap-2 w-full align-items-start justify-content-start">
        <div className="flex flex-column w-3/4 ">
          <div className="grid grid-cols-2 w-full">
            <div className="col-6">
              <ACBlockTemp name={t('cube')} color="purple" temp={String(data.tempCube)} help={t('help_temp_cube')} />
            </div>
            <div className="col-6">
              <ACBlockTemp name={t('carga')} color="orange" temp={String(data.tempCargi)} help={t('help_temp_cargi')} />
            </div>
            <div className="col-6">
              <ACBlockTemp name={t('defl')} color="red" temp={String(data.tempDef)} help={t('help_temp_defl')} />
            </div>
            <div className="col-6">
              <ACBlockTemp name={t('water')} color="blue" temp={String(data.tempWater)} help={t('help_temp_water')} />
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
                      label={t('process_manual_temp_selection')}
                      color="orange"
                      initialValue={value}
                      help={t('help_temp_selection')}
                      onChange={(e) => onChangeForm(e.value)}
                      hint="temp_step0.1_max120_min0.1"
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
                      hint="temp_step0.5_max100"
                      label={t('process_manual_speed_selection')}
                      help={t('help_speed_selection')}
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
                      label={t('process_manual_gist_selection')}
                      color="blue"
                      initialValue={value}
                      help={t('help_gist_selection')}
                      onChange={(e) => onChangeForm(e.value)}
                      hint="temp_step0.1_max120_min0.1"
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
                      hint="temp_step0.5_max100"
                      label={t('process_speed_selection_tails')}
                      help={t('help_speed_selection_tails')}
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
            <h3>{t('process_manual_reg_header')}</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <Controller
                name="handPower"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label={t('process_manual_heater')}
                    value={value}
                    units="%"
                    hint="temp_step1_max100"
                    help={t('help_ten')}
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
                name="handPid1"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="pid"
                    label={t('process_manual_pid')}
                    value={value}
                    units="°C"
                    hint="temp_step0.1_max120"
                    help={t('help_pid')}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />

              <Controller
                name="handPid2"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} disabled={disabledPID} />
                )}
              />
            </div>
          </div>
          <div className="block p-3  w-full">
            <h3>{t('process_manual_valve_header')}</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="water" label={t('process_manual_valve_water')} help={t('help_water')} />
              <Controller
                name="handK1"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="select_valve" label={t('process_manual_valve_selection')} help={t('help_selection')} />
              <Controller
                name="handK2"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="valve_heads" label={t('process_manual_valve_heads')} help={t('help_heads')} />
              <Controller
                name="handK3"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="valve_tails" label={t('process_manual_valve_tails')} help={t('help_tails')} />
              <Controller
                name="handK4"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} disabled={disabledK4} />
                )}
              />
            </div>
          </div>
          <div className="block p-3 w-full">
            <h3>{t('process_manual_breakdowns_header')}</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="handTempWoterError"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="breakdown"
                    color="white"
                    label={t('process_manual_break_water')}
                    value={value}
                    units="°C"
                    hint="temp_step0.1_max99.9"
                    help={t('help_water_break')}
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
                    label={t('process_manual_break_cube')}
                    value={value}
                    units="°C"
                    hint="temp_step1_max120"
                    help={t('help_cube_break')}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start  justify-content-start  w-full gap-2">
              <ACRegulator
                icon="breakdown"
                color="orange"
                label={t('process_manual_break_level')}
                help={t('help_level_break')}
              />
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
