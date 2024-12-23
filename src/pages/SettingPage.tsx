import React, { useState }  from 'react';
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

const SettingPage = () => {
  const key = localStorage.getItem('samogonKey');
  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(key ?? skipToken, { pollingInterval: SYNC_INTERVAL });

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка у завантаженні даних.</p>;

  const [checked, setChecked] = useState(false);

  return (
    <>
      <header className="mb-6">
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
                />
                 <ACCounterLabel
                  units="°C "
                  value={Number(1.1)}
                  label="Зміна темп. куба"
                  help={helpM.set_temp_cube_m}
                />
              </div>
              <div className="block col-6">
                <ACKnob
                  label="Темп. царги"
                  color="orange"
                  initialValue={Number(data.tempCargi)}
                  help={helpM.set_temp_cargi_m}
                />
                 <ACCounterLabel
                  units="°C "
                  value={Number(1.1)}
                  label="Зміна темп. царги"
                  help={helpM.set_temp_cargi_m}
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
                />
                <ACCounterLabel
                  units="°C "
                  value={Number(1.1)}
                  label="Зміна темп. дефл."
                  help={helpM.set_temp_defl_m}
                />
              </div>
              <div className="block col-6">
                <ACKnob
                  label="Темп. води"
                  color="blue"
                  initialValue={Number(data.tempWater)}
                  help={helpM.set_temp_water_m}
                />
                 <ACCounterLabel
                  units="°C "
                  value={Number(1.1)}
                  label="Зміна темп. води"
                  help={helpM.set_temp_water_m}
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
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <h3>Пристрій: </h3>
              <h3>DESKTOP-5253</h3>
            </div>
          </div>
          <div className="block p-2">
            <h3>Налаштування</h3>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="pid" label="Встановлення нагріву" help={helpM.set_warm_m} />
              <ToggleButton onLabel="Регул." offLabel="Розет." checked={checked} onChange={(e) => setChecked(e.value)} />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="ten" label="ТЕН" units="Вт" value={3000} help={helpM.set_ten_m} />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="antena_bars" label="Барометр" help={helpM.barometer_m} />
              <ACSwitch />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="valve_heads" label="Відбір голів" help={helpM.set_selection_heads_m} />
              <ToggleButton onLabel="Рівень" offLabel="Час" checked={checked} onChange={(e) => setChecked(e.value)} />
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="arrow_fork" label="Перемикач голів" help={helpM.set_change_heads_m} />
              <ToggleButton onLabel="Вбік" offLabel="Вниз"checked={checked} onChange={(e) => setChecked(e.value)}/>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator icon="select_valve" label="Встановлення відбору" help={helpM.set_selection_m} />
              <ToggleButton onLabel="л/г" offLabel="%" checked={checked} onChange={(e) => setChecked(e.value)}/>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
              <ACRegulator
                icon="speed"
                label="Швидкість при 20%"
                units="л/г"
                value={Number(0.25)}
                help={helpM.set_speed_20_m}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingPage;
