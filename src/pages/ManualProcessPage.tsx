import React, { useEffect } from 'react';
import { ACBlockTemp } from '../components/blocktemp';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACKnob } from '../components/knob';
import { ACCounterLabel } from '../components/counter';
import { ACRegulator } from '../components/regulatorscomp';
import { ACSwitch } from '../components/switch';
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { useForm, Controller } from 'react-hook-form';

type FormData = {
  tempSelect: number;
  handPercent: number;
  handTempGyst: number;
  handSpeedTail: number;
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
  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(key ?? skipToken, { pollingInterval: SYNC_INTERVAL });

  const { control, watch, reset } = useForm<FormData>({
    values: {
      tempSelect: data.handTempSelect,
      handPercent: data.handPercent,
      handTempGyst: data.handTempGyst,
      handSpeedTail: data.handSpeedTail,
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

  const formValues = watch();

  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка у завантаженні даних.</p>;

  return (
    <>
      <header className="mb-3">
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
              <ACBlockTemp name="Вода" color="blue" temp={String(data.tempWoter)} help={helpM.temp_water_m} />
            </div>
          </div>

          <div className="flex flex-row gap-3 p-2 w-full -mt-2">
            <div className="block p-2 flex-1 col-6">
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
                  <ACCounterLabel
                    units="л/г"
                    label="Швидкість відбору"
                    help={helpM.speed_selection_m}
                    value={value}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="block p-2 flex-1 col-6">
              <Controller
                name="handTempGyst"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACKnob
                    label="Гістерезіс відбору"
                    color="blue"
                    initialValue={value}
                    help="helpM.gist_selection_m"
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
              <br />
              <Controller
                name="handSpeedTail"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACCounterLabel
                    units="л/г"
                    label="Швидкість відбору хвостів"
                    help={helpM.speed_selection_tails_m}
                    value={value}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
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
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
          </div>
          <div className="block p-4  w-full">
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
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
          </div>
          <div className="block p-3  w-full">
            <h3>Аварії</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
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
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2 pl-2">
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
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
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
