import React, { useEffect, useState, useMemo } from 'react';
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
import { useReedRecipeMutation } from '../api/recipeApi';
import { toast } from 'react-toastify';
import { useRenameRecipeMutation } from '../api/renameRecipeApi';
import { useDeleteRecipeMutation } from '../api/deleteRecipeApi';
import { useTranslation } from 'react-i18next';

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
  const [recipeName, setRecipeName] = useState('');
  const [recipeNumber, setRecipeNumber] = useState('');
  const [reedRecipe] = useReedRecipeMutation();
  const [renameRecipe] = useRenameRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();

  const { t } = useTranslation();

  const pageRecipe = () => {
    return {
      key: key,
      w: 2,
    };
  };

  const [listRecipe, setListRecipe] = useState([]);
  const [countRecipe, setCountRecipe] = useState(0);

  const fetchRecipe = async () => {
    const respons = await reedRecipe(pageRecipe());
    const { recipeList, recipeCount } = respons.data;
    setListRecipe(recipeList);
    setCountRecipe(recipeCount);
  };

  useEffect(() => {
    fetchRecipe();
  }, []);

  const pageRecipeData = useMemo(() => {
    return {
      key: key,
      w: 2,
      r: recipeNumber,
      n: recipeName,
    };
  }, [recipeName, recipeNumber]);

  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(pageRecipeData, { pollingInterval: SYNC_INTERVAL });

  const handleScenarioChange = (label: string, value: string) => {
    setRecipeName(label);
    setRecipeNumber(value);
  };

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
        setBodySymbol(t('unit_minutes'));
      } else if (data.transitBody == 2) {
        setDisabledTimeBody(false);
        setIsSwitchOn(false);
        setBodySymbol('°C');
      }

      if (data.selection == 0 && (data.version >= 4.42 || (data.version >= 3.42 && data.version < 4))) {
        setSymbol('%');
      } else if (data.selection == 1 && data.version >= 2.5) {
        setSymbol(t('unit_liter_per_gram'));
      }
    }
  }, [data, hasTailSwitch, hasCargeSwitch]);

  const [dialogCreateVisible, setDialogCreateVisible] = useState(false);
  const [dialogRenameVisible, setDialogRenameVisible] = useState(false);
  const [dialogDeleteVisible, setDialogDeleteVisible] = useState(false);

  const [disabledButtonRecipe, setDisabledButtonRecipe] = useState(true);

  useEffect(() => {
    if (recipeNumber == '0') {
      setDisabledButtonRecipe(true);
    } else {
      setDisabledButtonRecipe(false);
    }
  }, [recipeNumber]);

  const recipeRename = async () => {
    const inputElement = document.getElementById('rename-scenario') as HTMLInputElement;
    if (inputElement.value === '') {
      toast.error(t('scenario_rename_error1'));
    } else {
      const recipeData = {
        key: key,
        w: 2,
        n1: recipeName,
        n2: inputElement.value,
      };
      try {
        await renameRecipe(recipeData);
        await fetchRecipe();
        setDialogRenameVisible(false);
        toast.success(t('scenario_rename_success') + inputElement.value);
      } catch (error) {
        toast.error(t('scenario_rename_error2'));
        console.error(error);
      }
    }
  };

  const recipeDelete = async () => {
    const recipeData = {
      key: key,
      w: 2,
      n: recipeName,
    };
    try {
      await deleteRecipe(recipeData);
      await fetchRecipe();
      setDialogDeleteVisible(false);
      toast.success(t('scenario_delete_success'));
    } catch (error) {
      toast.error(t('scenario_delete_error'));
      console.error(error);
    }
  };

  if (isLoading || data.version == 0) return <p>{t('loading')}</p>; // из-за списка рецепта дольше загрузка страницы
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
        <div className="flex flex-column w-1/4">
          <div className="grid grid-cols-2 w-full">
            <div className="col-6">
              <ACBlockTempSmall name={t('cube')} color="purple" temp={String(data.tempCube)} help={l === 'en' ? helpM.temp_cube : helpM.temp_cube_m} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall name={t('carga')} color="orange" temp={String(data.tempCargi)} help={l === 'en' ? helpM.temp_cargi : helpM.temp_cargi_m} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall name={t('defl')} color="red" temp={String(data.tempDef)} help={l === 'en' ? helpM.temp_defl : helpM.temp_defl_m} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall name={t('water')} color="blue" temp={String(data.tempWater)} help={l === 'en' ? helpM.temp_water : helpM.temp_water_m} />
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
                        label={t('process_rect_temp_selection_heads')}
                        color="blue"
                        initialValue={value}
                        help={l === 'en' ? helpM.temp_selection_heads : helpM.temp_selection_heads_m}
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
                        label={t('process_rect_gist_selection_heads')}
                        help={l === 'en' ? helpM.gist_selection_heads : helpM.gist_selection_heads_m}
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
                        label={t('process_rect_temp_selection_body')}
                        color="orange"
                        initialValue={value}
                        help={l === 'en' ? helpM.temp_selection_body : helpM.temp_selection_body_m}
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
                        label={t('process_rect_gist_selection_body')}
                        help={l === 'en' ? helpM.gist_selection_body : helpM.gist_selection_body_m}
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
                        label={t('process_rect_temp_selection_tails')}
                        color="red"
                        initialValue={value}
                        help={l === 'en' ? helpM.temp_selection_tails : helpM.temp_selection_tails_m}
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
                        units={t('unit_liter_per_gram')}
                        value={value.value}
                        label={t('process_speed_selection_tails')}
                        help={l === 'en' ? helpM.speed_selection_tails : helpM.speed_selection_tails_m}
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
                        label={t('process_temp_stop')}
                        initialValue={value}
                        help={l === 'en' ? helpM.temp_stop : helpM.temp_stop_m}
                        onChange={(e) => onChangeForm(e.value)}
                      />
                    )}
                  />
                  <Controller
                    name="rectTimeStab"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACCounterLabel
                        label={t('process_rect_column_stabilization')}
                        value={value}
                        units={t('unit_minutes')}
                        help={l === 'en' ? helpM.stabilisation_column : helpM.stabilisation_column_m}
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
          style={{ maxHeight: '670px', overflowY: 'auto', width: '80%', borderRadius: '12px', paddingRight: '4px' }}
        >
          <div className="block p-3 w-full">
            <h3>{t('process_scenario_header')}</h3>
            <div className="flex align-items-center justify-content-center">
              <ACScriptComp options={listRecipe} onChange={handleScenarioChange} />
              <ACIconButton
                iconName="edit"
                disabled={disabledButtonRecipe}
                onClick={() => setDialogRenameVisible(true)}
              />
              <ACIconButton
                iconName="doc_download"
                disabled={disabledButtonRecipe}
                onClick={() => console.log('DocD clicked')}
              />
              <ACIconButton iconName="doc_add" onClick={() => setDialogCreateVisible(true)} />
              <ACIconButton
                iconName="delete"
                disabled={disabledButtonRecipe}
                onClick={() => setDialogDeleteVisible(true)}
              />
            </div>
            <div className="flex align-items-center justify-content-center">
              <Button label={t('process_skip')} className="button-skip" />
              <Button label={t('process_start1')} className="button-start" />
            </div>
          </div>

          <div className="block p-3 w-full">
            <h3>{t('process_power_header')}</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectAcceleration"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label={t('process_power_acceleration')}
                    value={value}
                    units="%"
                    help={l === 'en' ? helpM.power_acceleration : helpM.power_acceleration_m}
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
                    label={t('process_power_selection')}
                    value={value}
                    units="%"
                    help={l === 'en' ? helpM.power_selection : helpM.power_selection_m}
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
                    label={t('process_power_selection_body')}
                    value={value}
                    units="%"
                    help={l === 'en' ? helpM.power_selection_body : helpM.power_selection_body_m}
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
                    label={t('process_rect_power_selection_tails')}
                    value={value}
                    units="%"
                    help={l === 'en' ? helpM.power_selection_tails : helpM.power_selection_tails_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={powerTail}
                  />
                )}
              />
            </div>
          </div>

          <div className="block p-3 w-full">
            <h3>{t('process_rect_speed_header')}</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectPercentHead"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label={t('process_rect_speeed_selection_heads')}
                    value={value.value}
                    units={symbol}
                    help={l === 'en' ? helpM.speed_selection_heads : helpM.speed_selection_heads_m}
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
                    label={t('process_rect_speed_selection_body')}
                    value={value.value}
                    units={symbol}
                    help={l === 'en' ? helpM.speed_selection_body : helpM.speed_selection_body_m}
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
                      label={t('process_rect_speed_carga_decrease')}
                      value={value.value}
                      units={symbol}
                      help={l === 'en' ? helpM.decrease_speed_cargi : helpM.decrease_speed_cargi_m}
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
                      onLabel={t('toggle_temp')}
                      offLabel={t('toggle_auto')}
                      disabled={disabledCarge}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="block p-3 w-full">
            <h3>{t('process_rect_cycles_header')}</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectCyclesNumber"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="list"
                    label={t('process_rect_cycles_number')}
                    value={value}
                    units=" "
                    help={l === 'en' ? helpM.cycles : helpM.cycles_m}
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
                    label={t('process_rect_cycles_limit')}
                    value={value}
                    units={t('unit_minutes')}
                    help={l === 'en' ? helpM.border_cycles : helpM.border_cycles_m}
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
                    label={t('process_rect_cycles_reduction')}
                    value={value.value}
                    units={symbol}
                    help={l === 'en' ? helpM.decrease_cycles : helpM.decrease_cycles_m}
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
            <h3>{t('process_other')}</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="rectTempPower"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp"
                    color="white"
                    label={t('process_temp_transition')}
                    value={value}
                    units="°C"
                    help={l === 'en' ? helpM.temp_transition : helpM.temp_transition_m}
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
                    label={t('process_rect_temp_cube_decrease')}
                    value={value}
                    units="°C"
                    help={l === 'en' ? helpM.decrease_selection : helpM.decrease_selection_m}
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
                    label={t('process_temp_breakdown')}
                    value={value}
                    units="°C"
                    help={l === 'en' ? helpM.temp_breakdown : helpM.temp_breakdown_m}
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
                    label={t('process_rect_temp_carga_decrease')}
                    value={value}
                    units="°C"
                    help={l === 'en' ? helpM.temp_selection_cargi : helpM.temp_selection_cargi_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={tempSelectCarge}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <div className="flex flex-row align-items-center justify-content-center w-full">
                <ACRegulator icon="arrow_curve" label={t('process_rect_selection_tails')} help={helpM.selection_tails_m} />
                <Controller
                  name="rectSwitchTail"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ToggleButton
                      className="custom-toggle-button"
                      checked={value}
                      onChange={(e) => onChangeForm(e.value)}
                      onLabel={t('toggle_column')}
                      offLabel={t('toggle_node')}
                      disabled={switchTail}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                key={bodySymbol}
                name={isSwitchOn ? 'rectTimeBody' : 'rectTempTransit'} //bug: no symbol for first boot
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="arrow_fork"
                    label={t('process_rect_transition_selection_body')}
                    value={value}
                    units={bodySymbol}
                    help={l === 'en' ? helpM.transition_select_body : helpM.transition_select_body_m}
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
                      label={t('process_rect_speed_selection_decrease')}
                      help={l === 'en' ? helpM.decrease_speed_selection : helpM.decrease_speed_selection_m}
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
                      onLabel={t('toggle_many')}
                      offLabel={t('toggle_one')}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        header={t('scenario_dialog_create')}
        visible={dialogCreateVisible}
        onHide={() => setDialogCreateVisible(false)}
        style={{ width: '500px' }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              label={t('button_cancel')}
              icon="pi pi-times"
              onClick={() => setDialogCreateVisible(false)}
              className="p-button-text button button-cancel"
              style={{ width: '150px' }}
            />
            <Button
              label={t('button_confirm')}
              icon="pi pi-check"
              onClick={() => console.log('Створено новий сценарій')}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <div className="field" style={{ display: 'flex', justifyContent: 'center' }}>
          <InputText id="create-scenario" style={{ width: '80%' }} />
        </div>
      </Dialog>

      <Dialog
        header={t('scenario_dialog_rename')}
        visible={dialogRenameVisible}
        onHide={() => setDialogRenameVisible(false)}
        style={{ width: '500px' }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              label={t('button_cancel')}
              icon="pi pi-times"
              onClick={() => setDialogRenameVisible(false)}
              className="p-button-text button button-cancel"
              style={{ width: '150px' }}
            />
            <Button
              label={t('button_confirm')}
              icon="pi pi-check"
              onClick={recipeRename}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <div className="field" style={{ display: 'flex', justifyContent: 'center' }}>
          <InputText id="rename-scenario" style={{ width: '80%' }} />
        </div>
      </Dialog>

      <Dialog
        header={t('scenario_dialog_delete')}
        visible={dialogDeleteVisible}
        onHide={() => setDialogDeleteVisible(false)}
        style={{ width: '500px' }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              label={t('button_cancel')}
              icon="pi pi-times"
              onClick={() => setDialogDeleteVisible(false)}
              className="p-button-text button button-cancel"
              style={{ width: '150px' }}
            />
            <Button
              label={t('button_confirm')}
              icon="pi pi-check"
              onClick={recipeDelete}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <p>{t('scenario_dialog_name')} {recipeName}</p>
      </Dialog>
    </>
  );
};

export default RectificationProcessPage;
