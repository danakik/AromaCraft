import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACKnob } from '../components/knob';
import { ACRegulator } from '../components/regulatorscomp';
import { ACCounterLabel } from '../components/counter';
import { Button } from 'primereact/button';
import { ACSwitch } from '../components/switch';
import '../styles/process_page.css';
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

  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(dataSamagon, { pollingInterval: isFormChanging ? 0 : SYNC_INTERVAL });

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
  const br = useCallback(() => {

    if (data.version !== 0) {
      if (data.version >= 4) {
        setIsBarometr(true);
        setLableBarometr(`${data.settingValueBrometr}${t('unim_mm')}`);
      } else {
        setIsBarometr(false);
        setLableBarometr(t('settings_no_barometer'));
      }
    }
  }, [data.version, data.settingValueBrometr]);

  useEffect(() => {
    br();
  }, [br]);

  const [whichTransitBody, setWhichTransitBody] = useState(true);

  const checkTransitBodySwitch = useCallback(() => {
    if (data.version >= 2.5 && data.version <= 4.3) {
      setWhichTransitBody(true);
    } else {
      setWhichTransitBody(false);
    }
  }, [data.version]);

  useEffect(() => {
    checkTransitBodySwitch();
  }, [checkTransitBodySwitch]);

  const [disabledSpeedSelection, setDisabledSpeedSelection] = useState(true);
  const [disabledTEN, setDisabledTEN] = useState(true);
  const [disabledHeat, setDisabledHeat] = useState(true);
  const [disabledSelection, setDisabledSelection] = useState(true);
  const [disabledTransitBody, setDisabledTransitBody] = useState(true);
  const [disabledBarometr, setDisabledBarometr] = useState(true);
  const[disavledSwitchTail, setDisavledSwitchTail] = useState(true);
  const processStarted = useCallback(() => {
    console.log('isBarometr:', isBarometr);
    if (data.version !== 0) {
      if (
        data.distController === 0 &&
        data.rectController === 0 &&
        data.mashingController === 0 &&
        data.handController === 0
      ) {
        if (data.version >= 2.5) {
          setDisabledSpeedSelection(false);
        }
        if (isBarometr) {
          setDisabledBarometr(false);
        }
        setDisabledTEN(false);
        setDisabledHeat(false);
        setDisabledSelection(false);
        setDisabledTransitBody(false);
        setDisavledSwitchTail(false);
      } else {
        setDisabledSpeedSelection(true);
        setDisabledTEN(true);
        setDisabledHeat(true);
        setDisabledBarometr(true);
        setDisabledSelection(true);
        setDisabledTransitBody(true);
        setDisavledSwitchTail(true);
      }
    }
  }, [data.version, data.distController, data.rectController, data.mashingController, data.handController, isBarometr]);

  useEffect(() => {
    processStarted();
  }, [processStarted, isBarometr]);

  useEffect(() => {
    console.log(disabledBarometr);
  }, [disabledBarometr]);

  

  if (isLoading || data.version === 0) return <p>{t('loading')}</p>;
  if (error) return <p>{t('loading_error_t')}</p>;

  return (
    <>
      <header className="mb-1">
        <div style={{ float: 'right' }}>
          <ACUserComp serial_number={key || ''} />
        </div>
      </header>

      <div className="flex flex-row gap-2 w-full align-items-start justify-content-start">
        <div className="flex flex-column w-1/4 p-2">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 w-full" style={{ minWidth: '420px', maxWidth: '600px' }}>
            <div className="block flex-1 p-2" style={{ minWidth: '200px' }}>
              <ACKnob
                label={t('settings_temp_cube')}
                color="purple"
                initialValue={Number(data.tempCube)}
                help={t('help_temp_cube')}
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
                    help={t('help_set_temp_cube')}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="block flex-1 p-2" style={{ minWidth: '200px' }}>
              <ACKnob
                label={t('settings_temp_carga')}
                color="orange"
                initialValue={Number(data.tempCargi)}
                help={t('help_temp_cargi')}
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
                    help={t('help_set_temp_cargi')}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="block flex-1 p-2" style={{ minWidth: '200px' }}>
              <ACKnob
                label={t('settings_temp_defl')}
                color="red"
                initialValue={Number(data.tempDef)}
                help={t('help_temp_defl')}
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
                    help={t('help_set_temp_defl')}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="block flex-1 p-2" style={{ minWidth: '200px' }}>
              <ACKnob
                label={t('settings_temp_water')}
                color="blue"
                initialValue={Number(data.tempWater)}
                help={t('help_temp_water')}
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
                    help={t('help_set_temp_water')}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-column gap-3 flex-grow align-items-start justify-content-start w-3/4">
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
                <ACRegulator icon="pid" label={t('settings_set_heat')} help={t('help_set_warm')} />
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
                      disabled={disabledHeat}
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
                    help={t('help_set_ten')}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={disabledTEN}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="antena_bars" label={`${t('settings_barometer')}, ${lableBarometr}`} help={t('help_barometer')} />
              <Controller
                name="settingBrometr"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} disabled={disabledBarometr} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">

                <ACRegulator icon="valve_heads" label="Відбір голів" help={t('help_set_selection_heads')} />
                {!whichTransitBody && (
                  <Controller
                    name="transitBody"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACThreeStateButton
                        firstStateLabel={t('toggle_level')}
                        secondStateLabel={t('toggle_time')}
                        thirdStateLabel={t('toggle_time')}
                        initialState={value}
                        onChange={(e) => onChangeForm(e.value)}
                        disabled={disabledTransitBody}
                      />
                    )}
                  />
                )}
                {whichTransitBody && (
                  <Controller
                    name="transitBody"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ToggleButton
                        className="custom-toggle-button"
                        checked={!!value}
                        onChange={(e) => onChangeForm(e.value)}
                        onLabel={t('toggle_time')}
                        offLabel={t('toggle_level')}
                        disabled={disabledTransitBody}
                      />
                    )}
                  />
                )}

              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="arrow_fork" label={t('settings_switch_heads')} help={t('help_set_change_heads')} />
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
                      disabled={disavledSwitchTail}
                    />
                  )}

                />
              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="select_valve" label={t('settings_selection_setup')} help={t('help_set_selection')} />
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
                      disabled={disabledSelection}
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
                    help={t('help_set_speed_20')}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={disabledSpeedSelection}
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
