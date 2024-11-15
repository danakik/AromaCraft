import React, { useEffect, useState } from 'react';
import useSortedData from '../api/useSortedData';
import { ACBlockTemp } from "../components/blocktemp";
import { ACUserComp } from "../components/usercomp";
import { ACStatusComp } from "../components/statuscomp";
import { ACKnob, ACSlider } from "../components/knob";
import { ACCounterLabel } from "../components/counter";
import { ACRegulator } from "../components/regulatorscomp";
import '../styles/process_page.css';
import '../styles/rectification_process_page.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.min.css';
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
        <header>
            <div style={{float: 'right'}}><ACUserComp serial_number={key || ''}/></div>
            <div style={{float: 'left'}}><ACStatusComp status_text={'Очікування...'}/></div>
        </header>
        <div className="container">
            
            <div className="block-1">
                <div className="column">
                    
                    <div className="block-3 grid">
                        <div className="col-6">
                            <ACBlockTemp name="Куб" color="purple" temp={sortedData.tempCube} help={helpM.temp_cube_m} />
                        </div>
                        <div className="col-6">
                            <ACBlockTemp name="Царга" color="orange" temp={sortedData.tempCargi} help={helpM.temp_cargi_m} />
                        </div>
                        <div className="col-6">
                            <ACBlockTemp name="Дефлегматор" color="red" temp={sortedData.tempDef} help={helpM.temp_defl_m} />
                        </div>
                        <div className="col-6">
                            <ACBlockTemp name="Вода" color="blue" temp={sortedData.tempWoter} help={helpM.temp_water_m} />
                        </div>
                    </div>
                    
                    <div className="block-4"> 
                            <div className="block-9 grid">
                                <div className="block-10">
                                    <ACKnob label="Температура відбору голів" color="blue" initialValue={Number(95.2)} help={helpM.temp_selection_m} />
                                    <ACCounterLabel units='°C' value={Number(0.1)} label="Гістерезіс" help={helpM.speed_selection_m} />
                                </div>
                                <div className="block-10">
                                    <ACKnob label="Температура відбору тіла" color="orange" initialValue={Number(95.2)} help={helpM.gist_selection_m} />
                                    <ACCounterLabel units='°C' value={Number(0.1)} label="Гістерезіс" help={helpM.speed_selection_tails_m} />
                                </div>
                                <div className="block-10">
                                    <ACKnob label="Температура відбору хвостів" color="red" initialValue={Number(95.2)} help={helpM.gist_selection_m} />
                                    <ACCounterLabel units='л/г' value={Number(0.38)} label="Швидкість" help={helpM.speed_selection_tails_m} />
                                </div>
                                <div className="block-10">
                                    <ACKnob label="Зменшення відбору tКУБ" color="purple" initialValue={Number(95.2)} help={helpM.gist_selection_m} /><br/>
                                    <ACCounterLabel units='' value={Number(0.1)} label="Зменш.шв.відб." help={helpM.speed_selection_tails_m} />
                                </div>
                        </div>
                    </div>

                </div>
            </div>

            
            <div className="block-2 column">
                <div className="block-8">
                    <h3>Потужність</h3>
                    <ACRegulator icon="ten" label="Електронагрівач (ТЕН)" value={Number(sortedData.handTen.trim())} units='%' checked help={helpM.ten_m} />
                    <ACRegulator icon="pid" label="ПІД-регулятор" value={Number(sortedData.handPin2.trim())} units='°C' help={helpM.pid_m}/>
                </div>
                <div className="block-8">
                    <h3>Швидкість/Цикли</h3>
                    <ACRegulator icon="water" label="Подача води" checked help={helpM.water_m} />
                    <ACRegulator icon="select_valve" label="Клапан відбору" checked help={helpM.selection_m}/>
                    <ACRegulator icon="valve_heads" label="Клапан голів" help={helpM.heads_m} />
                    <ACRegulator icon="valve_tails" label="Клапан хвостів" help={helpM.tails_m} />
                </div>
                <div className="block-8">
                    <h3>Інше</h3>
                    <ACRegulator icon="breakdown" color='white' label='Аварія води' value={Number(sortedData.handTempWoterError.trim())} units='°C' checked help={helpM.water_break_m}/>
                    <ACRegulator icon="breakdown" color='purple' label='Аварія куб' value={Number(sortedData.handTempCubeError.trim())} units='°C' checked disabled help={helpM.cube_break_m}/>
                    <ACRegulator icon="breakdown" color='orange' label='Аварія рівень' help={helpM.level_break_m} />
                </div>
            </div>
        </div>
        </>
    );
};

export default RectificationProcessPage;