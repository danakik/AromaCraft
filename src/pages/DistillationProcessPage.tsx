import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ACBlockTemp } from '../components/blocktemp';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACScriptComp } from '../components/scriptcomp';
import { ACIconButton } from '../components/iconbutton';
import { ACKnob } from '../components/knob';
import { ACRegulator } from '../components/regulatorscomp';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useForm, Controller } from 'react-hook-form';
import { debounce, identity, set } from 'lodash';
import { useReedRecipeMutation } from '../api/recipeApi';
import { toast } from 'react-toastify';
import { useRenameRecipeMutation } from '../api/renameRecipeApi';
import { useDeleteRecipeMutation } from '../api/deleteRecipeApi';
import { useDistillationSaveMutation } from '../api/distillationSave';
import { useDisableLiProcess } from '../hooks/useDisableLiProcess';

type FormData = {
  distTempPower: number;
  distCubeHead: number;
  distAcceleration: number;
  distPowerBody: number;
  distPower: number;
  distTimeBody: number;
  distTempError: number;
  distTempStop: number;
  distCubeSwitch: boolean;
};

const DistillationProcessPage = () => {
  const [reedRecipes] = useReedRecipeMutation();
  const [renameRecipe] = useRenameRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [isFormChanging, setIsFormChanging] = useState(false);
  const [save] = useDistillationSaveMutation();

  const key = localStorage.getItem('samogonKey');

  const pageRecipe = () => {
    return {
      key: key,
      w: 1, // 1 - distillation
    };
  };

  const [listRecipe, setListRecipe] = useState<string[]>([]);
  const [countRecipe, setCountRecipe] = useState(0);

  const fetchRecipe = async () => {
    // This function is used to get recipes for a page and their quantity
    const response = await reedRecipes(pageRecipe());
    const { recipeList, recipeCount } = response.data;
    setListRecipe(recipeList);
    setCountRecipe(recipeCount);
  };

  useEffect(() => {
    fetchRecipe();
  }, []);

  const [recipeName, setRecipeName] = useState('');
  const [recipeNumber, setRecipeNumber] = useState(0);

  const handleScenarioChange = (label: string, value: number) => {
    // when changing a recipe, we take its name and serial number
    setRecipeName(label);
    setRecipeNumber(value);
  };

  const pageRecipeData = useMemo(() => {
    // Data object for getting recipe settings
    return {
      key: key,
      w: 1,
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
  const { control, watch } = useForm<FormData>({
    values: {
      distTempPower: data.distTempPower,
      distCubeHead: data.distCubeHead,
      distAcceleration: data.distAcceleration,
      distPowerBody: data.distPowerBody,
      distPower: data.distPower,
      distTimeBody: data.distTimeBody,
      distTempError: data.distTempError,
      distTempStop: data.distTempStop,
      distCubeSwitch: !!data.distCubeSwitch,
    },
  });

  const formatFormData = (formValues: FormData) => {
    return {
      key: key,
      r: recipeNumber,
      n: recipeName,
      d: distCommand,
      pR: formValues.distAcceleration,
      pO: formValues.distPower,
      tR: formValues.distTempPower,
      tO: formValues.distTempStop,
      tA: formValues.distTempError,
      pB: formValues.distPowerBody,
      tB: formValues.distTimeBody,
      dS: formValues.distCubeSwitch ? 1 : 0,
      dH: formValues.distCubeHead,
    };
  };

  const formValues = watch();
  const prevFormValues = useRef(formValues);

  useEffect(() => {
    //dontSendPass(); //find out why and set it correctly

    // if the form does not match the last save, set the "changes" flag
    if (JSON.stringify(formValues) !== JSON.stringify(prevFormValues.current)) {
      setIsFormChanging(true);
      prevFormValues.current = formValues;
    }

    const debouncedLog = debounce(() => {
      const formattedData = formatFormData(formValues);
      //protection against children
      /* console.log(formattedData);
      save(formattedData);*/

      setIsFormChanging(false);
    }, 5000);

    if (isFormChanging) {
      debouncedLog();
    }

    return () => {
      debouncedLog.cancel();
    };
  }, [formValues, isFormChanging]);

  const [disabledBody, setDisabledBody] = useState(true);
  const [disabledPowers, setDisabledPowers] = useState(false);
  const [disabledTime, setDisabledTime] = useState(true);
  const [swithBody, setSwithBody] = useState(true);
  const [strHead, setStrHead] = useState('');
  const timeBody = watch('distTimeBody');
  const cubeSwith = watch('distCubeSwitch');

  const handleBodyState = useCallback(() => {
    if (data.version !== 0) {
      if ((data.version >= 3.3 && data.version < 4.0) || data.version >= 4.3) {
        setDisabledTime(cubeSwith);
        setDisabledBody(!cubeSwith);
      }
      if ((data.version >= 3.3 && data.version < 4) || data.version >= 4.3) {
        setSwithBody(false);
      } else {
        setSwithBody(true);
      }
      if (data.version < 3.2 || data.version === 4 || data.version === 4.1 || (timeBody === 0 && !cubeSwith)) {
        setStrHead('');
        setDisabledPowers(true);
      } else {
        setStrHead(' голів');
        setDisabledPowers(false);
      }
    }
  }, [data.version, cubeSwith, timeBody]);

  useEffect(() => {
    handleBodyState();
  }, [handleBodyState]);

  const [distCommand, setDistCommand] = useState(0);
  const [startLabel, setStartLabel] = useState('СТАРТ');
  const [hideButtonStart, setHideButtonStart] = useState(false);
  const [hideButtonSkip, setHideButtonSkip] = useState(false);
  const [disabledButtonSkip, setDisabledButtonSkip] = useState(false);

  const updateCommandControls = useCallback(() => {
    if (data.version != 0) {
      // Updates the state of the start button
      setStartLabel(distCommand > 0 ? 'СТОП' : 'СТАРТ');

      // Updates distCommand based on controller state and conditions.
      if (
        (distCommand !== data.distController && distCommand === 2) ||
        !(distCommand === 2 && data.distController === 2 && timeBody > 0 && data.k3 === 0)
      ) {
        if (data.f === 0) {
          setDistCommand(data.distController);
          if (distCommand === 4) setDistCommand(0);
        }
      }

      // Enables the "Skip" button if the conditions are met
      if (
        countRecipe === 0 && //or the number of recipes or what recipe
        data.distController >= 1 &&
        data.distController <= 4 &&
        data.distController != 3 &&
        distCommand != 0
      ) {
        setDisabledButtonSkip(false);
      } else {
        setDisabledButtonSkip(true);
      }
    }
  }, [distCommand, data.distController, timeBody, data.k3, data.f, countRecipe, data.version]);

  useEffect(() => {
    updateCommandControls();
  }, [updateCommandControls]);
  const [dialogCreateVisible, setDialogCreateVisible] = useState(false);
  const [dialogRenameVisible, setDialogRenameVisible] = useState(false);
  const [dialogDeleteVisible, setDialogDeleteVisible] = useState(false);
  const [dialogDownloadVisible, setDialogDownloadVisible] = useState(false);

  const [disabledButtonRecipe, setdisabledButtonRecipe] = useState(true);

  const updateRecipeControls = useCallback(() => {
    // If not "Automatic" then disable the ability to start, skip.
    // And if "Automatic" disable the ability to delete the recipe
    if (recipeNumber === 0) {
      setdisabledButtonRecipe(true);
      setHideButtonStart(false);
      setHideButtonSkip(false);
    } else {
      setdisabledButtonRecipe(false);
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
      toast.error('Введіть назву рецепта'); // Error if field is empty
      return;
    } else if (listRecipe.includes(newRecipeName)) {
      toast.warning('Рецепт з такою назвою вже існує'); // Warning if name is already taken
      return;
    } else {
      // Data object for renaming a recipe
      const recipeData = {
        key: key, // device key
        w: 1, // 1 - distillation
        n1: recipeName, // Current recipe name
        n2: newRecipeName, // New recipe name
      };

      await renameRecipe(recipeData); // api call for recipe rename
      await fetchRecipe(); // api call for new recipe list
      setDialogRenameVisible(false);
      setNewRecipeName('');
      toast.success('Назва рецепта змінена на: ' + newRecipeName);
    }
  };

  const recipeDelete = async () => {
    const recipeData = {
      key: key, // device key
      w: 1, // 1 - distillation
      n: recipeName, // Current recipe name
    };

    await deleteRecipe(recipeData); // api call for recipe delete
    await fetchRecipe(); // api call for new recipe list
    setDialogDeleteVisible(false);
    toast.success('Рецепт видалено');
  };

  const [nameCreateRecipe, setNameCreateRecipe] = useState('');

  const recipeCreate = async () => {
    if (!nameCreateRecipe.trim()) {
      toast.error('Введіть назву рецепта'); // Error if field is empty
      return;
    } else if (listRecipe.includes(nameCreateRecipe)) {
      toast.warning('Рецепт з такою назвою вже існує'); // Warning if name is already taken
      return;
    } else {
      // we take the form for saving page data
      const formattedData = formatFormData(formValues);
      // Data object for create a recipe
      const updatedData = {
        ...formattedData,
        n: nameCreateRecipe, // new recipe name
        r: Number(countRecipe) + 1, // max recipe number + 1
      };
      await save(updatedData); //api call for save distillation page
      await fetchRecipe(); // api call for new recipe list
      setDialogCreateVisible(false);
      setNameCreateRecipe('');
      toast.success('Рецепт створено');
    }
  };

  const recipeDownload = async () => {
    // we take the form for saving page data
    const formattedData = formatFormData(formValues);
    // Data object for dowaland recipe to 'Automation'
    const updatedData = {
      ...formattedData,
      n: 'Automation',
      r: 0, // 0 - Automation
    };
    await save(updatedData); //api call for save distillation page
    await fetchRecipe(); // api call for new recipe list
    setDialogDownloadVisible(false);
    toast.success('Рецепт завантажено');
  };

  const [status, setStatus] = useState('');

  const statusUpdate = useCallback(() => {
    let updateStatus = '';

    switch (data.distController) {
      case 0:
        updateStatus = 'Очікування';
        break;
      case 1:
        updateStatus = 'Розгін';
        break;
      case 2:
      case 4:
        if (timeBody > 0 || cubeSwith) {
          updateStatus = data.k3 === 1 ? 'Відбір голів' : 'Відбір тіла';
        } else {
          updateStatus = 'Відбір';
        }
        break;
      case 3:
        updateStatus = 'Зупинка';
        break;
      default:
        updateStatus = 'щось нове';
        break;
    }

    switch (data.distError) {
      case 0:
        updateStatus += ', помилок нема';
        break;
      case 1:
        updateStatus = 'Помилка t° куба';
        break;
      case 2:
        updateStatus = 'Помилка t° води';
        break;
      case 3:
        updateStatus = 'Помилка рівня';
        break;
      case 4:
        updateStatus = 'Помилка перегрів';
        break;
      default:
        updateStatus = 'Невідома помилка';
        break;
    }
    setStatus(updateStatus);
  }, [data.distError, data.distController, data.k3, timeBody, cubeSwith]);

  useEffect(() => {
    statusUpdate();
  }, [statusUpdate]);

  const clickPass = () => {
    if (data.distController === 1) {
      setDistCommand(2);
    } else if (data.distController === 2) {
      if (data.version < 3.2 || data.version === 4 || data.version === 4.1) {
        setDistCommand(3);
      } else {
        if (data.k3 === 1 && (timeBody > 0 || cubeSwith)) {
          setDistCommand(2);
        } else {
          setDistCommand(3);
        }
      }
    }
  };

  const clickStart = () => {
    if (distCommand === 0) {
      setDistCommand(1);
    } else {
      setDistCommand(0);
    }
  };

  const dontSendPass = () => {
    // I don't know if it's needed
    if (data.distController === 2) {
      if ((timeBody > 0 && !cubeSwith) || cubeSwith) {
        setDistCommand(4);
      }
    }
  };

  if (isLoading || data.version === 0) return <p>Завантаження...</p>;
  if (error) return <p>Помилка у завантаженні даних.</p>;

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
              <ACBlockTemp name="Куб" color="purple" temp={String(data.tempCube)} help={helpM.temp_cube_m} />
            </div>
            <div className="col-6">
              <ACBlockTemp name="Царга" color="orange" temp={String(data.tempCargi)} help={helpM.temp_cargi_m} />
            </div>
            <div className="col-6">
              <ACBlockTemp name="Дефлегматор" color="red" temp={String(data.tempDef)} help={helpM.temp_defl_m} />
            </div>
            <div className="col-6">
              <ACBlockTemp name="Вода" color="blue" temp={String(data.tempWater)} help={helpM.temp_water_m} />
            </div>
          </div>

          <div className="flex flex-row gap-3 p-2 w-full -mt-2">
            <div className="block flex-1 p-2 col-6">
              <Controller
                name="distTempPower"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACKnob
                    label={'Темп. переходу' + strHead}
                    color="red"
                    initialValue={value}
                    help={helpM.temp_transition_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
            <div className="block flex-1 p-2 col-6">
              <Controller
                name="distTempStop"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACKnob
                    color="purple"
                    label="Темп. зупинки"
                    initialValue={value}
                    help={helpM.temp_stop_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-column gap-3 w-1/4 align-items-start justify-content-start ">
          <div className="block p-3 w-full">
            <h3>Автоматика</h3>
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
                  label="Пропуск"
                  className="button-skip"
                  disabled={disabledButtonSkip} /* onClick={clickPass} */
                />
              )}
              {!hideButtonStart && <Button label={startLabel} className="button-start" /* onClick={clickStart} */ />}
            </div>
          </div>

          <div className="block p-3 w-full">
            <h3>Потужність</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="distAcceleration"
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
                name="distPowerBody"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="pid"
                    label="Потужність відбору тіла"
                    value={value}
                    units="%"
                    help={helpM.power_selection_body_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={disabledPowers}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="distPower"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="pid"
                    label={'Потужність відбору' + strHead}
                    value={value}
                    units="%"
                    help={helpM.power_selection_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
          </div>
          <div className="block p-3 w-full">
            <h3>Інше</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full">
              <ACRegulator icon="arrow_fork" label="Перехід тіла" help={helpM.temp_transition_body_m} />
              <Controller
                name="distCubeSwitch"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ToggleButton
                    className="custom-toggle-button"
                    checked={value}
                    onChange={(e) => onChangeForm(e.value)}
                    onLabel="Темп. КУБУ"
                    offLabel="Час"
                    disabled={swithBody}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="distCubeHead"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp"
                    label="Темп. переходу тіла"
                    value={value}
                    units="°C"
                    help={helpM.temp_transition_body_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={disabledBody}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="distTimeBody"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="time"
                    label="Час, хв. переходу тіла"
                    value={value}
                    units="хв"
                    help={helpM.time_body_transition_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={disabledTime}
                  />
                )}
              />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="distTempError"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="temp"
                    label="Температура аварії"
                    value={value}
                    units="°C"
                    help={helpM.temp_breakdown_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <Dialog
        header={'Створити новий сценарій'}
        visible={dialogCreateVisible}
        onHide={() => setDialogCreateVisible(false)}
        style={{ width: '500px' }}
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
        header={'Перейменувати сценарій'}
        visible={dialogRenameVisible}
        onHide={() => setDialogRenameVisible(false)}
        style={{ width: '500px' }}
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
        header={'Видалити сценарій'}
        visible={dialogDeleteVisible}
        onHide={() => setDialogDeleteVisible(false)}
        style={{ width: '500px' }}
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
              onClick={recipeDelete}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <p>Сценарій: {recipeName}</p>
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

export default DistillationProcessPage;
