import React, { useEffect, useState } from 'react';
import useSortedData from '../api/useSortedData';
import { ACBlockTemp } from "../components/blocktemp";
import { ACUserComp } from "../components/usercomp";
import { ACStatusComp } from "../components/statuscomp";
import { ACKnob } from "../components/knob";
import { ACCounterLabel } from "../components/counter";
import { ACRegulator } from "../components/regulatorscomp";
import { ACSwitch } from '../components/switch';
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';

const ManualProcessPage = () => {
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
        <header className="mb-3">
            <div style={{float: 'right'}}><ACUserComp serial_number={key || ''}/></div>
            <div style={{float: 'left'}}><ACStatusComp status_text={'Очікування...'}/></div>
        </header>
        <div className="flex flex-row gap-2 w-full align-items-start justify-content-start">
    <div className="flex flex-column w-3/4 ">
    <div className="grid grid-cols-2 w-full">
        <div className="col-6">
            <ACBlockTemp name="Куб" color="purple" temp={String(sortedData.tempCube)} help={helpM.temp_cube_m} />
        </div>
        <div className="col-6">
            <ACBlockTemp name="Царга" color="orange" temp={String(sortedData.tempCargi)} help={helpM.temp_cargi_m} />
        </div>
        <div className="col-6">
            <ACBlockTemp name="Дефлегматор" color="red" temp={String(sortedData.tempDef)} help={helpM.temp_defl_m} />
        </div>
        <div className="col-6">
            <ACBlockTemp name="Вода" color="blue" temp={String(sortedData.tempWoter)} help={helpM.temp_water_m} />
        </div>
    </div>

    <div className="flex flex-row gap-3 p-2 w-full -mt-2">
        <div className="block p-2 flex-1 col-6">
            <ACKnob label="Температура відбору" color="orange" initialValue={sortedData.handTempSelect} help={helpM.temp_selection_m} />
            <ACCounterLabel units="л/г" value={sortedData.handPercent} label="Швидкість відбору" help={helpM.speed_selection_m} />
        </div>
        <div className="block p-2 flex-1 col-6">
            <ACKnob label="Гістерезіс відбору" color="blue" initialValue={sortedData.handTempGyst} help={helpM.gist_selection_m} />
            <ACCounterLabel units="л/г" value={sortedData.handSpeedTail} label="Швидкість відбору хвостів" help={helpM.speed_selection_tails_m} />
        </div>
    </div>
    </div>
    <div className="flex flex-column gap-3 w-1/4 align-items-start justify-content-start">
        <div className="block p-3  w-full">
            <h3>Нагрівач/Регулятор</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="ten" label="Електронагрівач (ТЕН)" value={sortedData.handPower} units="%" help={helpM.ten_m} />
                <ACSwitch checked={!!sortedData.handTen} />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="pid" label="ПІД-регулятор" value={sortedData.handPin1} units="°C" help={helpM.pid_m} />
                <ACSwitch checked={!!sortedData.handPin2}/>
            </div>
        </div>
        <div className="block p-4  w-full">
            <h3>Механізми/Клапани</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="water" label="Подача води" help={helpM.water_m} />
                <ACSwitch checked={!!sortedData.handK1}/>
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="select_valve" label="Клапан відбору" help={helpM.selection_m} />
                <ACSwitch checked={!!sortedData.handK2}/>
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="valve_heads" label="Клапан голів" help={helpM.heads_m} />
                <ACSwitch checked={!!sortedData.handK3}/>
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="valve_tails" label="Клапан хвостів" help={helpM.tails_m} />
                <ACSwitch checked={!!sortedData.handK4}/>
            </div>
        </div>
        <div className="block p-3  w-full">
            <h3>Аварії</h3>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="breakdown" color="white" label="Аварія води" value={sortedData.handTempWoterError} units="°C" help={helpM.water_break_m} />
                <ACSwitch checked={!!sortedData.handWoterError}/>
            </div>
            <div className="flex flex-row align-items-start justify-content-start w-full gap-2 pl-2">
                <ACRegulator icon="breakdown" color="purple" label="Аварія куб" value={sortedData.handTempCubeError} units="°C" help={helpM.cube_break_m} />
            </div>
            <div className="flex flex-row align-items-center justify-content-center w-full gap-2">
                <ACRegulator icon="breakdown" color="orange" label="Аварія рівень" help={helpM.level_break_m} />
                <ACSwitch checked={!!sortedData.handLevelError}/>
            </div>
        </div>
    </div>
</div>
        </>
    );
};

export default ManualProcessPage;