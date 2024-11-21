import React, { useEffect, useState } from 'react';
import useSortedData from '../api/useSortedData';
import { ACBlockTempSmall } from "../components/blocktemp";
import { ACUserComp } from "../components/usercomp";
import { ACStatusComp } from "../components/statuscomp";
import { ACScriptComp } from "../components/scriptcomp";
import { ACIconButton } from "../components/iconbutton";
import { ACSlider } from "../components/knob";
import { ACCounterLabel } from "../components/counter";
import { ACRegulator } from "../components/regulatorscomp";
import { Button } from 'primereact/button';
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';

const RectificationProcessPage = () => {
    const [key, setKey] = useState<string | null>(null); 
    const { sortedData, error, isLoading, refetch } = useSortedData(key);

    useEffect(() => {
        const storedKey = localStorage.getItem('samogonKey');
        if (storedKey) {
            setKey(storedKey);
        }
    }, []);

    useEffect(() => {
        if (key) {
            refetch();
        }
    }, [key, refetch]);

    if (isLoading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка у завантаженні даних.</p>;



    return (
        <>
        <header className="mb-5">
            <div style={{float: 'right'}}><ACUserComp serial_number={key || ''}/></div>
            <div style={{float: 'left'}}><ACStatusComp status_text={'Очікування...'}/></div>
        </header>
        <div className="flex flex-row gap-2 w-full align-items-start justify-content-start">
    <div className="flex flex-column w-1/4">
        <div className="grid grid-cols-2 w-full">
            <div className="col-6">
                <ACBlockTempSmall name="Куб" color="purple" temp={sortedData.tempCube} help={helpM.temp_cube_m} />
            </div>
            <div className="col-6">
                <ACBlockTempSmall name="Царга" color="orange" temp={sortedData.tempCargi} help={helpM.temp_cargi_m} />
            </div>
            <div className="col-6">
                <ACBlockTempSmall name="Дефлегматор" color="red" temp={sortedData.tempDef} help={helpM.temp_defl_m} />
            </div>
            <div className="col-6">
                <ACBlockTempSmall name="Вода" color="blue" temp={sortedData.tempWoter} help={helpM.temp_water_m} />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-3">
            <div className="col flex flex-col items-center gap-3 p-2 -mt-3">
                <div className="block col-6">
                    <ACSlider label="Температура відбору голів" color="blue" initialValue={Number(95.2)} help={helpM.temp_selection_heads_m} /><br/>
                    <ACCounterLabel units='°C' value={Number(0.1)} label="Гістерезіс" help={helpM.gist_selection_heads_m} />
                </div>
                <div className="block col-6">
                    <ACSlider label="Температура відбору тіла" color="orange" initialValue={Number(95.2)} help={helpM.temp_selection_body_m} /><br/>
                    <ACCounterLabel units='°C' value={Number(0.1)} label="Гістерезіс" help={helpM.gist_selection_body_m} />
                </div>
            </div>
            <div className="col flex flex-col items-center gap-3 p-2 -mt-2" style={{ height: '200px' }}>
                <div className="block col-6" style={{ height: '200px' }}>
                    <ACSlider label="Температура відбору хвостів" color="red" initialValue={Number(95.2)} help={helpM.temp_selection_tails_m} /><br />
                    <ACCounterLabel units='л/г' value={Number(0.38)} label="Швидкість" help={helpM.speed_selection_tails_m} />
                </div>
                <div className="block col-6" style={{ height: '200px' }}>
                    <ACSlider label="Зменшення відбору tКУБ" color="purple" initialValue={Number(95.2)} help={helpM.decrease_selection_m} /><br />
                    <ACCounterLabel units='' value={Number(0.1)} label="Зменш.шв.відб." help={helpM.decrease_speed_selection_m} />
                </div>
            </div>
        </div>
    </div>

    <div 
    className="flex flex-column gap-3 flex-grow align-items-start justify-content-start " 
    style={{
        maxHeight: '660px', 
        overflowY: 'auto',               
        width: '100%'                    
    }}
>
<div className="block pl-2 w-full">
    <h3 className="p-2">Сценарій</h3>
    <div className="flex justify-content-center">
        <ACScriptComp />
        <ACIconButton iconName="edit" onClick={() => console.log("Edit clicked")} />
        <ACIconButton iconName="doc_download" onClick={() => console.log("DocD clicked")} />
        <ACIconButton iconName="doc_add" onClick={() => console.log("DocAdd clicked")} />
        <ACIconButton iconName="delete" onClick={() => console.log("Delete clicked")} />
    </div>
    <div className="flex justify-content-center pb-4">
        <Button
            label="Пропуск"
            style={{ backgroundColor: '#4980E5', borderColor: '#4980E5', color: '#fff' }}
        />
        <Button
            label="Старт"
            style={{ backgroundColor: '#58AC43', borderColor: '#58AC43', color: '#fff' }}
        />
    </div>
</div>

    <div className="block pl-2 w-full">
        <h3>Потужність</h3>
        <ACRegulator icon="ten" label="Потужність розгону" value={Number(65)} units='%' checked disabled help={helpM.power_acceleration_m} />
        <ACRegulator icon="ten" label="Потужність відбору" value={Number(70)} units='%' checked disabled help={helpM.power_selection_m}/>
        <ACRegulator icon="ten" label="Потужність відбору (тіло)" value={Number(70)} units='%' checked disabled help={helpM.power_selection_body_m}/>
        <ACRegulator icon="ten" label="Потужність відбору (хвости)" value={Number(74)} units='%' checked disabled help={helpM.power_selection_tails_m}/>
    </div>

    <div className="block pl-2 w-full">
        <h3>Швидкість</h3>
        <ACRegulator icon="speed" label="Швидкість відбору (голів)" value={Number(0.01)} units='л/г' checked help={helpM.speed_selection_heads_m} />
        <ACRegulator icon="speed" label="Швидкість відбору (тіла)" value={Number(0.01)} units='л/г' checked help={helpM.speed_selection_body_m}/>
        <ACRegulator icon="speed" label="Швидкість відбору (хвости)" value={Number(0.01)} units='л/г' checked help={helpM.speed_selection_tails_m}/>
        <ACRegulator icon="speed" color="red" label="Зменшення шв.царзі" value={Number(0.01)} units='л/г' help={helpM.decrease_speed_cargi_m} />
    </div>

    <div className="block pl-2 w-full">
        <h3>Цикли</h3>
        <ACRegulator icon="list" label="Кількість циклів" value={Number(5)} units=' ' checked help={helpM.cycles_m} />
        <ACRegulator icon="timer" label="Обмеження циклу" value={Number(1)} units='хв' checked help={helpM.border_cycles_m}/>
        <ACRegulator icon="sort" label="Зменшення по циклам" value={Number(0.01)} units='л/г' help={helpM.decrease_cycles_m} />
    </div>

    <div className="block pl-2 w-full">
        <h3>Інше</h3>
        <ACRegulator icon="temp" color='white' label='Температура переходу' value={Number(54)} units='°C' checked help={helpM.temp_transition_m}/>
        <ACRegulator icon="temp" color='white' label='Температура відбору (хвостів)' value={Number(54)} units='°C' checked help={helpM.temp_selection_tails_m}/>
        <ACRegulator icon="temp" color='green' label='Температура зупинки' value={Number(74)} units='°C' checked disabled help={helpM.temp_stop_m}/>
        <ACRegulator icon="temp" color='red' label='Температура аварії' value={Number(59)} units='°C' checked disabled help={helpM.temp_breakdown_m} />
        <ACRegulator icon="temp_minus" label='Температура зм. по царзі' disabled help={helpM.temp_selection_cargi_m} />
        <ACRegulator icon="arrow_curve" label='Відбір хвостів' disabled help={helpM.selection_tails_m} />
        <ACRegulator icon="arrow_fork" label='Перехід на відбір тіла' disabled help={helpM.transition_select_body_m} />
        <ACRegulator icon="antena_bars" label='Стабілізація колони' value={Number(35)} units='хв' checked disabled help={helpM.stabilisation_column_m} />
    </div>
</div>
</div>
        </>
    );
};

export default RectificationProcessPage;