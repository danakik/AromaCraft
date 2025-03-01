import React, { useEffect, useState } from 'react';
import { Chart, AxisOptions } from 'react-charts';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import '../styles/process_page.css';
import '../styles/temperatures_page.css';
import { useStatisticsDataQuery } from '../api/statisticsDataApi';
import { toast } from 'react-toastify';

type TemperatureData = {
  time: number;
  cube: number;
  column: number;
  defleg: number;
  water: number;
};

/* const generateTemperatureData = (): TemperatureData[] => {
  const temperatureData = Array.from({ length: 240 }, (_, index) => ({
    time: index,
    cube: 75 + Math.random() * 6 - 3,
    column: 70 + Math.random() * 6 - 3,
    defleg: 60 + Math.random() * 4 - 2,
    water: 20 + Math.random() * 3 - 1,
  }));

  return temperatureData;
}; */

const DataTemperaturesPage: React.FC = () => {
  const key = localStorage.getItem('samogonKey');
  const { data: statisticsData } = useStatisticsDataQuery(key || '');

  const [data, setData] = useState<
    {
      label: string;
      data: { primary: Date; secondary: number }[];
    }[]
  >([]);

  /* useEffect(() => {
    const tempData = generateTemperatureData();

    const chartData = [
      {
        label: 'Температура куба',
        data: tempData.map((d) => ({ primary: d.time, secondary: d.cube })),
      },
      {
        label: 'Температура царги',
        data: tempData.map((d) => ({ primary: d.time, secondary: d.column })),
      },
      {
        label: 'Температура дефлегматора',
        data: tempData.map((d) => ({ primary: d.time, secondary: d.defleg })),
      },
      {
        label: 'Температура води',
        data: tempData.map((d) => ({ primary: d.time, secondary: d.water })),
      },
    ];

    setData(chartData);
  }, []); */

  const primaryAxis = React.useMemo<AxisOptions<{ primary: Date }>>(
    () => ({
      getValue: (datum) => datum.primary,
      scaleType: 'time',
      formatters: {
        tooltip: (date) => date.toLocaleTimeString(),
      },
    }),
    [],
  );

  const secondaryAxes = React.useMemo<AxisOptions<{ secondary: number }>[]>(
    () => [
      {
        getValue: (datum) => datum.secondary,
        elementType: 'line',
      },
    ],
    [],
  );

  function sortData(rawData: any[]) {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      toast.error('москалі спиздили УСЕ');
      return [];
    }

    const sortedData: {
      temp0: { primary: Date; secondary: number }[];
      temp1: { primary: Date; secondary: number }[];
      temp2: { primary: Date; secondary: number }[];
      temp3: { primary: Date; secondary: number }[];
      baro: { primary: Date; secondary: number }[];
    } = {
      temp0: [],
      temp1: [],
      temp2: [],
      temp3: [],
      baro: [],
    };

    rawData.slice(0, 100).forEach((entry, index) => {
      if (!Array.isArray(entry) || entry.length < 6) {
        console.error(`Ошибка в элементе ${index}:`, entry);
        return;
      }

      const timestamp = new Date(entry[0] * 1000);
      const newTime = new Date(timestamp).getTime();
      sortedData.temp0.push({ primary: timestamp, secondary: entry[1].toFixed(2) });
      sortedData.temp1.push({ primary: timestamp, secondary: entry[2].toFixed(2) });
      sortedData.temp2.push({ primary: timestamp, secondary: entry[3].toFixed(2) });
      sortedData.temp3.push({ primary: timestamp, secondary: entry[4].toFixed(2) });
      sortedData.baro.push({ primary: timestamp, secondary: entry[5].toFixed(2) });
    });

    return [
      { label: 'Куб', data: sortedData.temp0 },
      { label: 'Царга', data: sortedData.temp1 },
      { label: 'Дефлегматор', data: sortedData.temp2 },
      { label: 'Вода', data: sortedData.temp3 },
      { label: 'Баро', data: sortedData.baro },
    ];
  }

  useEffect(() => {
    const formattedData = sortData(statisticsData);
    setData(formattedData);
  }, [statisticsData]);

  console.log('Финальные данные:', data);

  return (
    <>
      <header className="mb-1">
        <div style={{ float: 'right' }}>
          <ACUserComp serial_number={key || ''} />
        </div>
        <div style={{ float: 'left' }}></div>
      </header>
      <div
        className="flex flex-column gap-2 w-full align-items-start justify-content-start"
        style={{ height: '100vh' }}
      >
        <div style={{ height: '100px' }} className="flex flex-row w-full align-items-center justify-content-center">
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
