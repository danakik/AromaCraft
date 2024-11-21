import React, { useEffect, useState } from 'react';
import useSortedData from '../api/useSortedData';
import { ACUserComp } from "../components/usercomp";
import { ACStatusComp } from "../components/statuscomp";
import { ACKnob } from "../components/knob";
import { ACRegulator } from "../components/regulatorscomp";
import { ACCounterLabel } from "../components/counter";
import { Button } from 'primereact/button';
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';

const SettingPage = () => {
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
         <header className="mb-6">
            <div style={{float: 'right'}}><ACUserComp serial_number={key || ''}/></div>
            <div style={{float: 'left'}}><ACStatusComp status_text={'Очікування...'}/></div>
        </header>
        <div className="flex flex-row w-full h-screen align-items-start justify-content-start">

        <div className="flex flex-column w-3/4">
        <div className="grid grid-cols-2 w-full gap-3 p-3">
        <div className="col flex flex-col items-center gap-3 p-2 -mt-3">
            <div className="block col-6">
                <ACKnob label="Температура куба" color="purple" initialValue={Number(sortedData.tempCube)} readonly help={helpM.set_temp_cube_m} />
                <ACCounterLabel units="°C" value={Number(sortedData.tempCube)} label="Зміна темп. куба" help={helpM.set_temp_cube_m} />
            </div>
            <div className="block col-6">
                <ACKnob label="Температура царги" color="orange" initialValue={Number(sortedData.tempCargi)} readonly help={helpM.set_temp_cargi_m} />
                <ACCounterLabel units="°C" value={Number(sortedData.tempCargi)} label="Зміна темп. царги" help={helpM.set_temp_cargi_m} />
            </div>
            </div>
            <div className="col flex flex-col items-center gap-3 p-2 -mt-3">
            <div className="block col-6">
                <ACKnob label="Температура дефлегматора" color="red" initialValue={Number(sortedData.tempDef)} readonly help={helpM.set_temp_defl_m} />
                <ACCounterLabel units="°C" value={Number(sortedData.tempDef)} label="Зміна темп. дефл." help={helpM.set_temp_defl_m} />
            </div>
            <div className="block col-6">
                <ACKnob label="Температура води" color="blue" initialValue={Number(sortedData.tempWoter)} readonly help={helpM.set_temp_water_m} />
                <ACCounterLabel units="°C" value={Number(sortedData.tempWoter)} label="Зміна темп. води" help={helpM.set_temp_water_m} />
            </div>
            </div>
        </div>

    </div>

    <div className="flex flex-column align-items-start justify-content-start gap-3 w-1/4 ">
        <div className="block p-2 flex-1 w-full">
            <h3>Повідомлення/Пристрій</h3>
            <Button label="Зробити запит" style={{ backgroundColor: '#9e4ae7', borderColor: '#9e4ae7', color: '#fff' }} /><br/>
        </div>
        <div className="block pl-2">
            <h3>Налаштування</h3>
            <ACRegulator icon="pid" label="Встановлення нагріву" help={helpM.set_warm_m} />
            <ACRegulator icon="ten" label="ТЕН" units='Вт' value={120} checked help={helpM.set_ten_m} />
            <ACRegulator icon="antena_bars" label="Барометр" disabled help={helpM.barometer_m} />
            <ACRegulator icon="valve_heads" label="Відбір голів" checked help={helpM.set_selection_heads_m} />
            <ACRegulator icon="arrow_fork" label="Перемикач голів" help={helpM.set_change_heads_m} />
            <ACRegulator icon="select_valve" label="Встан. відбору" checked help={helpM.set_selection_m} />
            <ACRegulator icon="speed" label="Швид. при 20%" units="л/г" value={Number(0.25)} help={helpM.set_speed_20_m} />
        </div>
    </div>
</div>
        </>
    );
};

export default SettingPage;