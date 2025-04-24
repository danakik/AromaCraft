import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ACBlockTempSmall } from '../components/blocktemp';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACScriptComp } from '../components/scriptcomp';
import { ACIconButton } from '../components/iconbutton';
import { ACKnob } from '../components/knob';
import { ACSlider } from '../components/knob';
import { ACCounterLabel, ACCounterSpeed } from '../components/counter';
import { ACRegulator } from '../components/regulatorscomp';
import { ACSwitch } from '../components/switch';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { useForm, Controller } from 'react-hook-form';
import { calculateHandPercent } from '../utils/calculate';
import { debounce } from 'lodash';
import { useReedRecipeMutation } from '../api/recipeApi';
import { toast } from 'react-toastify';
import { useRenameRecipeMutation } from '../api/renameRecipeApi';
import { useDeleteRecipeMutation } from '../api/deleteRecipeApi';
import { useDisableLiProcess } from '../hooks/useDisableLiProcess';
import { useMashingSaveMutation } from '../api/mashingSaveApi';
import { useTranslation } from 'react-i18next';
import '../styles/process_page.css';
import '../styles/styles.css';

type FormData = {
  mashingPauses: number;
  mashingHeat: boolean;
  mashingHeatTemp: number;
  mashingHeatPower: number;
  mashingHeatTime: number;
  mashingCool: boolean;
  mashingCoolTemp: number;
  mashingCoolGyst: number;

  mashingTemp0: number;
  mashingTemp1: number;
  mashingTemp2: number;
  mashingTemp3: number;
  mashingTemp4: number;
  mashingTemp5: number;
  mashingTemp6: number;
  mashingTemp7: number;
  mashingTemp8: number;
  mashingTemp9: number;
  mashingGyst0: number;

  mashingGyst1: number;
  mashingGyst2: number;
  mashingGyst3: number;
  mashingGyst4: number;
  mashingGyst5: number;
  mashingGyst6: number;
  mashingGyst7: number;
  mashingGyst8: number;
  mashingGyst9: number;

  mashingTime0: number;
  mashingTime1: number;
  mashingTime2: number;
  mashingTime3: number;
  mashingTime4: number;
  mashingTime5: number;
  mashingTime6: number;
  mashingTime7: number;
  mashingTime8: number;
  mashingTime9: number;
};

