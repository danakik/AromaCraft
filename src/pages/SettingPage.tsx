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
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

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

  const [isBarometr, setIsBarometr] = useState(false);
  const [lableBarometr, setLableBarometr] = useState(`${data.settingValueBrometr}${t('unim_mm')}`);
  useEffect(() => {
    if (data.version !== 0) {
      if (data.version >= 2.5 && data.version < 4) {
        setIsBarometr(true);
        setLableBarometr(t('settings_no_barometer'));
      }
    }
  }, [data]);

  if (isLoading || data.version == 0) return <p>{t('loading')}</p>;
  if (error) return <p>{t('loading_error_t')}</p>;

  let l = localStorage.getItem('language');

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
        <div className="flex flex-column w-3/4 p-2">
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="block flex-1 p-2 col-6">
              <ACKnob
                label={t('settings_temp_cube')}
                color="purple"
                initialValue={Number(data.tempCube)}
                help={l === 'en' ? helpM.set_temp_cube : helpM.set_temp_cube_m}
                readonly
              />
              <Controller
                name="settingTempCupe"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACCounterLabel
                    units="°C "
                    value={value}
                    label={t('settings_temp_cube_change')}
                    help={l === 'en' ? helpM.set_temp_cube : helpM.set_temp_cube_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="block flex-1 p-2 col-6">
              <ACKnob
                label={t('settings_temp_carga')}
                color="orange"
                initialValue={Number(data.tempCargi)}
                help={l === 'en' ? helpM.set_temp_cargi : helpM.set_temp_cargi_m}
                readonly
              />
              <Controller
                name="settingTempCarge"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACCounterLabel
                    units="°C "
                    value={value}
                    label={t('settings_temp_carga_change')}
                    help={l === 'en' ? helpM.set_temp_cargi : helpM.set_temp_cargi_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="block flex-1 p-2 col-6">
              <ACKnob
                label={t('settings_temp_defl')}
                color="red"
                initialValue={Number(data.tempDef)}
                help={l === 'en' ? helpM.set_temp_defl : helpM.set_temp_defl_m}
                readonly
              />
              <Controller
                name="settingTempDef"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACCounterLabel
                    units="°C "
                    value={value}
                    label={t('settings_temp_defl_change')}
                    help={l === 'en' ? helpM.set_temp_defl : helpM.set_temp_defl_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="block flex-1 p-2 col-6">
              <ACKnob
                label={t('settings_temp_water')}
                color="blue"
                initialValue={Number(data.tempWater)}
                help={l === 'en' ? helpM.set_temp_water : helpM.set_temp_water_m}
                readonly
              />
              <Controller
                name="settingTempWater"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACCounterLabel
                    units="°C "
                    value={value}
                    label={t('settings_temp_water_change')}
                    help={l === 'en' ? helpM.set_temp_water : helpM.set_temp_water_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-column gap-3 flex-grow align-items-start justify-content-start w-1/4">
          <div className="block p-3 w-full">
            <h3>{t('settings_message')}</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <Button
                label={t('settings_request')}
                style={{ backgroundColor: '#9e4ae7', borderColor: '#9e4ae7', color: '#fff' }}
              />
              <h3>{t('settings_device')}</h3>
              <h3>DESKTOP-5253</h3>
            </div>
          </div>
          <div className="block p-3 w-full">
            <h3>{t('menu_settings')}</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="pid" label={t('settings_set_heat')} help={l === 'en' ? helpM.set_warm : helpM.set_warm_m} />
                <Controller
                  name="settingSeatHeat"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ToggleButton
                      className="custom-toggle-button"
                      checked={value}
                      onChange={(e) => onChangeForm(e.value)}
                      onLabel={t('toggle_regul')}
                      offLabel={t('toggle_socket')}
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
                    label={t('settings_ten')}
                    value={value}
                    units={t('unit_w')}
                    help={l === 'en' ? helpM.set_ten : helpM.set_ten_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="antena_bars" label={`${t('settings_barometer')}, ${lableBarometr}`} help={l === 'en' ? helpM.barometer : helpM.barometer_m} />
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
                <ACRegulator icon="valve_heads" label={t('status_selection_heads')} help={l === 'en' ? helpM.set_selection_heads : helpM.set_selection_heads_m} />
                <Controller
                  name="transitBody"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACThreeStateButton
                      firstStateLabel={t('toggle_level')}
                      secondStateLabel={t('toggle_time')}
                      thirdStateLabel={t('toggle_sensor')}
                      initialState={value}
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="arrow_fork" label={t('settings_switch_heads')} help={l === 'en' ? helpM.set_change_heads : helpM.set_change_heads_m} />
                <Controller
                  name="switchTail"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ToggleButton
                      className="custom-toggle-button"
                      checked={value}
                      onChange={(e) => onChangeForm(e.value)}
                      onLabel={t('toggle_aside')}
                      offLabel={t('toggle_down')}
                    />
                  )}

                />
              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="select_valve" label={t('settings_selection_setup')} help={l === 'en' ? helpM.set_selection : helpM.set_selection_m} />
                <Controller
                  name="selection"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ToggleButton
                      className="custom-toggle-button"
                      checked={value}
                      onChange={(e) => onChangeForm(e.value)}
                      onLabel={t('unit_liter_per_gram')}
                      offLabel="%"
                    />
                  )}
                />
              </div>

            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="selectionSpeed"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="speed"
                    label={t('settings_speed')}
                    value={value}
                    units={t('unit_liter_per_gram')}
                    help={l === 'en' ? helpM.set_speed_20 : helpM.set_speed_20_m}
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
