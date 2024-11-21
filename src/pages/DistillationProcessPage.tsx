import React, { useEffect, useState } from 'react';
import useSortedData from '../api/useSortedData';
import { ACBlockTemp } from "../components/blocktemp";
import { ACUserComp } from "../components/usercomp";
import { ACStatusComp } from "../components/statuscomp";
import { ACScriptComp } from "../components/scriptcomp";
import { ACIconButton } from "../components/iconbutton";
import { ACKnob } from "../components/knob";
import { ACRegulator } from "../components/regulatorscomp";
import { Button } from 'primereact/button';
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';

const DistillationProcessPage = () => {
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

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data.</p>;

    return (
        <>
        <header className="mb-6">
            <div style={{float: 'right'}}><ACUserComp serial_number={key || ''}/></div>
            <div style={{float: 'left'}}><ACStatusComp status_text={'Очікування...'}/></div>
        </header>
        <div className="flex flex-row gap-2 w-full align-items-start justify-content-start">
            
            <div className="flex flex-column w-3/4">
                <div className="grid grid-cols-2 w-full">
                        <div className="col-6" >
                            <ACBlockTemp name="Куб" color="purple" temp={sortedData.tempCube} help={helpM.temp_cube_m} />
                        </div>
                        <div className="col-6">
                            <ACBlockTemp name="Царга" color="orange" temp={sortedData.tempCargi} help={helpM.temp_cargi_m}/>
                        </div>
                        <div className="col-6">
                            <ACBlockTemp name="Дефлегматор" color="red" temp={sortedData.tempDef} help={helpM.temp_defl_m}/>
                        </div>
                        <div className="col-6">
                            <ACBlockTemp name="Вода" color="blue" temp={sortedData.tempWoter} help={helpM.temp_water_m}/>
                        </div>
                </div>
                    
                    <div className="flex flex-row gap-3 p-2 w-full -mt-2">
                            <div className="block p-2 flex-1 col-6">
                                <ACKnob label="Температура переходу" color="red" initialValue={95.2} help={helpM.temp_transition_m}/>
                            </div>
                            <div className="block p-2 flex-1 col-6">
                                <ACKnob label="Температура зупинки" color="purple" initialValue={95.2} help={helpM.temp_stop_m}/>
                            </div>
                    </div>
                </div>
            
            <div className="flex flex-column gap-3 w-1/4 align-items-start justify-content-start ">
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
                    <ACRegulator icon="ten" label="Потужність розгону" units='%' value={65} disabled help={helpM.power_acceleration_m}/>
                    <ACRegulator icon="pid" label="Потужність відбору тіла" units='%' value={70} disabled help={helpM.power_selection_body_m}/>
                    <ACRegulator icon="pid" label="Потужність відбору" units='%' value={70} disabled help={helpM.power_selection_m}/>
                </div>
                <div className="block pl-2 w-full">
                    <h3>Аварія/Час</h3>
                    <ACRegulator icon="time" label='Час, хв. переходу тіла' value={parseFloat('10')} units='хв' checked help={helpM.time_body_transition_m}/>
                    <ACRegulator icon="temp" label='Температура аварії' value={parseFloat('50')} units='°C' checked help={helpM.temp_breakdown_m}/>
                </div>
            </div>
        </div>
        </>
    );
};

export default DistillationProcessPage;