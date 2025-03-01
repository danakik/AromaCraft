import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { ACBlockTempSmall } from '../components/blocktemp';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACScriptComp } from '../components/scriptcomp';
import { ACIconButton } from '../components/iconbutton';
import { ACSlider } from '../components/knob';
import { ACCounterLabel } from '../components/counter';
import { ACSwitch } from '../components/switch';
import { ACRegulator, ACRegulatorSpeed } from '../components/regulatorscomp';
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
import { debounce, gt, values } from 'lodash';
import { useReedRecipeMutation } from '../api/recipeApi';
import { toast } from 'react-toastify';
import { useRenameRecipeMutation } from '../api/renameRecipeApi';
import { useDeleteRecipeMutation } from '../api/deleteRecipeApi';
import { useDisableLiProcess } from '../hooks/useDisableLiProcess';
import { useRectificationSaveMutation } from '../api/rectificationSaveApi';
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
  cycles: number;
};

const RectificationProcessPage = () => {
  const key = localStorage.getItem('samogonKey');
  const [isFormChanging, setIsFormChanging] = useState(false);
  const [save] = useRectificationSaveMutation();
  const [recipeName, setRecipeName] = useState('');
  const [recipeNumber, setRecipeNumber] = useState(0);
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

  const [listRecipe, setListRecipe] = useState<string[]>([]);
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
  } = useGetDataQuery(pageRecipeData, { pollingInterval: isFormChanging ? 0 : SYNC_INTERVAL });

  useDisableLiProcess(data);

  const handleScenarioChange = (label: string, value: number) => {
    setRecipeName(label);
    setRecipeNumber(value);
  };

  const { control, watch, setValue } = useForm<FormData>({
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
      cycles: data.cycles,
    },
  });

  const formatFormData = (formValues: FormData) => {
    return {
      key: key,
      e: recipeNumber,
      n: recipeName,
      r: rectCommand,
      cY: formValues.cycles,
      pR: formValues.rectAcceleration,
      pO: formValues.rectPower,
      tR: formValues.rectTempPower,
      tO: formValues.rectTempStop,
      tA: formValues.rectTempError,
      tG: formValues.rectTempHead,
      gG: formValues.rectGystHead,
      tT: formValues.rectTempBody,
      gT: formValues.rectGystBody,
      sG: formValues.rectPercentHead.true_value,
      sT: formValues.rectPercentBody.true_value,
      sK: formValues.rectTimeStab,
      cC: formValues.rectCyclesNumber,
      tC: formValues.rectDecreaseTemp,
      sC: formValues.rectDecreaseSpeed.true_value,
      sY: formValues.rectDecreaseCycle.true_value,
      vV: view(),
      pT: formValues.rectPowerBody,
      bT: formValues.rectSpeedTail.true_value,
      oT: formValues.rectCubeTail,
      tB: formValues.rectTimeBody,
      cG: formValues.rectSpeedCarge.true_value,
      sU: formValues.rectSwitchCube ? 1 : 0,
      sA: formValues.rectSwitchCarge ? 1 : 0,
      sS: formValues.rectSelectCarge,
      rE: formValues.rectEndCycle,
      rT: formValues.rectSwitchTail ? 1 : 0,
      rP: formValues.rectPowerTail,
      rI: formValues.rectTempTransit,
    };
  };

  const view = () => {
    if ((rectCommand === 4 || data.rectController === 4) && data.version === 1) {
      return 1;
    } else {
      return 0;
    }
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

  const [switchTail, setSwitchTail] = useState(true);
  const [speedTail, setSpeedTail] = useState(true);
  const [powerTail, setPowerTail] = useState(true);
  const [tempTail, setTempTail] = useState(true);
  const [endCycle, setEndCycle] = useState(false);
  const [tempSelectCarge, setSelectCarge] = useState(false);
  const [disabledCarge, setDisabledCarge] = useState(true);
  const hasTailSwitch = watch('rectSwitchTail');
  const hasCargeSwitch = watch('rectSwitchCarge');
  const [symbol, setSymbol] = useState('');
  const [disabledSwitchCube, setDisabledSwitchCube] = useState(true);

  const manageSwitchLogic = useCallback(() => {
    if (data.version != 0) {
      if ((data.version >= 3.2 && data.version < 4) || data.version >= 4.2) {
        setDisabledSwitchCube(false);
        setDisabledCarge(false);
      }

      if (data.version >= 4.2) {
        setSpeedTail(hasTailSwitch);
        setPowerTail(!hasTailSwitch);

        if (data.rectController === 0) {
          setSwitchTail(false);
        } else {
          setSwitchTail(true);
        }
      } else {
        setSwitchTail(true);
      }

      if (!hasCargeSwitch && data.rectController != 4) {
        setSelectCarge(true);
      } else if (hasCargeSwitch && data.rectController === 4) {
        setSelectCarge(false);
      }
    }
  }, [data.version, data.rectController, hasTailSwitch, hasCargeSwitch]);

  useEffect(() => {
    manageSwitchLogic();
  }, [manageSwitchLogic]);

  const [rectCommand, setRectCommand] = useState(0);
  const [startLabel, setStartLabel] = useState('СТАРТ');
  const [disabledButtonSkip, setDisabledButtonSkip] = useState(false);
  const cycles = watch('cycles');

  const updateCommandControls = useCallback(() => {
    if (data.version != 0) {
      setStartLabel(rectCommand > 0 ? 'СТОП' : 'СТАРТ');

      if (data.f === 0 && data.rectController != rectCommand) {
        setRectCommand(data.rectController);
        if (rectCommand === 6) {
          setRectCommand(0);
        }
      }
      if (
        (recipeNumber === 0 && data.rectController >= 1 && data.rectController < 4 && rectCommand != 0) ||
        (data.rectController === 4 && cycles > 0)
      ) {
        setDisabledButtonSkip(false);
      } else {
        setDisabledButtonSkip(true);
      }

      if (data.rectController >= 3 && data.rectController < 7) {
        setTempTail(false);
      }
    }
  }, [data.f, data.rectController, cycles, rectCommand, recipeNumber, data.version]);

  useEffect(() => {
    updateCommandControls();
  }, [updateCommandControls]);


  const updateCycleState = useCallback(() => {
    if (data.version != 0) {
      if ((data.version >= 4 && data.version <= 4.1) || data.version < 3.2) {
        setEndCycle(true);
        setSelectCarge(true);

      }

      if (data.selection === 0 && (data.version >= 4.42 || (data.version >= 3.42 && data.version < 4))) {
        setSymbol('%');
      } else if (data.selection === 1 && data.version >= 2.5) {
        setSymbol(t('unit_liter_per_gram'));
      }
    }
  }, [data.version, data.selection]);

  useEffect(() => {
    updateCycleState();
  }, [updateCycleState]);

  const [dialogCreateVisible, setDialogCreateVisible] = useState(false);
  const [dialogRenameVisible, setDialogRenameVisible] = useState(false);
  const [dialogDeleteVisible, setDialogDeleteVisible] = useState(false);
  const [dialogDownloadVisible, setDialogDownloadVisible] = useState(false);
  const [hideButtonStart, setHideButtonStart] = useState(false);
  const [hideButtonSkip, setHideButtonSkip] = useState(false);
  const [disabledButtonRecipe, setDisabledButtonRecipe] = useState(true);

  const updateRecipeControls = useCallback(() => {
    if (recipeNumber === 0) {
      setDisabledButtonRecipe(true);
      setHideButtonStart(false);
      setHideButtonSkip(false);
    } else {
      setDisabledButtonRecipe(false);
      setHideButtonStart(true);
      setHideButtonSkip(true);
    }
  }, [recipeNumber]);

  useEffect(() => {
    updateRecipeControls();
  }, [updateRecipeControls]);

  const [newRecipeName, setNewRecipeName] = useState('');

  const recipeRename = async () => {

    if (!newRecipeName.trim()) {
      toast.error('Введіть назву рецепта');
    } else if (listRecipe.includes(newRecipeName)) {
      toast.warning('Рецепт з такою назвою вже існує');

    } else {
      const recipeData = {
        key: key,
        w: 2,
        n1: recipeName,
        n2: newRecipeName,
      };

      await renameRecipe(recipeData);
      await fetchRecipe();
      setDialogRenameVisible(false);
      setNewRecipeName('');
      toast.success(t('scenario_rename_success') + newRecipeName);

    }
  };

  const recipeDelete = async () => {
    const recipeData = {
      key: key,
      w: 2,
      n: recipeName,
    };

    await deleteRecipe(recipeData);
    await fetchRecipe();
    setDialogDeleteVisible(false);
    toast.success('Рецепт видалено');
  };

  const [nameCreateRecipe, setNameCreateRecipe] = useState('');

  const recipeCreate = async () => {
    if (!nameCreateRecipe.trim()) {
      toast.error('Введіть назву рецепта');
    } else if (listRecipe.includes(nameCreateRecipe)) {
      toast.warning('Рецепт з такою назвою вже існує');
    } else {
      const formattedData = formatFormData(formValues);
      const updatedData = {
        ...formattedData,
        n: nameCreateRecipe,
        e: Number(countRecipe) + 1,
      };
      await save(updatedData);
      await fetchRecipe();
      setDialogCreateVisible(false);
      setNameCreateRecipe('');
      toast.success('Рецепт створено');
    }
  };

  const recipeDownload = async () => {
    const formattedData = formatFormData(formValues);
    const updatedData = {
      ...formattedData,
      n: 'Automation',
      e: 0,
    };
    await save(updatedData);
    await fetchRecipe();
    setDialogDownloadVisible(false);
    toast.success('Рецепт завантажено');
  };

  const clickPass = async () => {
    switch (data.rectController) {
      case 1:
        setRectCommand(2);
        break;
      case 2:
        setRectCommand(3);
        break;
      case 3:
        setRectCommand(4);
        setValue('cycles', 0);
        break;
      case 4:
        if (cycles > 0 && cycles + 1 < data.rectCyclesNumber) {
          setValue('cycles', cycles + 1);
        } else {
          setRectCommand(5);
        }
        break;
      default:
        break;
    }
  };

  const clickStart = async () => {
    if (rectCommand === 0) {
      setRectCommand(1);
    } else {
      setRectCommand(0);
    }
  };

  const [status, setStatus] = useState('');

  const statusUpdate = useCallback(() => {
    let updateStatus = '';

    switch (data.rectController) {
      case 0:
        updateStatus = 'Очікування';
        break;
      case 1:
        updateStatus = 'Розгін';
        break;
      case 2:
        updateStatus = 'Пауза 00: ' + data.rectPause;
        break;
      case 3:
        updateStatus = 'Відбір голів';
        break;
      case 4:
        updateStatus = 'Відбір тіла ЦИКЛ ' + cycles;
        break;
      case 5:
        updateStatus = 'Зупинка';
        break;
      default:
        updateStatus = 'Завершено';
        break;
    }
    switch (data.rectError) {
      case 0:
        updateStatus += ', помилок нема';
        break;
      case 1:
        updateStatus = 'Помилка t° куба';
        break;
      case 2:
        updateStatus = 'Помилка t° царг';
        break;
      case 3:
        updateStatus = 'Помилка t° дефл.';
        break;
      case 4:
        updateStatus = 'Помилка t° води';
        break;
      case 5:
        updateStatus = 'Помилка перегрів';
        break;
      default:
        updateStatus = 'Невідома помилка';
        break;
    }
    setStatus(updateStatus);
  }, [data.rectError, data.rectController, data.rectPause, cycles]);

  useEffect(() => {
    statusUpdate();
  }, [statusUpdate]);

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
          <ACStatusComp status_text={status} />
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
                        readonly={tempTail}
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
                      />
                    )}
                  />
                  <Controller
                    name="rectSpeedTail"
                    control={control}
                    render={({ field: { onChange: onChangeForm, value } }) => (
                      <ACCounterLabel
                        units={symbol}
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
                onClick={() => setDialogDownloadVisible(true)}
              />
              <ACIconButton iconName="doc_add" onClick={() => setDialogCreateVisible(true)} />
              <ACIconButton
                iconName="delete"
                disabled={disabledButtonRecipe}
                onClick={() => setDialogDeleteVisible(true)}
              />
            </div>
            <div className="flex align-items-center justify-content-center">
              {!hideButtonSkip && (
                <Button
                  label=t('process_skip')
                  className="button-skip"
                  disabled={disabledButtonSkip} /* onClick={clickPass} */
                />
              )}
              {!hideButtonStart && <Button label={startLabel} className="button-start" /* onClick={clickStart} */ />}
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
                  <ACRegulatorSpeed
                    icon="ten"
                    label={t('process_rect_speed_selection_body')}
                    value={value.value}
                    true_value={value.true_value}
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

              {data.transitBody === 1 && (
                <Controller
                  name="rectTimeBody"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACRegulator
                      icon="time"
                      label="Перехід на відбір тіла"
                      value={value}
                      units={'хв'}
                      help={helpM.transition_select_body_m} // different hints are needed
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
              )}

              {data.transitBody === 2 && (
                <Controller
                  name="rectTempTransit"
                  control={control}
                  render={({ field: { onChange: onChangeForm, value } }) => (
                    <ACRegulator
                      icon="temp"
                      label="Перехід на відбір тіла"
                      value={value}
                      units={'°C'}
                      help={helpM.transition_select_body_m} // different hints are needed
                      onChange={(e) => onChangeForm(e.value)}
                    />
                  )}
                />
              )}

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
                      disabled={disabledSwitchCube}

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
              onClick={recipeCreate}
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
            onChange={(e) => setNameCreateRecipe(e.target.value)}
          />
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
          <InputText id="rename-scenario" style={{ width: '80%' }} onChange={(e) => setNewRecipeName(e.target.value)} />
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

      <Dialog
        header={recipeName}
        visible={dialogDownloadVisible}
        onHide={() => setDialogDownloadVisible(false)}
        style={{ width: '500px' }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              label="Скасувати"
              icon="pi pi-times"
              onClick={() => setDialogDownloadVisible(false)}
              className="p-button-text button button-cancel"
              style={{ width: '150px' }}
            />
            <Button
              label="Підтвердити"
              icon="pi pi-check"
              onClick={recipeDownload}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <p>Завантажити на автоматику?</p>
      </Dialog>
    </>
  );
};

export default RectificationProcessPage;