type MashingType = `mashing${'Temp' | 'Gyst' | 'Time'}${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

const MashingProcessPage = () => {
  const key = localStorage.getItem('samogonKey');
  const [isFormChanging, setIsFormChanging] = useState(false);
  const [save] = useMashingSaveMutation();
  const [recipeName, setRecipeName] = useState('');
  const [recipeNumber, setRecipeNumber] = useState(0);
  const [reedRecipes] = useReedRecipeMutation();
  const [renameRecipe] = useRenameRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();

  const { t, i18n } = useTranslation();

  const pageRecipe = () => {
    return {
      key: key,
      w: 3,
    };
  };

  const [listRecipe, setListRecipe] = useState<string[]>([]);
  const [countRecipe, setCountRecipe] = useState(0);

  const fetchRecipe = async () => {
    const respons = await reedRecipes(pageRecipe());
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
      w: 3,
      r: recipeNumber,
      n: recipeName,
    };
  }, [recipeName, recipeNumber]);

  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(pageRecipeData, { pollingInterval: isFormChanging ? 0 : SYNC_INTERVAL });

  const handleScenarioChange = (label: string, value: number) => {
    setRecipeName(label);
    setRecipeNumber(value);
  };

  const { control, watch } = useForm<FormData>({
    values: {
      mashingPauses: data.mashingPauses,
      mashingHeat: !!data.mashingHeat,
      mashingHeatTemp: data.mashingHeatTemp,
      mashingHeatPower: data.mashingHeatPower,
      mashingHeatTime: data.mashingHeatTime,
      mashingCool: !!data.mashingCool,
      mashingCoolTemp: data.mashingCoolTemp,
      mashingCoolGyst: data.mashingCoolGyst,

      mashingTemp0: data.mashingTemp0,
      mashingTemp1: data.mashingTemp1,
      mashingTemp2: data.mashingTemp2,
      mashingTemp3: data.mashingTemp3,
      mashingTemp4: data.mashingTemp4,
      mashingTemp5: data.mashingTemp5,
      mashingTemp6: data.mashingTemp6,
      mashingTemp7: data.mashingTemp7,
      mashingTemp8: data.mashingTemp8,
      mashingTemp9: data.mashingTemp9,

      mashingGyst0: data.mashingGyst0,
      mashingGyst1: data.mashingGyst1,
      mashingGyst2: data.mashingGyst2,
      mashingGyst3: data.mashingGyst3,
      mashingGyst4: data.mashingGyst4,
      mashingGyst5: data.mashingGyst5,
      mashingGyst6: data.mashingGyst6,
      mashingGyst7: data.mashingGyst7,
      mashingGyst8: data.mashingGyst8,
      mashingGyst9: data.mashingGyst9,

      mashingTime0: data.mashingTime0,
      mashingTime1: data.mashingTime1,
      mashingTime2: data.mashingTime2,
      mashingTime3: data.mashingTime3,
      mashingTime4: data.mashingTime4,
      mashingTime5: data.mashingTime5,
      mashingTime6: data.mashingTime6,
      mashingTime7: data.mashingTime7,
      mashingTime8: data.mashingTime8,
      mashingTime9: data.mashingTime9,
    },
  });

  const formatFormData = (formValues: FormData) => {
    return {
      key: key,
      e: recipeNumber,
      n: recipeName,
      m: mashCommand,
      p: formValues.mashingPauses,
      h: formValues.mashingHeat ? 1 : 0,
      c: formValues.mashingCool ? 1 : 0,
      t1: formValues.mashingTemp0,
      t2: formValues.mashingTemp1,
      t3: formValues.mashingTemp2,
      t4: formValues.mashingTemp3,
      t5: formValues.mashingTemp4,
      t6: formValues.mashingTemp5,
      t7: formValues.mashingTemp6,
      t8: formValues.mashingTemp7,
      t9: formValues.mashingTemp8,
      t10: formValues.mashingTemp9,
      g1: formValues.mashingGyst0,
      g2: formValues.mashingGyst1,
      g3: formValues.mashingGyst2,
      g4: formValues.mashingGyst3,
      g5: formValues.mashingGyst4,
      g6: formValues.mashingGyst5,
      g7: formValues.mashingGyst6,
      g8: formValues.mashingGyst7,
      g9: formValues.mashingGyst8,
      g10: formValues.mashingGyst9,
      v1: formValues.mashingTime0,
      v2: formValues.mashingTime1,
      v3: formValues.mashingTime2,
      v4: formValues.mashingTime3,
      v5: formValues.mashingTime4,
      v6: formValues.mashingTime5,
      v7: formValues.mashingTime6,
      v8: formValues.mashingTime7,
      v9: formValues.mashingTime8,
      v10: formValues.mashingTime9,
      tV: formValues.mashingHeatTemp,
      pV: formValues.mashingHeatPower,
      vV: formValues.mashingHeatTime,
      tC: formValues.mashingCoolTemp,
      gC: formValues.mashingCoolGyst,
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

  const howMuchPause = watch('mashingPauses');
  const hasMashingHeat = watch('mashingHeat');
  const isFreezeMode = watch('mashingCool');

  const [dialogCreateVisible, setDialogCreateVisible] = useState(false);
  const [dialogRenameVisible, setDialogRenameVisible] = useState(false);
  const [dialogDeleteVisible, setDialogDeleteVisible] = useState(false);
  const [dialogDownloadVisible, setDialogDownloadVisible] = useState(false);
  const [disabledButtonRecipe, setDisabledButtonRecipe] = useState(true);

  useDisableLiProcess(data);
  const [startLabel, setStartLabel] = useState(t('process_start1'));
  const [passLabel, setPassLabel] = useState(t('process_skip'));
  const [mashCommand, setMashCommand] = useState(0);
  const [hideButtonStart, setHideButtonStart] = useState(false);
  const [hideButtonSkip, setHideButtonSkip] = useState(false);
  const [disabledButtonSkip, setDisabledButtonSkip] = useState(false);
  const updateCommandControls = useCallback(() => {
    if (data.version != 0) {
      setStartLabel(mashCommand > 0 ? t('process_start2') : t('process_start1'));

      switch (data.mashingController) {
        case 11:
          setPassLabel(t('status_start_boiling'));
          break;
        case 12:
          setPassLabel(t('process_skip'));
          break;
        case 13:
          setPassLabel(t('status_start_cooling'));
          break;
        default:
          setPassLabel(t('process_skip'));
          break;
      }

      if (countRecipe === 0 && data.mashingController >= 1 && data.mashingController <= 14 && mashCommand != 0) {
        setDisabledButtonSkip(false);
      } else {
        setDisabledButtonSkip(true);
      }
    }
  }, [data.mashingController, data.version, i18n.language]);

  useEffect(() => {
    updateCommandControls();
  }, [updateCommandControls]);

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

  const clickPass = async () => {
    if (data.mashingController > 0 && data.mashingController < howMuchPause) {
      setMashCommand(mashCommand + 1);
    } else if (data.mashingController <= 10) {
      if (hasMashingHeat) {
        setMashCommand(11);
      } else if (isFreezeMode) {
        setMashCommand(13);
      } else {
        setMashCommand(0);
      }
    } else if (data.mashingController === 11) {
      setMashCommand(12);
    } else if (data.mashingController === 12) {
      if (isFreezeMode) {
        setMashCommand(13);
      } else {
        setMashCommand(0);
      }
    } else if (data.mashingController === 13) {
      setMashCommand(14);
    } else if (data.mashingController === 14) {
      setMashCommand(0);
    }
  };

  const clickStart = async () => {
    if (mashCommand === 0) {
      if (howMuchPause > 0) {
        setMashCommand(1);
      } else if (hasMashingHeat) {
        setMashCommand(12);
      } else if (isFreezeMode) {
        setMashCommand(14);
      } else {
        setMashCommand(0);
      }
    }
  };

  const checkMashingState = useCallback(() => {
    if (data.version != 0 && mashCommand != data.mashingController) {
      if (data.f) {
        setMashCommand(data.mashingController);
        if (mashCommand === 15) {
          setMashCommand(0);
        }
      }
    }
  }, [data.mashingHeat, data.mashingCool, data.mashingController, data.f, data.version, mashCommand]);

  useEffect(() => {
    checkMashingState();
  }, [checkMashingState]);

  const [status, setStatus] = useState('');

  const statusUpdate = useCallback(() => {
    let updateStatus = '';

    switch (data.mashingController) {
      case 0:
        updateStatus = t('status_waiting');
        break;
      case 11:
        updateStatus = t('status_waiting_boiling');
        break;
      case 12:
        updateStatus = `${t('status_boiling')} ${data.mashingHeatPower}% - ${data.mashingVarkaMinute} ${t('unit_minutes')}`;
        break;
      case 13:
        updateStatus = t('status_waiting_cooling');
        break;
      case 14:
        updateStatus = `${t('status_cooling')} ${data.mashingCoolTemp}°`;
        break;
      default:
        if (data.mashingController <= 10) {
          const mashingTemps = [
            data.mashingTemp0,
            data.mashingTemp1,
            data.mashingTemp2,
            data.mashingTemp3,
            data.mashingTemp4,
            data.mashingTemp5,
            data.mashingTemp6,
            data.mashingTemp7,
            data.mashingTemp8,
            data.mashingTemp9,
          ];
          const temp = mashingTemps[data.mashingController - 1];

          updateStatus = `${t('status_pause_number')} ${data.mashingController} - ${temp}°`;
        } else {
          updateStatus = t('status_completed');
        }
        break;
    }
    switch (data.errorMashing) {
      case 0:
        updateStatus += t('status_success');
        break;
      case 1:
        updateStatus = t('status_error_cube');
        break;
      default:
        break;
    }
    setStatus(updateStatus);
  }, [
    data.mashingController,
    data.errorMashing,
    data.mashingVarkaMinute,
    data.mashingHeatPower,
    data.mashingCoolTemp,
    data.mashingTemp0,
    data.mashingTemp1,
    data.mashingTemp2,
    data.mashingTemp3,
    data.mashingTemp4,
    data.mashingTemp5,
    data.mashingTemp6,
    data.mashingTemp7,
    data.mashingTemp8,
    data.mashingTemp9,
  ]);

  useEffect(() => {
    statusUpdate();
  }, [statusUpdate]);

  const [newRecipeName, setNewRecipeName] = useState('');
  const recipeRename = async () => {
    if (!newRecipeName.trim()) {
      toast.error(t('scenario_rename_error1'));
    } else if (listRecipe.includes(newRecipeName)) {
      toast.warning(t('scenario_name_error'));
    } else {
      const recipeData = {
        key: key,
        w: 3,
        n1: recipeName,
        n2: newRecipeName,
      };
      await renameRecipe(recipeData);
      await fetchRecipe();
      setDialogRenameVisible(false);
      setNewRecipeName('');
      toast.success(t('scenario_rename_success' + newRecipeName));
    }
  };

  const recipeDelete = async () => {
    const recipeData = {
      key: key,
      w: 3,
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

  const [nameCreateRecipe, setNameCreateRecipe] = useState('');

  const recipeCreate = async () => {
    if (!nameCreateRecipe.trim()) {
      toast.error(t('scenario_rename_error1'));
    } else if (listRecipe.includes(nameCreateRecipe)) {
      toast.warning(t('scenario_name_error'));
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
      toast.success(t('scenario_create_success'));
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
    toast.success(t('scenario_download_success'));
  };

  if (isLoading || data.version == 0) return <p>{t('loading')}</p>;
  if (error) return <p>{t('loading_error')}</p>;

  const generatePauseBlocks = () => {
    const blocks = [];
    const knobColors = ['orange', 'blue', 'purple', 'red'];
    const sliderColors = ['purple', 'orange', 'red', 'blue'];

    for (let i = 0; i <= howMuchPause - 1; i++) {
      const knobColor = knobColors[i % knobColors.length] as 'orange' | 'blue' | 'purple' | 'red';
      const sliderColor = sliderColors[i % sliderColors.length] as 'orange' | 'blue' | 'purple' | 'red';

      const numberTemp: MashingType = `mashingTemp${i}` as MashingType;
      const numberGyst: MashingType = `mashingGyst${i}` as MashingType;
      const numberTime: MashingType = `mashingTime${i}` as MashingType;

      blocks.push(
        <div key={i} className="col-6">
          <div className="flex flex-column align-items-center justify-content-center block pb-3">
            <Controller
              name={numberTemp}
              control={control}
              render={({ field: { onChange: onChangeForm, value } }) => (
                <ACKnob
                  label={`${t('process_mashing_temp_pause')} ${i + 1}`}
                  color={knobColor}
                  initialValue={value}
                  help={t('help_temp_pause')}
                  onChange={(e) => onChangeForm(e.value)}
                  hint="temp_step0.1_max120"
                />
              )}
            />
            <Controller
              name={numberGyst}
              control={control}
              render={({ field: { onChange: onChangeForm, value } }) => (
                <ACSlider
                  label={`${t('process_mashing_gist_pause')} ${i + 1}`}
                  color={sliderColor}
                  initialValue={value}
                  help={t('help_gist_pause')}
                  onChange={(e) => onChangeForm(e.value)}
                  hint="temp_step0.1_max10"
                />
              )}
            />
            <Controller
              name={numberTime}
              control={control}
              render={({ field: { onChange: onChangeForm, value } }) => (
                <ACCounterLabel
                  label={`${t('process_mashing_time_pause')} ${i + 1}`}
                  value={value}
                  units={t('unit_minutes')}
                  hint="time_step1_max240"
                  help={t('help_time_pause')}
                  onChange={(e) => onChangeForm(e.value)}
                />
              )}
            />
          </div>
        </div>,
      );
    }
    return blocks;
  };

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
        <div className="flex flex-column w-3/4">
          <div className="grid grid-cols-2 w-full">
            <div className="col-6">
              <ACBlockTempSmall
                name={t('cube')}
                color="purple"
                temp={String(data.tempCube)}
                help={t('help_temp_cube')}
              />
            </div>
            <div className="col-6">
              <ACBlockTempSmall
                name={t('carga')}
                color="orange"
                temp={String(data.tempCargi)}
                help={t('help_temp_cargi')}
              />
            </div>
            <div className="col-6">
              <ACBlockTempSmall name={t('defl')} color="red" temp={String(data.tempDef)} help={t('help_temp_defl')} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall
                name={t('water')}
                color="blue"
                temp={String(data.tempWater)}
                help={t('help_temp_water')}
              />
            </div>
          </div>
          <div
            className="flex flex-column align-items-start justify-content-start w-full custom-scrollbar2"
            style={{ maxHeight: '400px', maxWidth: '545px', overflowY: 'auto', borderRadius: '30px' }}
          >
            <div className="flex flex-column align-items-center justify-content-center w-full">
              <div className="grid grid-cols-2 w-full">{generatePauseBlocks()}</div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-column gap-3 flex-grow align-items-start justify-content-start w-3/4 custom-scrollbar"
          style={{ maxHeight: '658px', overflowY: 'auto', width: '80%', borderRadius: '12px', paddingRight: '4px' }}
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
                <Button label={passLabel} className="button-skip" disabled={disabledButtonSkip} onClick={clickPass} />
              )}
              {!hideButtonStart && <Button label={startLabel} className="button-start" onClick={clickStart} />}
            </div>
          </div>
          <div className="block p-3  w-full">
            <h3>{t('process_mashing_pauses_header')}</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="mashingPauses"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="list"
                    label={t('process_mashing_pauses_number')}
                    value={value}
                    units=" "
                    hint="pauses"
                    help={t('help_pauses')}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
          </div>
          <div className="block p-3  w-full">
            <h3>{t('process_mashing_boiling')}</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="temp_plus" label={t('process_mashing_boiling')} help={t('help_temp_brew')} />
              <Controller
                name="mashingHeat"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="mashingHeatTemp"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp"
                    label={t('process_mashing_temp_boiling')}
                    units="°C"
                    hint="temp_step0.1_max120"
                    value={value}
                    help={t('help_temp_brew')}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={!hasMashingHeat}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="mashingHeatPower"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="ten"
                    label={t('process_mashing_power_boiling')}
                    units="%"
                    value={value}
                    help={t('help_power_brew')}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={!hasMashingHeat}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="mashingHeatTime"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="timer"
                    label={t('process_mashing_time_boiling')}
                    units={t('unit_minutes')}
                    hint="time_step1_max240"
                    value={value}
                    help={t('help_time_brew')}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={!hasMashingHeat}
                  />
                )}
              />
            </div>
          </div>
          <div className="block p-3  w-full">
            <h3>{t('process_mashing_cooling')}</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="temp_minus" label={t('process_mashing_cooling')} help={t('help_temp_freeze')} />
              <Controller
                name="mashingCool"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACSwitch checked={value} onChange={(checked) => onChangeForm(checked)} />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="mashingCoolTemp"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp"
                    label={t('process_mashing_temp_cooling')}
                    units="°C"
                    hint="temp_step0.1_max120"
                    value={value}
                    help={t('help_temp_freeze')}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={!isFreezeMode}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="mashingCoolGyst"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp_minus"
                    label={t('process_mashing_gist_cooling')}
                    units="°C"
                    hint="temp_step0.1_max10"
                    value={value}
                    help={t('help_gist_freeze')}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={!isFreezeMode}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog
        header={t('scenario_dialog_create')}
        visible={dialogCreateVisible}
        onHide={() => setDialogCreateVisible(false)}
        className="dialog"
        footer={
          <div className="flex justify-content-evenly">
            <Button
              label={t('button_cancel')}
              icon="pi pi-times"
              onClick={() => setDialogCreateVisible(false)}
              className="button-cancel"
            />
            <Button
              label={t('button_confirm')}
              icon="pi pi-check"
              onClick={recipeCreate}
              className="button-confirm"
              autoFocus
            />
          </div>
        }
      >
        <div className="field flex justify-content-center">
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
        className="dialog"
        footer={
          <div className="flex justify-content-evenly">
            <Button
              label={t('button_cancel')}
              icon="pi pi-times"
              onClick={() => setDialogRenameVisible(false)}
              className="button-cancel"
            />
            <Button
              label={t('button_confirm')}
              icon="pi pi-check"
              onClick={recipeRename}
              className="button-confirm"
              autoFocus
            />
          </div>
        }
      >
        <div className="field flex justify-content-center">
          <InputText
            id="rename-scenario"
            style={{ width: '80%' }}
            value={recipeName}
            onChange={(e) => setNewRecipeName(e.target.value)}
          />
        </div>
      </Dialog>

      <Dialog
        header={t('scenario_dialog_delete')}
        visible={dialogDeleteVisible}
        onHide={() => setDialogDeleteVisible(false)}
        className="dialog"
        footer={
          <div className="flex justify-content-evenly">
            <Button
              label={t('button_cancel')}
              icon="pi pi-times"
              onClick={() => setDialogDeleteVisible(false)}
              className="button-cancel"
            />
            <Button
              label={t('button_confirm')}
              icon="pi pi-check"
              onClick={recipeDelete}
              className="button-confirm"
              autoFocus
            />
          </div>
        }
      >
        <p>
          {t('scenario_dialog_name')} {recipeName}
        </p>
      </Dialog>

      <Dialog
        header={recipeName}
        visible={dialogDownloadVisible}
        onHide={() => setDialogDownloadVisible(false)}
        className="dialog"
        footer={
          <div className="flex justify-content-evenly">
            <Button
              label={t('button_cancel')}
              icon="pi pi-times"
              onClick={() => setDialogDownloadVisible(false)}
              className="button-cancel"
            />
            <Button
              label={t('button_confirm')}
              icon="pi pi-check"
              onClick={recipeDownload}
              className="button-confirm"
              autoFocus
            />
          </div>
        }
      >
        <p>{t('scenarion_question')}</p>
      </Dialog>
    </>
  );
};

export default MashingProcessPage;
