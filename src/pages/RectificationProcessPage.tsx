import React, { useEffect, useState, useMemo } from 'react';
import { ACBlockTempSmall } from '../components/blocktemp';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACScriptComp } from '../components/scriptcomp';
import { ACIconButton } from '../components/iconbutton';
import { ACSlider } from '../components/knob';
import { ACCounterLabel } from '../components/counter';
import { ACSwitch } from '../components/switch';
import { ACRegulator } from '../components/regulatorscomp';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import '../styles/process_page.css';
import 'primereact/resources/themes/lara-light-purple/theme.css';
import * as helpM from '../components/help_messages';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useForm, Controller } from 'react-hook-form';
import { calculateHandPercent } from '../utils/calculate';
import { debounce, values } from 'lodash';
import { useReedReceptsMutation } from '../api/receptsApi';

type FormData = {
  rectTempHead: number;
  rectPercentHead: {
    value: number;
    true_value: number;
  };
  rectTempBody: number;
  rectGystBody: number;
  rectCubeTail: number;
  rectSpeedTail: {
    value: number;
    true_value: number;
  };
  rectDecreaseSpeed: {
    value: number;
    true_value: number;
  };
  rectAcceleration: number;
  rectPower: number;
  rectPowerBody: number;
  rectPowerTail: number;
  rectGystHead: number;
  rectPercentBody: {
    value: number;
    true_value: number;
  };
  rectSpeedCarge: {
    value: number;
    true_value: number;
  };
  rectCyclesNumber: number;
  rectEndCycle: number;
  rectDecreaseCycle: {
    value: number;
    true_value: number;
  };
  rectTempPower: number;
  rectTempStop: number;
  rectTempError: number;
  rectTimeStab: number;
  rectDecreaseTemp: number;
  rectTimeBody: number;
  rectSelectCarge: number;
  rectSwitchTail: boolean;
  rectSwitchCube: boolean;
  rectSwitchCarge: boolean;
  rectTempTransit: number;
};

