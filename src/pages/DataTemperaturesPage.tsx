import React, { useEffect, useState } from 'react';
import { Chart, AxisOptions } from 'react-charts';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import '../styles/process_page.css';
import '../styles/temperatures_page.css';


type TemperatureData = {
  time: number;
  cube: number;
  column: number;
  defleg: number;
  water: number;
}

const generateTemperatureData = (): TemperatureData[] => {

  const temperatureData = Array.from({ length: 240 }, (_, index) => ({
    time: index, 
    cube: 75 + Math.random() * 6 - 3, 
    column: 70 + Math.random() * 6 - 3, 
    defleg: 60 + Math.random() * 4 - 2, 
    water: 20 + Math.random() * 3 - 1, 
  }));

  return temperatureData;
};

const DataTemperaturesPage: React.FC = () => {
  const key = localStorage.getItem('samogonKey');
  

  const [data, setData] = useState<{
    label: string;
    data: { primary: number; secondary: number }[];
  }[]>([]);

  useEffect(() => {

    const tempData = generateTemperatureData();
    

    const chartData = [
      {
        label: 'Температура куба',
        data: tempData.map(d => ({ primary: d.time, secondary: d.cube })),
      },
      {
        label: 'Температура царги',
        data: tempData.map(d => ({ primary: d.time, secondary: d.column })),
      },
      {
        label: 'Температура дефлегматора',
        data: tempData.map(d => ({ primary: d.time, secondary: d.defleg })),
      },
      {
        label: 'Температура води',
        data: tempData.map(d => ({ primary: d.time, secondary: d.water })),
      },
    ];

    setData(chartData);
  }, []);


  const primaryAxis = React.useMemo<AxisOptions<{ primary: number }>>(
    () => ({
      getValue: (datum) => datum.primary, 
      elementType: 'line', 
    }),
    []
  );

 
  const secondaryAxes = React.useMemo<AxisOptions<{ secondary: number }>[]>(
    () => [
      {
        getValue: (datum) => datum.secondary, 
        elementType: 'line', 
      },
    ],
    []
  );

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
      <div
  className="flex flex-column gap-2 w-full align-items-start justify-content-start"
  style={{ height: '100vh' }} 
>
  <div style={{height: '100px'}} className="flex flex-row w-full align-items-center justify-content-center"> 
    <ul className="temp-list">
      <li className="temp-cube">Температура куба</li>
      <li className="temp-cargi">Температура царги</li>
    </ul>
    <ul className="temp-list">
      <li className="temp-defl">Температура дефлегматора</li>
      <li className="temp-water">Температура води</li>
    </ul>
  </div>
  <div style={{ height: '400px' }} className="flex flex-column w-full align-items-center justify-content-center">
    {data.length > 0 && (
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
          dark: true,
        }}
      />
    )}
  </div>
</div>
    </>
  );
};

export default DataTemperaturesPage;
