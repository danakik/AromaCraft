import React, { useEffect, useState, useMemo, useRef } from 'react';
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
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { calculateHandPercent } from '../utils/calculate';
import { debounce } from 'lodash';
import { useReedReceptsMutation } from '../api/receptsApi';

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

  const [receptName, setReceptName] = useState('');
    const [receptNumber, setReceptNumber] = useState('');
    const [reedRecept] = useReedReceptsMutation();
  
    const pageRecept = () => {
      return {
        key: key,
        w: 3,
      };
    };
  
    const [listRecept, setListRecept] = useState([]);
  
    const fetchRecept = async () => {
      const respons = await reedRecept(pageRecept());
      setListRecept(respons.data);
    };
  
    useEffect(() => {
      fetchRecept();
    }, []);
  
  
    const pageReceptData = useMemo(() => {
      return {
        key: key,
        w: 3,
        r: receptNumber,
        n: receptName,
      };
    },[receptName, receptNumber]);
  
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

  const howMuchPause = watch('mashingPauses');
  const hasMashingHeat = watch('mashingHeat');
  const isFreezeMode = watch('mashingCool');

  const [dialogCreateVisible, setDialogCreateVisible] = useState(false);
  const [dialogRenameVisible, setDialogRenameVisible] = useState(false);
  const [dialogDeleteVisible, setDialogDeleteVisible] = useState(false);

  if (isLoading || data.version == 0) return <p>Завантаження...</p>;
  if (error) return <p>Помилка у завантаженні даних.</p>;

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
                  label={`Температура паузи ${i + 1}`}
                  color={knobColor}
                  initialValue={value}
                  help={helpM.temp_pause_m}
                  onChange={(e) => onChangeForm(e.value)}
                />
              )}
            />
            <Controller
              name={numberGyst}
              control={control}
              render={({ field: { onChange: onChangeForm, value } }) => (
                <ACSlider
                  label={`Гістерезис паузи ${i + 1}`}
                  color={sliderColor}
                  initialValue={value}
                  help={helpM.temp_selection_heads_m}
                  onChange={(e) => onChangeForm(e.value)}
                />
              )}
            />
            <Controller
              name={numberTime}
              control={control}
              render={({ field: { onChange: onChangeForm, value } }) => (
                <ACCounterLabel
                  label={`Час паузи ${i + 1}`}
                  value={value}
                  units="хв"
                  help={helpM.temp_pause_m}
                  onChange={(e) => onChangeForm(e.value)}
                />
              )}
            />
          </div>
        </div>
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
          <ACStatusComp status_text={'Очікування...'} />
        </div>
      </header>
      <div className="flex flex-row gap-2 w-full align-items-start justify-content-start">
        <div className="flex flex-column w-3/4">
          <div className="grid grid-cols-2 w-full">
            <div className="col-6">
              <ACBlockTempSmall name="Куб" color="purple" temp={String(data.tempCube)} help={helpM.temp_cube_m} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall name="Царга" color="orange" temp={String(data.tempCargi)} help={helpM.temp_cargi_m} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall name="Дефлегматор" color="red" temp={String(data.tempDef)} help={helpM.temp_defl_m} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall name="Вода" color="blue" temp={String(data.tempWater)} help={helpM.temp_water_m} />
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
            <h3>Автоматика</h3>
            <div className="flex align-items-center justify-content-center">
              <ACScriptComp options={listRecept} onChange={handleScenarioChange} />
              <ACIconButton iconName="edit" onClick={() => setDialogRenameVisible(true)} />
              <ACIconButton iconName="doc_download" onClick={() => console.log('DocD clicked')} />
              <ACIconButton iconName="doc_add" onClick={() => setDialogCreateVisible(true)} />
              <ACIconButton iconName="delete" onClick={() => setDialogDeleteVisible(true)} />
            </div>
            <div className="flex align-items-center justify-content-center">
              <Button label="Пропуск" className="button-skip" />
              <Button label="Старт" className="button-start" />
            </div>
          </div>
          <div className="block p-3  w-full">
            <h3>Паузи</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <Controller
                name="mashingPauses"
                control={control}
                render={({ field: { onChange: onChangeForm, value } }) => (
                  <ACRegulator
                    icon="list"
                    label="Кількість пауз"
                    value={value}
                    units=" "
                    hint="pauses"
                    help={helpM.pauses_m}
                    onChange={(e) => onChangeForm(e.value)}
                  />
                )}
              />
            </div>
          </div>
          <div className="block p-3  w-full">
            <h3>Варка</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="temp_plus" label="Варка" help={helpM.temp_brew_m} />
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
                    label="Температура варки"
                    units="°C"
                    value={value}
                    help={helpM.temp_brew_m}
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
                    label="Потужність варки"
                    units="%"
                    value={value}
                    help={helpM.power_brew_m}
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
                    label="Час варки"
                    units="хв"
                    value={value}
                    help={helpM.time_brew_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={!hasMashingHeat}
                  />
                )}
              />
            </div>
          </div>
          <div className="block p-3  w-full">
            <h3>Охолодженння</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="temp_minus" label="Охолодження" help={helpM.temp_freeze_m} />
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
                    label="Температура охолодження"
                    units="°C"
                    value={value}
                    help={helpM.temp_freeze_m}
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
                    label="Гістерезис охолодження"
                    units="°C"
                    value={value}
                    help={helpM.temp_freeze_m}
                    onChange={(e) => onChangeForm(e.value)}
                    disabled={!isFreezeMode}
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

export default MashingProcessPage;
