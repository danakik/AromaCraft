import React, { useState, useEffect, useMemo } from 'react';
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
import { debounce } from 'lodash';
import { useReedReceptsMutation } from '../api/receptsApi';

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
  const key = localStorage.getItem('samogonKey');

  const [receptName, setReceptName] = useState('');
  const [receptNumber, setReceptNumber] = useState('');
  const [reedRecept] = useReedReceptsMutation();

  const pageRecept = () => {
    return {
      key: key,
      w: 1,
    };
  };

  const [listRecept, setLsitRecept] = useState([]);

  const fetchRecept = async () => {
    const respons = await reedRecept(pageRecept());
    setLsitRecept(respons.data);
  };

  useEffect(() => {
    fetchRecept();
  }, []);

  const pageReceptData = useMemo(() => {
    return {
      key: key,
      w: 1,
      r: receptNumber,
      n: receptName,
    };
  }, [receptName, receptNumber]);

  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(pageReceptData, { pollingInterval: SYNC_INTERVAL });

  const handleScenarioChange = (label: string, value: string) => {
    setReceptName(label);
    setReceptNumber(value);
  };

  useEffect(() => {
    if (receptName !== '') {
      console.log(pageReceptData);
    }
  }, [receptName]);

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

  const [disabledBody, setdisabledBody] = useState(false);
  const [disabledPowers, setdisabledPowers] = useState(true);
  const [disabledTime, setdisabledTime] = useState(true);
  const [swithBody, setSwithBody] = useState(true);
  const [strHead, setstrHead] = useState('');
  const timeBody = watch('distTimeBody');
  const cubeSwith = watch('distCubeSwitch');

  useEffect(() => {
    if (data.version !== 0) {
      if ((data.version >= 3.3 && data.version < 4.0) || data.version >= 4.3) {
        setSwithBody(false);
        if (cubeSwith) {
          setdisabledTime(true);
          setdisabledBody(false);
        } else {
          setdisabledTime(false);
          setdisabledBody(true);
        }
        if (timeBody === 0 && cubeSwith === false) {
          setdisabledPowers(true);
          setstrHead('');
        } else if ((timeBody != 0 && cubeSwith === false) || cubeSwith === true) {
          setdisabledPowers(false);
          setstrHead(' голів');
        }
      }
    }
  }, [data, timeBody, cubeSwith]);

  const [dialogCreateVisible, setDialogCreateVisible] = useState(false);
  const [dialogRenameVisible, setDialogRenameVisible] = useState(false);
  const [dialogDeleteVisible, setDialogDeleteVisible] = useState(false);

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
              <ACScriptComp options={listRecept} onChange={handleScenarioChange} />

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
      <Dialog header={"Створити новий сценарій"} visible={dialogCreateVisible} onHide={() => setDialogCreateVisible(false)} style={{ width: '500px' }}
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
              onClick={() => console.log("Створено новий сценарій")}
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
          />
        </div>
      </Dialog>

      <Dialog header={"Перейменувати сценарій"} visible={dialogRenameVisible} onHide={() => setDialogRenameVisible(false)} style={{ width: '500px' }}
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
              onClick={() => console.log("Перейменовано сценарій")}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <div className="field" style={{ display: 'flex', justifyContent: 'center' }}>
          <InputText
            id="rename-scenario"
            style={{ width: '80%' }}
          />
        </div>
      </Dialog>

      <Dialog header={"Видалити сценарій"} visible={dialogDeleteVisible} onHide={() => setDialogDeleteVisible(false)} style={{ width: '500px' }}
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
              onClick={() => console.log("Видалено сценарій")}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <p>Сценарій: </p>
      </Dialog>
    </>
  );
};

export default DistillationProcessPage;
