import React, { useEffect, useMemo, useState } from 'react';
import { Chart, AxisOptions } from 'react-charts';
import { ACUserComp } from '../components/usercomp';
import '../styles/process_page.css';
import '../styles/temperatures_page.css';
import { useStatisticsDataQuery } from '../api/statisticsDataApi';
import { useTranslation } from 'react-i18next';
import { useDisableLiProcess } from '../hooks/useDisableLiProcess';
import { useGetDataQuery } from '../api/samogonApi';
import { initialSortedData, SYNC_INTERVAL } from '../constants/api';
import { Button } from 'primereact/button';

type TemperatureEntry = [number, number, number, number, number, number];

type ChartData = {
  label: string;
  data: { primary: Date; secondary: number }[];
  color: string;
};

const DataTemperaturesPage: React.FC = () => {
  const key = localStorage.getItem('samogonKey');
  const dataSamagon = useMemo(() => ({ key }), [key]);

  const {
    data = initialSortedData,
    isLoading,
    error,
  } = useGetDataQuery(dataSamagon, { pollingInterval: SYNC_INTERVAL });

  useDisableLiProcess(data);

  const { data: statisticsData } = useStatisticsDataQuery(key || '');
  const { t } = useTranslation();

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [originalData, setOriginalData] = useState<ChartData[]>([]);
  const [availableHours, setAvailableHours] = useState(0);

  const primaryAxis = useMemo<AxisOptions<{ primary: Date }>>(
    () => ({
      getValue: (datum) => datum.primary,
      scaleType: 'time',
      formatters: {
        tooltip: (date) => date.toLocaleTimeString(),
      },
    }),
    [],
  );

  const secondaryAxes = useMemo<AxisOptions<{ secondary: number }>[]>(
    () => [
      {
        getValue: (datum) => datum.secondary,
        elementType: 'line',
      },
    ],
    [],
  );

  function sortData(rawData: TemperatureEntry[]): ChartData[] {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }

    const sortedData = {
      temp0: [] as { primary: Date; secondary: number }[],
      temp1: [] as { primary: Date; secondary: number }[],
      temp2: [] as { primary: Date; secondary: number }[],
      temp3: [] as { primary: Date; secondary: number }[],
      baro: [] as { primary: Date; secondary: number }[],
    };

    rawData.forEach((entry, index) => {
      if (!Array.isArray(entry) || entry.length < 6) {
        console.error(`Ошибка в элементе ${index}:`, entry);
        return;
      }

      const timestamp = new Date(entry[0] * 1000);
      sortedData.temp0.push({ primary: timestamp, secondary: Number(entry[1].toFixed(2)) });
      sortedData.temp1.push({ primary: timestamp, secondary: Number(entry[2].toFixed(2)) });
      sortedData.temp2.push({ primary: timestamp, secondary: Number(entry[3].toFixed(2)) });
      sortedData.temp3.push({ primary: timestamp, secondary: Number(entry[4].toFixed(2)) });

      if (data.version >= 4) {
        sortedData.baro.push({ primary: timestamp, secondary: Number(entry[5].toFixed(2)) });
      }
    });

    const chartData: ChartData[] = [
      { label: t('cube'), data: sortedData.temp0, color: '#9e4ae7' },
      { label: t('carga'), data: sortedData.temp1, color: '#e7764a' },
      { label: t('defl'), data: sortedData.temp2, color: '#e74a4a' },
      { label: t('water'), data: sortedData.temp3, color: '#2942e1' },
    ];

    if (data.version >= 4) {
      chartData.push({ label: t('settings_barometer'), data: sortedData.baro, color: '#70d4cf' });
    }

    return chartData;
  }

  const filterByHours = (hours: number) => {
    if (!originalData.length) return;

    const lastTimestamp = originalData[0].data.at(-1)?.primary.getTime() || 0;
    const timeLimit = lastTimestamp - hours * 60 * 60 * 1000;

    const filteredData = originalData.map((series) => ({
      ...series,
      data: series.data.filter((point) => point.primary.getTime() >= timeLimit),
    }));

    setChartData(filteredData);
  };

  const handleShowAll = () => {
    setChartData(originalData);
  };

  useEffect(() => {
    if (statisticsData) {
      const formattedData = sortData(statisticsData);
      setOriginalData(formattedData);
      setChartData(formattedData);

      const allTimestamps = statisticsData.map((entry: number[]) => entry[0] * 1000);
      const minTime = Math.min(...allTimestamps);
      const maxTime = Math.max(...allTimestamps);
      const totalHours = Math.floor((maxTime - minTime) / (60 * 60 * 1000));

      setAvailableHours(totalHours);
    }
  }, [statisticsData, data.version]);

  if (isLoading || data.version === 0) return <p>{t('loading')}</p>;

  return (
    <>
      <header className="mb-1">
        <div style={{ float: 'right' }}>
          <ACUserComp serial_number={key || ''} />
        </div>
      </header>
      <div>
        <Button className="time-filter-buttons" onClick={() => filterByHours(1)} disabled={availableHours < 1}>
          1 {t('unit_time')}
        </Button>
        <Button className="time-filter-buttons" onClick={() => filterByHours(2)} disabled={availableHours < 2}>
          2 {t('unit_time')}
        </Button>
        <Button className="time-filter-buttons" onClick={() => filterByHours(6)} disabled={availableHours < 6}>
          6 {t('unit_time')}
        </Button>
        <Button className="time-filter-buttons" onClick={() => filterByHours(12)} disabled={availableHours < 12}>
          12 {t('unit_time')}
        </Button>
        <Button className="time-filter-buttons" onClick={() => filterByHours(24)} disabled={availableHours < 24}>
          24 {t('unit_time')}
        </Button>
        <Button className="time-filter-buttons" onClick={() => filterByHours(48)} disabled={availableHours < 48}>
          48 {t('unit_time')}
        </Button>
        <Button className="time-filter-buttons" onClick={handleShowAll} disabled={availableHours < 1}>
          {t('all')}
        </Button>
      </div>
      <div className="chart-container custom-scrollbar">
        {chartData.length > 0 &&
          chartData.map((series, index) => (
            <div key={index} className="chart-wrapper">
              <Chart
                options={{
                  data: [series],
                  primaryAxis,
                  secondaryAxes,
                  dark: true,
                  getSeriesStyle: () => ({
                    stroke: series.color,
                    r: 4,
                    fill: series.color,
                  }),
                }}
              />
            </div>
          ))}
      </div>
      <div style={{ height: '60px' }} className="flex flex-row w-full align-items-evenly justify-content-evenly block">
        <ul className="temp-list">
          <li className="temp-cube">{t('settings_temp_cube')}</li>
        </ul>
        <ul className="temp-list">
          <li className="temp-cargi">{t('settings_temp_carga')}</li>
        </ul>
        <ul className="temp-list">
          <li className="temp-defl">{t('settings_temp_defl')}</li>
        </ul>
        <ul className="temp-list">
          <li className="temp-water">{t('settings_temp_water')}</li>
        </ul>
        <ul className="temp-list">
          <li className="temp-baro">{t('settings_barometer')}</li>
        </ul>
      </div>
    </>
  );
};

export default DataTemperaturesPage;
