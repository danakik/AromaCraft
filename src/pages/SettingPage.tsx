import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACKnob } from '../components/knob';
import { ACRegulator } from '../components/regulatorscomp';
import { ACCounterLabel } from '../components/counter';
import { Button } from 'primereact/button';
import { ACSwitch } from '../components/switch';
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { ToggleButton } from 'primereact/togglebutton';
import { useForm, Controller } from 'react-hook-form';
import { ACThreeStateButton } from '../components/threestatebutton';
import { debounce } from 'lodash';
import { useSaveSettingMutation } from '../api/settingSave';

type FormData = {
  settingTempCupe: number;
  settingTempCarge: number;
  settingTempDef: number;
  settingTempWater: number;
  settingSeatHeat: boolean;
  settingTen: number;
  settingBrometr: boolean;
  transitBody: number;
  switchTail: boolean;
  selection: boolean;
  selectionSpeed: number;
};

const SettingPage = () => {
  const key = localStorage.getItem('samogonKey');
  const [isFormChanging, setIsFormChanging] = useState(false);
  const [save] = useSaveSettingMutation();
  const dataSamagon = useMemo(() => {
    return {
      key: key,
    };
  }, [key]);

  const { data = initialSortedData, isLoading, error } = useGetDataQuery(dataSamagon, { pollingInterval: isFormChanging ? 0 : SYNC_INTERVAL });

  const { control, watch } = useForm<FormData>({
    values: {
      settingTempCupe: data.settingTempCupe,
      settingTempCarge: data.settingTempCarge,
      settingTempDef: data.settingTempDef,
      settingTempWater: data.settingTempWater,
      settingSeatHeat: !!data.settingSeatHeat,
      settingTen: data.settingTen,
      settingBrometr: !!data.settingBrometr,
      transitBody: data.transitBody,
      switchTail: !!data.switchTail,
      selection: !!data.selection,
      selectionSpeed: data.selectionSpeed,
    },
  });

  const formatFormData = (formValues: FormData) => {
    return {
      key: key,
      c: formValues.settingTempCupe,
      g: formValues.settingTempCarge,
      d: formValues.settingTempDef,
      w: formValues.settingTempWater,
      r: formValues.settingSeatHeat ? 1 : 0,
      p: formValues.selectionSpeed,
      b: formValues.settingBrometr ? 1 : 0,
      s: formValues.selection ? 1 : 0,
      t: formValues.transitBody,
      e: formValues.settingTen,
      h: formValues.switchTail ? 1 : 0,
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
       console.log(formattedData);
      save(formattedData); 
 /*      protection against children  */

      setIsFormChanging(false);
    }, 5000);

    if (isFormChanging) {
      debouncedLog();
    }

    return () => {
      debouncedLog.cancel();
    };
  }, [formValues, isFormChanging]);

  const [isBarometr, setIsBarometr] = useState(false);
  const [lableBarometr, setLableBarometr] = useState(`${data.settingValueBrometr}мм`);
  useEffect(() => {
    if (data.version !== 0) {
      if (data.version >= 2.5 && data.version < 4) {
        setIsBarometr(true);
        setLableBarometr('нема');
      }
    }
  }, [data]);

  if (isLoading || data.version == 0) return <p>Завантаження...</p>;
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
      <div className="flex flex-row w-full h-screen align-items-start justify-content-start">
        <div className="flex flex-column w-3/4 h-full align-items-start justify-content-start">
          <div className="grid grid-cols-2 w-full gap-3 p-3">
            <div className="col flex flex-col items-center gap-3 p-2 -mt-3">
              <div className="block col-6">
                <ACKnob
                  label="Темп. куба"
                  color="purple"
                  initialValue={Number(data.tempCube)}
                  help={helpM.set_temp_cube_m}
                  readonly
                />
                <Controller
                  name="settingTempCupe"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACCounterLabel
                      units="°C "
                      value={value}
                      label="Зміна темп. куба"
                      help={helpM.set_temp_cube_m}
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
              </div>
              <div className="block col-6">
                <ACKnob
                  label="Темп. царги"
                  color="orange"
                  initialValue={Number(data.tempCargi)}
                  help={helpM.set_temp_cargi_m}
                  readonly
                />
                <Controller
                  name="settingTempCarge"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACCounterLabel
                      units="°C "
                      value={value}
                      label="Зміна темп. царги"
                      help={helpM.set_temp_cargi_m}
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className="col flex flex-col items-center gap-3 p-2 -mt-3">
              <div className="block col-6">
                <ACKnob
                  label="Темп. дефлегматора"
                  color="red"
                  initialValue={Number(data.tempDef)}
                  help={helpM.set_temp_defl_m}
                  readonly
                />
                <Controller
                  name="settingTempDef"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACCounterLabel
                      units="°C "
                      value={value}
                      label="Зміна темп. дефл."
                      help={helpM.set_temp_defl_m}
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
              </div>
              <div className="block col-6">
                <ACKnob
                  label="Темп. води"
                  color="blue"
                  initialValue={Number(data.tempWater)}
                  help={helpM.set_temp_water_m}
                  readonly
                />
                <Controller
                  name="settingTempWater"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACCounterLabel
                      units="°C "
                      value={value}
                      label="Зміна темп. води"
                      help={helpM.set_temp_water_m}
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-column align-items-start justify-content-start gap-3 w-1/4 -ml-3">
          <div className="block p-2 flex-1 w-full">
            <h3>Повідомлення</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <Button
                label="Зробити запит"
                style={{ backgroundColor: '#9e4ae7', borderColor: '#9e4ae7', color: '#fff' }}
              />
              <h3>Пристрій: </h3>
              <h3>DESKTOP-5253</h3>
            </div>
          </div>
          <div className="block p-2">
            <h3>Налаштування</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="pid" label="Встановлення нагріву" help={helpM.set_warm_m} />
                <Controller
                  name="settingSeatHeat"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ToggleButton
                      className="custom-toggle-button"
                      checked={value}
                      onChange={(e) => onChangeForm(e.value)}
                      onLabel="Регул"
                      offLabel="Розет"
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="settingTen"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label="ТЕН"
                    value={value}
                    units="Вт"
                    help={helpM.set_ten_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
            <ACRegulator icon="antena_bars" label={`Барометр, ${lableBarometr}`} help={helpM.barometer_m} />
              <Controller
                name="settingBrometr"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} disabled={isBarometr} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="valve_heads" label="Відбір голів" help={helpM.set_selection_heads_m} />
                <Controller
                  name="transitBody"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACThreeStateButton
                      firstStateLabel="Рівень"
                      secondStateLabel="Час"
                      thirdStateLabel="Датчик"
                      initialState={value}
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="arrow_fork" label="Перемикач голів" help={helpM.set_change_heads_m} />
                <Controller
                  name="switchTail"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ToggleButton
                      className="custom-toggle-button"
                      checked={value}
                      onChange={(e) => onChangeForm(e.value)}
                      onLabel="Вбік"
                      offLabel="Вниз"
                    />
                  )}
                />              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="select_valve" label="Встановлення відбору" help={helpM.set_selection_m} />
                <Controller
                  name="selection"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ToggleButton
                      className="custom-toggle-button"
                      checked={value}
                      onChange={(e) => onChangeForm(e.value)}
                      onLabel="л/г"
                      offLabel="%"
                    />
                  )}
                />              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="selectionSpeed"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="speed"
                    label="Швидкість при 20%"
                    value={value}
                    units="л/г"
                    help={helpM.set_speed_20_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingPage;
