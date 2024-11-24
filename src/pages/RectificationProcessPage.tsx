import React from 'react';
import { ACBlockTempSmall } from '../components/blocktemp';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { ACScriptComp } from '../components/scriptcomp';
import { ACIconButton } from '../components/iconbutton';
import { ACSlider } from '../components/knob';
import { ACCounterLabel } from '../components/counter';
import { ACRegulator } from '../components/regulatorscomp';
import { Button } from 'primereact/button';
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';

const RectificationProcessPage = () => {
  const key = localStorage.getItem('samogonKey');
  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(key ?? skipToken, { pollingInterval: SYNC_INTERVAL });

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка у завантаженні даних.</p>;

  return (
    <>
      <header className="mb-3">
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
              <ACBlockTempSmall name="Куб" color="purple" temp={String(data.tempCube)} help={helpM.temp_cube_m} />
            </div>
            <div className="col-6">
              <ACBlockTempSmall
                name="Царга"
                color="orange"
                temp={String(data.tempCargi)}
                help={helpM.temp_cargi_m}
              />
            </div>
            <div className="col-6">
              <ACBlockTempSmall
                name="Дефлегматор"
                color="red"
                temp={String(data.tempDef)}
                help={helpM.temp_defl_m}
              />
            </div>
            <div className="col-6">
              <ACBlockTempSmall
                name="Вода"
                color="blue"
                temp={String(data.tempWoter)}
                help={helpM.temp_water_m}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-3">
            <div className="col flex flex-col align-items-center justify-content-center gap-3 p-2 -mt-3">
              <div className="block col-6">
                <ACSlider
                  label="Темп. відбору голів"
                  color="blue"
                  initialValue={Number(95.2)}
                  help={helpM.temp_selection_heads_m}
                />
                <br />
                <ACCounterLabel
                  units=" °C"
                  value={Number(0.1)}
                  label="Гістерезіс"
                  help={helpM.gist_selection_heads_m}
                />
              </div>
              <div className="block col-6">
                <ACSlider
                  label="Темп. відбору тіла"
                  color="orange"
                  initialValue={Number(95.2)}
                  help={helpM.temp_selection_body_m}
                />
                <br />
                <ACCounterLabel units=" °C" value={Number(0.1)} label="Гістерезіс" help={helpM.gist_selection_body_m} />
              </div>
            </div>
            <div
              className="col flex flex-col align-items-center justify-content-center gap-3 p-2 -mt-2"
              style={{ height: '200px' }}
            >
              <div className="block col-6" style={{ height: '200px' }}>
                <ACSlider
                  label="Темп. відбору хвостів"
                  color="red"
                  initialValue={Number(95.2)}
                  help={helpM.temp_selection_tails_m}
                />
                <br />
                <ACCounterLabel
                  units="л/г"
                  value={Number(0.38)}
                  label="Швидкість"
                  help={helpM.speed_selection_tails_m}
                />
              </div>
              <div className="block col-6" style={{ height: '200px' }}>
                <ACSlider
                  label="Зменш. відбору tКУБ"
                  color="purple"
                  initialValue={Number(95.2)}
                  help={helpM.decrease_selection_m}
                />
                <br />
                <ACCounterLabel
                  units=""
                  value={Number(0.1)}
                  label="Зменш.шв.відб."
                  help={helpM.decrease_speed_selection_m}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-column gap-3 flex-grow align-items-start justify-content-start w-3/4"
          style={{
            maxHeight: '660px',
            overflowY: 'auto',
            width: '80%',
          }}
        >
          <div className="block p-3 w-full">
            <h3>Сценарій</h3>
            <div className="flex align-items-center justify-content-center">
              <ACScriptComp />
              <ACIconButton iconName="edit" onClick={() => console.log('Edit clicked')} />
              <ACIconButton iconName="doc_download" onClick={() => console.log('DocD clicked')} />
              <ACIconButton iconName="doc_add" onClick={() => console.log('DocAdd clicked')} />
              <ACIconButton iconName="delete" onClick={() => console.log('Delete clicked')} />
            </div>
            <div className="flex align-items-center justify-content-center">
              <Button label="Пропуск" style={{ backgroundColor: '#4980E5', borderColor: '#4980E5', color: '#fff' }} />
              <Button label="Старт" style={{ backgroundColor: '#58AC43', borderColor: '#58AC43', color: '#fff' }} />
            </div>
          </div>

          <div className="block p-4 w-full">
            <h3>Потужність</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="ten"
                label="Потужн.розгону"
                value={Number(65)}
                units="%"
                help={helpM.power_acceleration_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="ten"
                label="Потужн.відбору"
                value={Number(70)}
                units="%"
                help={helpM.power_selection_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="ten"
                label="Потужн.відбору(тіло)"
                value={Number(70)}
                units="%"
                help={helpM.power_selection_body_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="ten"
                label="Потужн.відбору(хвости)"
                value={Number(74)}
                units="%"
                help={helpM.power_selection_tails_m}
              />
            </div>
          </div>

          <div className="block p-4 w-full">
            <h3>Швидкість</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="speed"
                label="Шв. відбору (голів)"
                value={Number(0.01)}
                units="л/г"
                help={helpM.speed_selection_heads_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="speed"
                label="Шв. відбору (тіла)"
                value={Number(0.01)}
                units="л/г"
                help={helpM.speed_selection_body_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="speed"
                label="Шв. відбору (хвости)"
                value={Number(0.01)}
                units="л/г"
                help={helpM.speed_selection_tails_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="speed"
                color="red"
                label="Зменшення шв.царзі"
                value={Number(0.01)}
                units="л/г"
                help={helpM.decrease_speed_cargi_m}
              />
            </div>
          </div>

          <div className="block p-4 w-full">
            <h3>Цикли</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="list" label="Кількість циклів" value={Number(5)} units=" " help={helpM.cycles_m} />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="timer"
                label="Обмеження циклу"
                value={Number(1)}
                units="хв"
                help={helpM.border_cycles_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="sort"
                label="Зменшення по циклам"
                value={Number(0.01)}
                units="л/г"
                help={helpM.decrease_cycles_m}
              />
            </div>
          </div>

          <div className="block p-4 w-full">
            <h3>Інше</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="temp"
                color="white"
                label="Темп. переходу"
                value={Number(54)}
                units="°C"
                help={helpM.temp_transition_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="temp"
                color="white"
                label="Темп. відбору (хвостів)"
                value={Number(54)}
                units="°C"
                help={helpM.temp_selection_tails_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="temp"
                color="green"
                label="Темп. зупинки"
                value={Number(74)}
                units="°C"
                help={helpM.temp_stop_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="temp"
                color="red"
                label="Темп. аварії"
                value={Number(59)}
                units="°C"
                help={helpM.temp_breakdown_m}
              />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="temp_minus" label="Темп. зм. по царзі" help={helpM.temp_selection_cargi_m} />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="arrow_curve" label="Відбір хвостів" help={helpM.selection_tails_m} />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator icon="arrow_fork" label="Перехід на відбір тіла" help={helpM.transition_select_body_m} />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
              <ACRegulator
                icon="antena_bars"
                label="Стабілізація колони"
                value={Number(35)}
                units="хв"
                help={helpM.stabilisation_column_m}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RectificationProcessPage;
