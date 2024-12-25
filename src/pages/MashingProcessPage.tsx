import React, { useEffect, useState, useRef } from 'react';
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
import { ToggleButton } from 'primereact/togglebutton';
import '../styles/process_page.css';
import * as helpM from '../components/help_messages';
import { useGetDataQuery } from '../api/samogonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { calculateHandPercent } from '../utils/calculate';
import { useSaveHandMutation } from '../api/manualSave';
import { debounce } from 'lodash';

const MashingProcessPage = () => {
    const key = localStorage.getItem('samogonKey');
    const {
        data = initialSortedData,
        isLoading,
        error,
    } = useGetDataQuery(key ?? skipToken, { pollingInterval: SYNC_INTERVAL });

    if (isLoading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка у завантаженні даних.</p>;

    console.log(data);

    const [checked, setChecked] = useState(false);
    const [pauseCount, setPauseCount] = useState(1);

    const generatePauseBlocks = () => {
        const blocks = [];
        for (let i = 1; i <= pauseCount; i++) {
            blocks.push(
                <div key={i} className="col-6" style={{ maxWidth: '260px' }}>
                    <div className="flex flex-column align-items-center justify-content-center block">
                        <ACKnob
                            label={`Температура паузи ${i}`}
                            color={i % 2 === 0 ? 'blue' : 'orange'}
                            initialValue={50}
                            help={helpM.temp_pause_m}
                            onChange={(e) => console.log(e)}
                        />
                        <ACSlider
                            label={`Гістерезис паузи ${i}`}
                            color={i % 2 === 0 ? 'red' : 'purple'}
                            initialValue={10}
                            help={helpM.gist_pause_m}
                            onChange={(e) => console.log(e)}
                        />
                        <ACCounterLabel
                            label={`Час паузи ${i}`}
                            value={10}
                            units="хв"
                            help={helpM.temp_pause_m}
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
                <div className="flex flex-column w-3/4 ">
                    <div className="grid grid-cols-2 w-full">
                        <div className="col-6">
                            <ACBlockTempSmall name="Куб" color="purple" temp={String(data.tempCube)} help={helpM.temp_cube_m} />
                        </div>
                        <div className="col-6">
                            <ACBlockTempSmall name="Царга" color="orange"  temp={String(data.tempCargi)} help={helpM.temp_cargi_m} />
                        </div>
                        <div className="col-6">
                            <ACBlockTempSmall name="Дефлегматор"  color="red"  temp={String(data.tempDef)}  help={helpM.temp_defl_m} />
                        </div>
                        <div className="col-6">
                            <ACBlockTempSmall name="Вода" color="blue" temp={String(data.tempWater)} help={helpM.temp_water_m} />
                        </div>
                    </div>
                    <div className="flex flex-column align-items-start justify-content-start w-3/4 custom-scrollbar2" style={{ maxHeight: '400px', width: '522px', overflowY: 'auto', borderRadius: '28px' }} >
                        <div className="flex flex-column align-items-center justify-content-center w-full">
                        <div className="grid grid-cols-2 w-full">
                            {generatePauseBlocks()}
                        </div>
                        </div>

                    </div>
                </div>
            
            <div className="flex flex-column gap-3 flex-grow align-items-start justify-content-start w-3/4 custom-scrollbar" style={{ maxHeight: '650px', overflowY: 'auto', width: '80%', borderRadius: '12px', paddingRight: '4px' }}  >
                <div className="block p-3 w-full">
                    <h3>Автоматика</h3>
                    <div className="flex align-items-start justify-content-center">
                        <ACScriptComp />
                    </div>
                    <div className="flex align-items-center justify-content-center">
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
                <div className="block p-3  w-full">
                    <h3>Паузи</h3>
                    <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
                        <ACRegulator icon="list" label="Кількість пауз" units=' ' value={pauseCount} help={helpM.pauses_m}  onChange={(e: { value: number }) => setPauseCount(e.value)}  />
                    </div>
                </div>
                <div className="block p-3  w-full">
                    <h3>Варка</h3>
                    <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
                        <ACRegulator icon="temp_plus" label="Варка" help={helpM.temp_brew_m} />
                        <ACSwitch />
                        {/*         <ToggleButton onLabel="Варка" offLabel="Варка" checked={checked} onChange={(e) => setChecked(e.value)}/>  */}
                    </div>
                    <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
                        <ACRegulator icon="temp" label="Температура варки" units='°C' value={100} help={helpM.temp_brew_m} />
                    </div>
                    <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
                        <ACRegulator icon="ten" label="Потужність" units='%' value={50} help={helpM.power_brew_m} />
                    </div>
                    <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
                        <ACRegulator icon="timer" label="Час варки" units='хв' value={10} help={helpM.time_brew_m} />
                    </div>
                </div>
                <div className="block p-3  w-full">
                    <h3>Охолодженння</h3>
                    <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
                        <ACRegulator icon="temp_minus" label="Охолодження" help={helpM.temp_freeze_m} />
                        <ACSwitch />
                        {/*         <ToggleButton onLabel="Охол." offLabel="Охол." checked={checked} onChange={(e) => setChecked(e.value)}/>  */}
                    </div>
                    <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
                        <ACRegulator icon="temp" label="Температура охолодження" units='°C' value={30} help={helpM.temp_freeze_m} />
                    </div>
                    <div className="flex flex-row align-items-start justify-content-start w-full gap-2">
                        <ACRegulator icon="temp_minus" label="Температура охолодження" units='°C' value={30} help={helpM.temp_freeze_m} />
                    </div>
                </div>
            </div>
        </div >
        </>
    );
};

export default MashingProcessPage;