const RectificationProcessPage = () => {
  const key = localStorage.getItem('samogonKey');
  const [receptName, setReceptName] = useState('');
  const [receptNumber, setReceptNumber] = useState('');
  const [reedRecept] = useReedReceptsMutation();

  const pageRecept = () => {
    return {
      key: key,
      w: 2,
    };
  };

  const [listRecept, setListRecept] = useState([]);

  const fetchRecept = async () => {
    const respons = await reedRecept(pageRecept());
    setListRecept(respons.data);
  };

  useEffect(() => {
    fetchRecept();
  }, []);


  const pageReceptData = useMemo(() => {
    return {
      key: key,
      w: 2,
      r: receptNumber,
      n: receptName,
    };
  },[receptName, receptNumber]);


  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(pageReceptData, { pollingInterval: SYNC_INTERVAL });

  const handleScenarioChange = (label: string, value: string) => {
    setReceptName(label);
    setReceptNumber(value);
  };

  useEffect(() => {
    if (receptName !== '') {
      console.log(pageReceptData);
    }
  }, [receptName]);

  const { control, watch } = useForm<FormData>({
    values: {
      rectTempHead: data.rectTempHead,
      rectPercentHead: {
        value: calculateHandPercent(data.rectPercentHead, data.selectionSpeed, data.version, data.selection),
        true_value: data.rectPercentHead,
      },
      rectTempBody: data.rectTempBody,
      rectGystBody: data.rectGystBody,
      rectCubeTail: data.rectCubeTail,
      rectSpeedTail: {
        value: calculateHandPercent(data.rectSpeedTail, data.selectionSpeed, data.version, data.selection),
        true_value: data.rectSpeedTail,
      },
      rectDecreaseSpeed: {
        value: calculateHandPercent(data.rectDecreaseSpeed, data.selectionSpeed, data.version, data.selection),
        true_value: data.rectDecreaseSpeed,
      },
      rectAcceleration: data.rectAcceleration,
      rectPower: data.rectPower,
      rectPowerBody: data.rectPowerBody,
      rectPowerTail: data.rectPowerTail,
      rectGystHead: data.rectGystHead,
      rectPercentBody: {
        value: calculateHandPercent(data.rectPercentBody, data.selectionSpeed, data.version, data.selection),
        true_value: data.rectPercentBody,
      },
      rectSpeedCarge: {
        value: calculateHandPercent(data.rectSpeedCarge, data.selectionSpeed, data.version, data.selection),
        true_value: data.rectSpeedCarge,
      },
      rectCyclesNumber: data.rectCyclesNumber,
      rectEndCycle: data.rectEndCycle,
      rectDecreaseCycle: {
        value: calculateHandPercent(data.rectDecreaseCycle, data.selectionSpeed, data.version, data.selection),
        true_value: data.rectDecreaseCycle,
      },
      rectTempPower: data.rectTempPower,
      rectTempStop: data.rectTempStop,
      rectTempError: data.rectTempError,
      rectTimeStab: data.rectTimeStab,
      rectDecreaseTemp: data.rectDecreaseTemp,
      rectTimeBody: data.rectTimeBody,
      rectSelectCarge: data.rectSelectCarge,
      rectSwitchTail: !!data.rectSwitchTail,
      rectSwitchCube: !!data.rectSwitchCube,
      rectSwitchCarge: !!data.rectSwitchCarge,
      rectTempTransit: data.rectTempTransit,
    },
  });

  const [switchTail, setSwitchTail] = useState(true);
  const [speedTail, setSpeedTail] = useState(true);
  const [powerTail, setPowerTail] = useState(true);
  const [tempTail, setTempTail] = useState(true);
  const [endCycle, setEndCycle] = useState(true);
  const [tempSelectCarge, setSelectCarge] = useState(true);
  const [disabledTimeBody, setDisabledTimeBody] = useState(false);
  const [disabledCarge, setDisabledCarge] = useState(true);
  const hasTailSwitch = watch('rectSwitchTail');
  const hasCargeSwitch = watch('rectSwitchCarge');
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [symbol, setSymbol] = useState('');
  const [bodySymbol, setBodySymbol] = useState('');

  useEffect(() => {
    if (data.version !== 0) {

      if (data.version >= 4.2) {
        setSwitchTail(false);
        if (hasTailSwitch) {
          setSpeedTail(true);
          setPowerTail(false);
        } else {
          setSpeedTail(false);
          setPowerTail(true);
        }
      }

      if ((data.version >= 3.2 && data.version < 4) || data.version >= 4.2) {
        setDisabledCarge(false);
        setEndCycle(false);
        if (hasCargeSwitch) {
          setSelectCarge(false);
        } else {
          setSelectCarge(true);
        }
      }

      if (data.version >= 4 && !hasTailSwitch) {
        setSpeedTail(false);
      }

      if (data.version >= 4) {
        setTempTail(false);
      }

      if (data.transitBody == 0) {
        setDisabledTimeBody(true);
      } else if (data.transitBody == 1) {
        setDisabledTimeBody(false);
        setIsSwitchOn(true);
        setBodySymbol('хв');
      } else if (data.transitBody == 2) {
        setDisabledTimeBody(false);
        setIsSwitchOn(false);
        setBodySymbol('°C');
      }

      if (data.selection == 0 && (data.version >= 4.42 || (data.version >= 3.42 && data.version < 4))) {
        setSymbol('%');
      } else if (data.selection == 1 && data.version >= 2.5) {
        setSymbol('л/г');
      }
    }
  }, [data, hasTailSwitch, hasCargeSwitch]);


  const [dialogCreateVisible, setDialogCreateVisible] = useState(false);
  const [dialogRenameVisible, setDialogRenameVisible] = useState(false);
  const [dialogDeleteVisible, setDialogDeleteVisible] = useState(false);

  if (isLoading || data.version == 0) return <p>Завантаження...</p>; // из-за списка рецепта дольше загрузка страницы
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
        <div className="flex flex-column w-1/4">
          <div className="grid grid-cols-2 w-full">
            <div className="col-6">
              <ACBlockTempSmall name="Куб" color="purple" temp={String(data.tempCube)} help={helpM.temp_cube_m} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall name="Царга" color="orange" temp={String(data.tempCargi)} help={helpM.temp_cargi_m} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall name="Дефлегматор" color="red" temp={String(data.tempDef)} help={helpM.temp_defl_m} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall name="Вода" color="blue" temp={String(data.tempWater)} help={helpM.temp_water_m} />
            </div>
          </div>
          <div className="flex flex-column align-items-center justify-content-center w-full">
            <div className="grid grid-cols-2 w-full">
              <div className="col-6" style={{ minWidth: '200px' }}>
                <div className="flex flex-column align-items-center justify-content-center block p-2 pb-3">
                  <Controller
                    name="rectTempHead"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACSlider
                        label="Темп. відбору голів"
                        color="blue"
                        initialValue={value}
                        help={helpM.temp_selection_heads_m}
                        onChange={(e) => onChangeForm(e.value)}
                      />
                    )}
                  />
                  <Controller
                    name="rectGystHead"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACCounterLabel
                        units=" °C"
                        value={value}
                        label="Гістерезис відб. голів"
                        help={helpM.gist_selection_heads_m}
                        onChange={(e) => onChangeForm(e.value)}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="col-6" style={{ minWidth: '200px' }}>
                <div className="flex flex-column align-items-center justify-content-center block p-2 pb-3">
                  <Controller
                    name="rectTempBody"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACSlider
                        label="Темп.відбору тіла"
                        color="orange"
                        initialValue={value}
                        help={helpM.temp_selection_body_m}
                        onChange={(e) => onChangeForm(e.value)}
                      />
                    )}
                  />
                  <Controller
                    name="rectGystBody"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACCounterLabel
                        units=" °C"
                        value={value}
                        label="Гістерезис відб.тіла"
                        help={helpM.gist_selection_body_m}
                        onChange={(e) => onChangeForm(e.value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-6" style={{ minWidth: '200px' }}>
                <div className="flex flex-column align-items-center justify-content-center block p-2 pb-3">
                  <Controller
                    name="rectCubeTail"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACSlider
                        label="Темп.відб.хвостів"
                        color="red"
                        initialValue={value}
                        help={helpM.temp_selection_tails_m}
                        onChange={(e) => onChangeForm(e.value)}
                        readonly={tempTail}
                      />
                    )}
                  />
                  <Controller
                    name="rectSpeedTail"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACCounterLabel
                        units="л/г"
                        value={value.value}
                        label="Швидкість"
                        help={helpM.speed_selection_tails_m}
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
                        disabled={speedTail}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="col-6" style={{ minWidth: '200px' }}>
                <div className="flex flex-column align-items-center justify-content-center block p-2 pb-3">
                  <Controller
                    name="rectTempStop"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACSlider
                        color="purple"
                        label="Темп. зупинки"
                        initialValue={value}
                        help={helpM.temp_stop_m}
                        onChange={(e) => onChangeForm(e.value)}
                      />
                    )}
                  />
                  <Controller
                    name="rectTimeStab"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACCounterLabel
                        label="Стабілізація колони"
                        value={value}
                        units="хв"
                        help={helpM.stabilisation_column_m}
                        onChange={(e) => onChangeForm(e.value)}
                      />
                    )}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div
          className="flex flex-column gap-3 flex-grow align-items-start justify-content-start w-3/4 custom-scrollbar"
          style={{ maxHeight: '660px', overflowY: 'auto', width: '80%', borderRadius: '12px', paddingRight: '4px' }}
        >
          <div className="block p-3 w-full">
            <h3>Автоматика</h3>
            <div className="flex align-items-center justify-content-center">
              <ACScriptComp options={listRecept} onChange={handleScenarioChange} />
              <ACIconButton iconName="edit" onClick={() => setDialogRenameVisible(true)} />
              <ACIconButton iconName="doc_download" onClick={() => console.log('DocD clicked')} />
              <ACIconButton iconName="doc_add" onClick={() => setDialogCreateVisible(true)} />
              <ACIconButton iconName="delete" onClick={() => setDialogDeleteVisible(true)} />
            </div>
            <div className="flex align-items-center justify-content-center">
              <Button label="Пропуск" className="button-skip" />
              <Button label="Старт" className="button-start" />
            </div>
          </div>

          <div className="block p-3 w-full">
            <h3>Потужність</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectAcceleration"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label="Потужність розгону"
                    value={value}
                    units="%"
                    help={helpM.power_acceleration_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectPower"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label="Потужність відбору"
                    value={value}
                    units="%"
                    help={helpM.power_selection_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectPowerBody"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label="Потужн.відбору(тіло)"
                    value={value}
                    units="%"
                    help={helpM.power_selection_body_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectPowerTail"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label="Потужн.відбору(хвости)"
                    value={value}
                    units="%"
                    help={helpM.power_selection_tails_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={powerTail}
                  />
                )}
              />
            </div>
          </div>

          <div className="block p-3 w-full">
            <h3>Швидкість</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectPercentHead"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label="Шв.відбору(голів)"
                    value={value.value}
                    units={symbol}
                    help={helpM.speed_selection_heads_m}
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
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectPercentBody"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label="Шв.відбору(тіла)"
                    value={value.value}
                    units={symbol}
                    help={helpM.speed_selection_body_m}
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
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <Controller
                  name="rectSpeedCarge"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACRegulator
                      icon="speed"
                      color="red"
                      label="Зменш.шв.царзі"
                      value={value.value}
                      units={symbol}
                      help={helpM.decrease_speed_cargi_m}
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

                <Controller
                  name="rectSwitchCarge"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ToggleButton
                      className="custom-toggle-button"
                      checked={value}
                      onChange={(e) => onChangeForm(e.value)}
                      onLabel="ТЕМП"
                      offLabel="АВТО"
                      disabled={disabledCarge}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="block p-3 w-full">
            <h3>Цикли</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectCyclesNumber"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="list"
                    label="Кількість циклів"
                    value={value}
                    units=" "
                    help={helpM.cycles_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectEndCycle"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="timer"
                    label="Обмеження циклу"
                    value={value}
                    units="хв"
                    help={helpM.border_cycles_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={endCycle}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectDecreaseCycle"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="sort"
                    label="Зменшення по циклам"
                    value={value.value}
                    units={symbol}
                    help={helpM.decrease_cycles_m}
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

          <div className="block p-3 w-full">
            <h3>Інше</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectTempPower"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp"
                    color="white"
                    label="Темп. переходу"
                    value={value}
                    units="°C"
                    help={helpM.temp_transition_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectDecreaseTemp"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp"
                    label="Зменш.відбору tКУБ"
                    value={value}
                    units="°C"
                    help={helpM.decrease_selection_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectTempError"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp"
                    color="red"
                    label="Темп. аварії"
                    value={value}
                    units="°C"
                    help={helpM.temp_breakdown_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>

            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectSelectCarge"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp_minus"
                    label="Темп. зм. по царзі"
                    value={value}
                    units="°C"
                    help={helpM.temp_selection_cargi_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={tempSelectCarge}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <div className="flex flex-row align-items-center justify-content-center w-full">
                <ACRegulator icon="arrow_curve" label="Відбір хвостів" help={helpM.selection_tails_m} />
                <Controller
                  name="rectSwitchTail"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ToggleButton
                      className="custom-toggle-button"
                      checked={value}
                      onChange={(e) => onChangeForm(e.value)}
                      onLabel="КОЛОНА"
                      offLabel="ВУЗОЛ"
                      disabled={switchTail}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                key={bodySymbol}
                name={isSwitchOn ? 'rectTimeBody' : 'rectTempTransit'} //bag no symbol for first boot
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="arrow_fork"
                    label="Перехід на відбір тіла"
                    value={value}
                    units={bodySymbol}
                    help={helpM.transition_select_body_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={disabledTimeBody}
                  />
                )}
              />
            </div>

            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <Controller
                  name="rectDecreaseSpeed"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACRegulator
                      icon="speed"
                      units={symbol}
                      value={value.value}
                      label="Зменш.шв.відбору"
                      help={helpM.decrease_speed_selection_m}
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
                <Controller
                  name="rectSwitchCube"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ToggleButton
                      className="custom-toggle-button"
                      checked={value}
                      onChange={(e) => onChangeForm(e.value)}
                      onLabel="БАГАТ"
                      offLabel="ОДНОК"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog header={"Створити новий сценарій"} visible={dialogCreateVisible} onHide={() => setDialogCreateVisible(false)} style={{ width: '500px' }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              label="Скасувати"
              icon="pi pi-times"
              onClick={() => setDialogCreateVisible(false)}
              className="p-button-text button button-cancel"
              style={{ width: '150px' }}
            />
            <Button
              label="Підтвердити"
              icon="pi pi-check"
              onClick={() => console.log("Створено новий сценарій")}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <div className="field" style={{ display: 'flex', justifyContent: 'center' }}>
          <InputText
            id="create-scenario"
            style={{ width: '80%' }}
          />
        </div>
      </Dialog>

      <Dialog header={"Перейменувати сценарій"} visible={dialogRenameVisible} onHide={() => setDialogRenameVisible(false)} style={{ width: '500px' }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              label="Скасувати"
              icon="pi pi-times"
              onClick={() => setDialogRenameVisible(false)}
              className="p-button-text button button-cancel"
              style={{ width: '150px' }}
            />
            <Button
              label="Підтвердити"
              icon="pi pi-check"
              onClick={() => console.log("Перейменовано сценарій")}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <div className="field" style={{ display: 'flex', justifyContent: 'center' }}>
          <InputText
            id="rename-scenario"
            style={{ width: '80%' }}
          />
        </div>
      </Dialog>

      <Dialog header={"Видалити сценарій"} visible={dialogDeleteVisible} onHide={() => setDialogDeleteVisible(false)} style={{ width: '500px' }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              label="Скасувати"
              icon="pi pi-times"
              onClick={() => setDialogDeleteVisible(false)}
              className="p-button-text button button-cancel"
              style={{ width: '150px' }}
            />
            <Button
              label="Підтвердити"
              icon="pi pi-check"
              onClick={() => console.log("Видалено сценарій")}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <p>Сценарій: </p>
      </Dialog>

    </>
  );
};

export default RectificationProcessPage;
