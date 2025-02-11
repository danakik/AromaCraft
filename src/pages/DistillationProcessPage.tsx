import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

  const key = localStorage.getItem('samogonKey');

  const pageRecipe = () => {
    return {
      key: key,
      w: 1,
    };
  };

  const [listRecipe, setListRecipe] = useState([]);
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
  const [recipeNumber, setRecipeNumber] = useState('');

  const handleScenarioChange = (label: string, value: string) => {
    setRecipeName(label);
    setRecipeNumber(value);
  };

  const pageRecipeData = useMemo(() => {
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
  } = useGetDataQuery(pageRecipeData, { pollingInterval: SYNC_INTERVAL });

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

  const [disabledBody, setDisabledBody] = useState(true);
  const [disabledPowers, setDisabledPowers] = useState(true);
  const [disabledTime, setDisabledTime] = useState(true);
  const [swithBody, setSwithBody] = useState(true);
  const [strHead, setStrHead] = useState('');
  const timeBody = watch('distTimeBody');
  const cubeSwith = watch('distCubeSwitch');

  const updateBodySwitch = useCallback(() => {
    if (data.version !== 0) {
      if ((data.version >= 3.3 && data.version < 4.0) || data.version >= 4.3) {
        setDisabledTime(cubeSwith);
        setDisabledBody(!cubeSwith);
      }
      if (data.version < 3.2 || data.version == 4 || data.version == 4.1 || (timeBody == 0 && cubeSwith == false)) {
        setDisabledPowers(true);
        setSwithBody(true);
        setStrHead('');
      } else {
        setSwithBody(false);
        setDisabledPowers(false);
        setStrHead(' голів');
      }
    }
  }, [data.version, cubeSwith, timeBody]);

  useEffect(() => {
    updateBodySwitch();
  }, [updateBodySwitch]);

  const [distCommand, setDistCommand] = useState(0);
  const [startLabel, setStartLabel] = useState('СТАРТ');
  const [hideButtonStart, setHideButtonStart] = useState(false);
  const [hideButtonSkip, setHideButtonSkip] = useState(false);
  const [disabledButtonStart, setDisabledButtonStart] = useState(false); // хай будэ
  const [disabledButtonSkip, setDisabledButtonSkip] = useState(false);

  const updateCommandControls = useCallback(() => {
    setStartLabel(distCommand > 0 ? 'СТОП' : 'СТАРТ');

    if (
      (distCommand != data.distController && distCommand == 2) ||
      !(distCommand == 2 && data.distController == 2 && timeBody > 0 && data.k3 == 0)
    ) {
      if (data.f == 0) {
        setDistCommand(data.distController);
        if (distCommand == 4) setDistCommand(0);
      }
    }

    if (
      countRecipe == 0 &&
      data.distController >= 1 &&
      data.distController <= 4 &&
      data.distController != 3 &&
      distCommand != 0
    ) {
      setDisabledButtonSkip(false);
    } else {
      setDisabledButtonSkip(true);
    }
  }, [distCommand, data.distController, timeBody, data.k3, data.f, countRecipe]);

  useEffect(() => {
    updateCommandControls();
  }, [updateCommandControls]);
  const [dialogCreateVisible, setDialogCreateVisible] = useState(false);
  const [dialogRenameVisible, setDialogRenameVisible] = useState(false);
  const [dialogDeleteVisible, setDialogDeleteVisible] = useState(false);

  const [disabledButtonRecipe, setdisabledButtonRecipe] = useState(true);

  const updateRecipeControls = useCallback(() => {
    if (recipeNumber == '0') {
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

  const recipeRename = async () => {
    const inputElement = document.getElementById('rename-scenario') as HTMLInputElement;
    if (inputElement.value === '') {
      toast.error('Введіть назву рецепта');
    } else {
      const recipeData = {
        key: key,
        w: 1,
        n1: recipeName,
        n2: inputElement.value,
      };
      try {
        await renameRecipe(recipeData);
        await fetchRecipe();
        setDialogRenameVisible(false);
        toast.success('Назва рецепта змінена на: ' + inputElement.value);
      } catch (error) {
        toast.error('Помилка при зміні назви рецепта');
        console.error(error);
      }
    }
  };

  const recipeDelete = async () => {
    const recipeData = {
      key: key,
      w: 1,
      n: recipeName,
    };
    try {
      await deleteRecipe(recipeData);
      await fetchRecipe();
      setDialogDeleteVisible(false);
      toast.success('Рецепт видалено');
    } catch (error) {
      toast.error('Помилка при видаленні рецепта');
      console.error(error);
    }
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
          updateStatus = data.k3 == 1 ? 'Відбір голів' : 'Відбір тіла';
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
    if (data.distController == 1) {
      setDistCommand(2);
    } else if (data.distController == 2) {
      if (data.version < 3.2 || data.version == 4 || data.version == 4.1) {
        setDistCommand(3);
      } else {
        if (data.k3 == 1 && (timeBody > 0 || cubeSwith)) {
          setDistCommand(2);
        } else {
          setDistCommand(3);
        }
      }
    }
  };

  const clickStart = () => {
    if(distCommand == 0) {
      setDistCommand(1);
    }else{
      setDistCommand(0);
    }
  }

  if (isLoading || data.version == 0) return <p>Завантаження...</p>;
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
              {!hideButtonSkip && <Button label="Пропуск" className="button-skip" disabled={disabledButtonSkip} />}
              {!hideButtonStart && <Button label={startLabel} className="button-start" />}

              {/* <Button label="++" onClick={() => { setDistCommand((prev) => prev + 1); console.log(distCommand); }} />
              <Button label="--" onClick={() => { setDistCommand((prev) => prev - 1); console.log(distCommand) }} /> */}
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
                    onLabel="Темп"
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
          <InputText id="rename-scenario" style={{ width: '80%' }} />
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
    </>
  );
};

export default DistillationProcessPage;
