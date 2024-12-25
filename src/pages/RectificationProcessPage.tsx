import React, { useState } from 'react';
import { ACBlockTempSmall } from '../components/blocktemp';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACScriptComp } from '../components/scriptcomp';
import { ACIconButton } from '../components/iconbutton';
import { ACSlider } from '../components/knob';
import { ACCounterLabel } from '../components/counter';
import { ACRegulator } from '../components/regulatorscomp';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import '../styles/process_page.css';
import 'primereact/resources/themes/lara-light-purple/theme.css';
import * as helpM from '../components/help_messages';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useForm, Controller } from 'react-hook-form';
import { debounce } from 'lodash';

type FormData = {
  rectTempHead: number;
  rectPercentHead: number;
  rectTempBody: number;
  rectGystBody: number;
  rectCubeTail: number;
  rectSpeedTail: number;
  rectDecreaseSpeed: number;
  rectDecrease: number;
  rectAcceleration: number;
  rectPower: number;
  rectPowerBody: number;
  rectPowerTail: number;
  rectGystHead: number;
  rectPercentBody: number;
  rectSpeedCarge: number;
  rectCyclesNumber: number;
  rectEndCycle: number;
  rectDecreaseCycle: number;
  rectTempPower: number;
  rectTempStop: number;
  rectTempError: number;
  rectTimeStab: number;
};

const RectificationProcessPage = () => {
  const key = localStorage.getItem('samogonKey');
  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(key ?? skipToken, { pollingInterval: SYNC_INTERVAL });

  const { control, watch } = useForm<FormData>({
    values: {
      rectTempHead: data.rectTempHead,
      rectPercentHead: data.rectPercentHead,
      rectTempBody: data.rectTempBody,
      rectGystBody: data.rectGystBody,
      rectCubeTail: data.rectCubeTail,
      rectSpeedTail: data.rectSpeedTail,
      rectDecreaseSpeed: data.rectDecreaseSpeed,
      rectDecrease: 0, // найти
      rectAcceleration: data.rectAcceleration,
      rectPower: data.rectPower,
      rectPowerBody: data.rectPowerBody,
      rectPowerTail: data.rectPowerTail,
      rectGystHead: data.rectGystHead,
      rectPercentBody: data.rectPercentBody,
      rectSpeedCarge: data.rectSpeedCarge,
      rectCyclesNumber: data.rectCyclesNumber,
      rectEndCycle: data.rectEndCycle,
      rectDecreaseCycle: data.rectDecreaseCycle,
      rectTempPower: data.rectTempPower,
      rectTempStop: data.rectTempPower,
      rectTempError: data.rectTempError,
      rectTimeStab: data.rectTimeStab,
    },
  });

  const [checked, setChecked] = useState(false);
  const [isTailMode, setIsTailMode] = useState(false);
  const handleTailToggleChange = (e: boolean) => {
    setIsTailMode(e);
  };

  const [isSpeedMode, setIsSpeedMode] = useState(false);
  const handleSpeedToggleChange = (e: boolean) => {
    setIsSpeedMode(e);
  };

  if (isLoading) return <p>Завантаження...</p>;
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
              <ACBlockTempSmall
                name="Царга"
                color="orange"
                temp={String(data.tempCargi)}
                help={helpM.temp_cargi_m}
              />
            </div>
            <div className="col-6">
              <ACBlockTempSmall
                name="Дефлегматор"
                color="red"
                temp={String(data.tempDef)}
                help={helpM.temp_defl_m}
              />
            </div>
            <div className="col-6">
              <ACBlockTempSmall
                name="Вода"
                color="blue"
                temp={String(data.tempWater)}
                help={helpM.temp_water_m}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-3">
            <div className="col flex flex-col align-items-center justify-content-center gap-3 p-2 -mt-3">
              <div className="block col-6">
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
                <br />
                <Controller
                  name="rectPercentHead"
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
              <div className="block col-6">
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
                <br />
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
            <div
              className="col flex flex-col align-items-center justify-content-center gap-3 p-2 -mt-2"
              style={{ height: '200px' }}
            >
              <div className="block col-6" style={{ height: '200px', minWidth: '200px' }}>
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
                    />
                  )}
                />
                <br />
                <Controller
                  name="rectSpeedTail"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACCounterLabel
                      units="л/г"
                      value={value}
                      label="Швидкість"
                      help={helpM.speed_selection_tails_m}
                      onChange={(e) => onChangeForm(e.value)}
                      disabled={isTailMode}
                    />
                  )}
                />
              </div>
              <div className="block col-6" style={{ height: '200px', minWidth: '200px' }}>
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
                <br />
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

        <div className="flex flex-column gap-3 flex-grow align-items-start justify-content-start w-3/4 custom-scrollbar" style={{ maxHeight: '667px', overflowY: 'auto', width: '80%', borderRadius: '12px', paddingRight: '4px' }} >
          <div className="block p-3 w-full">
            <h3>Автоматика</h3>
            <div className="flex align-items-center justify-content-center">
              <ACScriptComp />

              <ACIconButton iconName="edit" onClick={() => console.log('Edit clicked')} />
              <ACIconButton iconName="doc_download" onClick={() => console.log('DocD clicked')} />
              <ACIconButton iconName="doc_add" onClick={() => console.log('DocAdd clicked')} />
              <ACIconButton iconName="delete" onClick={() => console.log('Delete clicked')} />
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
                    disabled={!isTailMode}
                  />
                )}
              />
            </div>
          </div>

          <div className="block p-3 w-full">
            <h3>Швидкість</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectGystHead"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label="Шв.відбору(голів)"
                    value={value}
                    units="%"
                    help={helpM.speed_selection_heads_m}
                    onChange={(e) => onChangeForm(e.value)}
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
                    value={value}
                    units="%"
                    help={helpM.speed_selection_body_m}
                    onChange={(e) => onChangeForm(e.value)}
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
                      value={value}
                      units="л/г"
                      help={helpM.decrease_speed_cargi_m}
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
                <ToggleButton onLabel="Темп" offLabel="Авто" checked={isSpeedMode} onChange={(e) => handleSpeedToggleChange(e.value)} className="custom-toggle-button" />
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
                    value={value}
                    units="л/г"
                    help={helpM.decrease_cycles_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className="block p-3 w-full">
            <h3>Інше</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectDecreaseSpeed"
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
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <Controller
                  name="rectDecrease"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACRegulator
                      icon="speed"
                      units="л/г"
                      value={value}
                      label="Зменш.шв.відбору"
                      help={helpM.decrease_speed_selection_m}
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
                <ToggleButton onLabel="Багат" offLabel="Однок" checked={checked} onChange={(e) => setChecked(e.value)} className="custom-toggle-button" />
              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectTempPower"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp"
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
                name="rectTempError"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp"
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
              <ACRegulator icon="temp_minus" label="Темп.зм.по царзі" help={helpM.temp_selection_cargi_m} units='°C' value={0} disabled={!isSpeedMode} />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-6">
              <div className="flex flex-row align-items-center justify-content-center w-full">
                <ACRegulator icon="arrow_curve" label="Відбір хвостів" help={helpM.selection_tails_m} />
                <ToggleButton onLabel="Колона" offLabel="Вузол" checked={isTailMode} onChange={(e) => handleTailToggleChange(e.value)} className="custom-toggle-button" />
              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="arrow_fork" label="Перехід відб.тіла" help={helpM.transition_select_body_m} units='' value={0} disabled />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RectificationProcessPage;
