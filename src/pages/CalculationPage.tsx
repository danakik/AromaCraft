//@ts-nocheck
import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import '../styles/process_page.css';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { alcoholTemperatureTable } from '../constants/calculation';
import { AxisOptions, Chart } from 'react-charts';
import { toast } from 'react-toastify';

type FormData = {
  capacity: number;
  power: number;
  speedOfDistillation: number;
  heatLoss?: number;
  temperature?: number;
  h_bottom: number;
  h_width: number;
  h_height: number;
  h_top: number;
};

const initValues: FormData = {
  capacity: 96.6,
  power: 2000,
  speedOfDistillation: 2,
  heatLoss: 0,
  temperature: 20,
  h_bottom: 100,
  h_width: 72,
  h_height: 1000,
  h_top: 0,
};
const round = (t: number, e = 2) => {
  return Number(t.toFixed(e));
};

export const linierInterpolation = (
  indicator: number, // indicator - показатель для которого определяется искомое значение
  smallestIndicator: number, // smallestIndicator - ближайший наименьший показатель
  highestIndicator: number, // highestIndicator - ближайший наибольший показатель
  smallestIndicatorValue: number, // smallestIndicatorValue - значение ближайшего наименьшего показателя
  highestIndicatorValue: number, // highestIndicatorValue - значение ближайшего наибольшего показателя
) => {
  const result =
    smallestIndicatorValue +
    ((highestIndicatorValue - smallestIndicatorValue) / (highestIndicator - indicator)) *
      (smallestIndicator - indicator);
  return result;
};

export const correctionByTemperature = (
  alcohol: number, // alcohol - спиртуозність
  temperature: number, // temperature - температура
) => {
  const realAlcohol = alcohol + (20 - temperature) * 0.3;
  return realAlcohol;
};

export const correctionAlcoholByTemperature = (table: string | any[], temperature: number, alcohol: number) => {
  let result = null,
    c = null,
    i = null,
    r = null,
    o = null,
    s = null,
    d = null;

  for (let index = 0; index < table.length; index++) {
    const item = table[index];
    if ('' === item.t) {
      Object.entries(item).forEach(([key, value]) => {
        if ('' !== value) {
          const a = parseFloat(value as string);
          if (a === alcohol) {
            c = key;
            s = item;
            return;
          }
          if (a < alcohol) {
            i = key;
            r = o;
            s = item;
            return;
          }
          o = key;
        }
      });
    } else if (null !== i || null !== r || null !== c) {
      const o = parseFloat(item.t);
      if (o === temperature) {
        if (null !== c) {
          result = parseFloat(item[c]);
          break;
        }
        if (null !== i && null !== r) {
          result = linierInterpolation(
            parseFloat(s[i]),
            alcohol,
            parseFloat(s[r]),
            parseFloat(item[i]),
            parseFloat(item[r]),
          );
          break;
        }
      } else if (o < temperature) {
        if (null !== c) {
          result = linierInterpolation(
            o,
            temperature,
            parseFloat(table[d].t),
            parseFloat(item[c]),
            parseFloat(table[d][c]),
          );
          break;
        }
        if (null !== i && null !== r) {
          const c = linierInterpolation(
            parseFloat(s[i]),
            alcohol,
            parseFloat(s[r]),
            parseFloat(item[i]),
            parseFloat(item[r]),
          );
          const p = linierInterpolation(
            parseFloat(s[i]),
            alcohol,
            parseFloat(s[r]),
            parseFloat(table[d][i]),
            parseFloat(table[d][r]),
          );
          result = linierInterpolation(o, temperature, parseFloat(table[d].t), c, p);
          break;
        }
      }
    }
    d = index;
  }
  if (20 === temperature) {
    return alcohol;
  } else if (null === result || isNaN(result)) {
    return correctionByTemperature(alcohol, temperature);
  } else {
    return result;
  }
};

export const calculateSpn = (data: FormData) => {
  const { h_bottom, h_width, h_height, h_top } = data;

  const d = (h_width / 100 / 2) * 3.14159 * (h_width / 100 / 2) * ((h_height - h_bottom - h_top) / 100);

  const value = d + (d * 5) / 100;
  const g = h_height / (10 * 3.5);
  const result = {
    volume: round(value, 3),
    weight: round(value, 3),
    countTheoretical: round(g, 1),
  };
  return {
    results: {
      result,
    },
  };
};

export const calculatorPhlegmNumber = (data: FormData) => {
  const { capacity, power, speedOfDistillation, heatLoss = 0, temperature = 20 } = data;

  let newCapacity = correctionAlcoholByTemperature(alcoholTemperatureTable, temperature, capacity);
  newCapacity = newCapacity / 100;
  const phlegmNumber =
    ((((1 - newCapacity + newCapacity / 0.789) * (power / ((1 - newCapacity) * 2260 + 855 * newCapacity)) * 60 * 10) /
      10 /
      (speedOfDistillation / 0.06)) *
      10) /
    10;
  const result = phlegmNumber - (heatLoss * phlegmNumber) / 100;
  return {
    results: {
      result: round(result, 1),
    },
  };
};

// Функція для розрахунку ефективності процесу
function calculateEfficiency(N, R, k) {
  if (R <= 1) {
    toast.error('Флегмове число (R) повинно бути більше 1.');
  }
  return 1 / (1 + N / (k * (R - 1)));
}

// Залежність ефективності від флегмового числа (графік)
function generateEfficiencyTable(N, k, minR, maxR, step) {
  const table: ChartItem[] = [];
  for (let R = minR; R <= maxR; R += step) {
    const efficiency = 1 - calculateEfficiency(N, R, k);
    table.push({ R: R.toFixed(2), Efficiency: (efficiency * 100).toFixed(2) });
  }
  return table;
}
type ChartItem = {
  R: number;
  Efficiency: string;
};

type ChartData = {
  label: string;
  data: ChartItem[];
};

const CalculationPage = () => {
  const key = localStorage.getItem('samogonKey');

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [phlegmNumber, setPhlegmNumber] = useState(0);
  const [result, setResult] = useState({
    volume: 0,
    weight: 0,
    countTheoretical: 0,
    efficiency: 0,
  });

  const schema = yup.object().shape({
    capacity: yup.number().required('Обов’язкове поле'),
    power: yup.number().required('Обов’язкове поле'),
    speedOfDistillation: yup.number().required('Обов’язкове поле'),
    h_bottom: yup.number().required('Обов’язкове поле'),
    h_width: yup.number().required('Обов’язкове поле'),
    h_height: yup.number().required('Обов’язкове поле'),
    h_top: yup.number().required('Обов’язкове поле'),
  });

  const primaryAxis = React.useMemo(
    (): AxisOptions<ChartItem> => ({
      getValue: (datum) => datum.R,
    }),
    [],
  );

  const secondaryAxes = React.useMemo(
    (): AxisOptions<ChartItem>[] => [
      {
        getValue: (datum) => datum.Efficiency,
        elementType: 'line',
      },
    ],
    [],
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initValues,
  });

  useEffect(() => {
    onSubmit(initValues);
  }, []);

  const onSubmit = (data: FormData) => {
    const res = calculateSpn(data).results.result;
    const phlegm = calculatorPhlegmNumber(data).results.result;
    const dataChart = generateEfficiencyTable(res.countTheoretical, 1, 1.1, phlegm, 0.1);
    setResult({ ...res, efficiency: 1 - calculateEfficiency(res.countTheoretical, phlegm, 1) });
    setPhlegmNumber(phlegm);
    setChartData([{ label: 'Ефективність', data: dataChart }]);
  };

  const renderContent = () => {
    return (
      <div style={{ display: 'flex' }} className=" flex-wrap">
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex' }} className="flex-row row-gap-5 mt-5">
          <div style={{ display: 'flex' }} className="flex-column gap-2">
            <Controller
              name="h_height"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FloatLabel>
                  <InputNumber
                    className="w-full"
                    required
                    suffix=" мм"
                    value={value}
                    mode="decimal"
                    maxFractionDigits={0}
                    showButtons
                    min={0}
                    onValueChange={(e) => onChange(e.value)}
                    invalid={!!errors.h_height?.message}
                  />
                  <span className="reg-label">
                    <label>Висота царги</label>
                  </span>
                </FloatLabel>
              )}
            />

            <Controller
              name="h_width"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FloatLabel>
                  <InputNumber
                    className="w-full"
                    required
                    suffix=" мм"
                    value={value}
                    mode="decimal"
                    maxFractionDigits={0}
                    showButtons
                    min={0}
                    onValueChange={(e) => onChange(e.value)}
                    invalid={!!errors.h_width?.message}
                  />
                  <span className="reg-label">
                    <label>Діаметр царги</label>
                  </span>
                </FloatLabel>
              )}
            />

            <Controller
              name="h_bottom"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FloatLabel>
                  <InputNumber
                    className="w-full"
                    required
                    suffix=" мм"
                    value={value}
                    mode="decimal"
                    maxFractionDigits={0}
                    showButtons
                    min={0}
                    onValueChange={(e) => onChange(e.value)}
                    invalid={!!errors.h_bottom?.message}
                  />
                  <span className="reg-label">
                    <label>Висота нижнього пижа</label>
                  </span>
                </FloatLabel>
              )}
            />
            <Controller
              name="h_top"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FloatLabel>
                  <InputNumber
                    className="w-full"
                    required
                    value={value}
                    suffix=" мм"
                    mode="decimal"
                    maxFractionDigits={0}
                    showButtons
                    min={0}
                    onValueChange={(e) => onChange(e.value)}
                    invalid={!!errors.h_top?.message}
                  />
                  <span className="reg-label">
                    <label>Висота верхнього пижа</label>
                  </span>
                </FloatLabel>
              )}
            />
            <Controller
              name="capacity"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FloatLabel>
                  <InputNumber
                    className="w-full"
                    required
                    value={value}
                    suffix=" %"
                    mode="decimal"
                    showButtons
                    maxFractionDigits={1}
                    minFractionDigits={1}
                    step={0.1}
                    max={99}
                    min={0}
                    useGrouping={false}
                    onValueChange={(e) => onChange(e.value)}
                    invalid={!!errors.capacity?.message}
                  />
                  <span className="reg-label">
                    <label>Спиртуозність на виході</label>
                  </span>
                </FloatLabel>
              )}
            />
          </div>
          <div style={{ display: 'flex' }} className="flex-column gap-2 ml-5">
            <Controller
              name="power"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FloatLabel>
                  <InputNumber
                    className="w-full"
                    required
                    suffix=" Вт"
                    value={value}
                    mode="decimal"
                    showButtons
                    min={0}
                    maxFractionDigits={0}
                    step={50}
                    useGrouping={false}
                    onValueChange={(e) => onChange(e.value)}
                    invalid={!!errors.power?.message}
                  />
                  <span className="reg-label">
                    <label>Потужність</label>
                  </span>
                </FloatLabel>
              )}
            />

            <Controller
              name="speedOfDistillation"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FloatLabel>
                  <InputNumber
                    className="w-full"
                    required
                    suffix=" л/год"
                    value={value}
                    mode="decimal"
                    showButtons
                    min={0}
                    maxFractionDigits={1}
                    minFractionDigits={1}
                    step={0.1}
                    useGrouping={false}
                    onValueChange={(e) => onChange(e.value)}
                    invalid={!!errors.speedOfDistillation?.message}
                  />
                  <span className="reg-label">
                    <label>Швидкість відбору</label>
                  </span>
                </FloatLabel>
              )}
            />
            <Controller
              name="heatLoss"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FloatLabel>
                  <InputNumber
                    className="w-full"
                    required
                    suffix=" %"
                    value={value}
                    mode="decimal"
                    showButtons
                    min={0}
                    max={100}
                    maxFractionDigits={1}
                    minFractionDigits={1}
                    step={0.5}
                    useGrouping={false}
                    onValueChange={(e) => onChange(e.value)}
                    invalid={!!errors.heatLoss?.message}
                  />
                  <span className="reg-label">
                    <label>Кількість тепловтрат</label>
                  </span>
                </FloatLabel>
              )}
            />

            <Controller
              name="temperature"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FloatLabel>
                  <InputNumber
                    className="w-full"
                    required
                    suffix=" °C"
                    value={value}
                    mode="decimal"
                    showButtons
                    min={0}
                    max={100}
                    maxFractionDigits={1}
                    minFractionDigits={1}
                    step={0.5}
                    useGrouping={false}
                    onValueChange={(e) => onChange(e.value)}
                    invalid={!!errors.temperature?.message}
                  />
                  <span className="reg-label">
                    <label>Температура спирту на виході</label>
                  </span>
                </FloatLabel>
              )}
            />
            <Button className="w-full" label="Розрахувати" type="submit" />
          </div>
        </form>
        <div style={{ display: 'flex' }} className="text-md flex-column row-gap-3 sm:text-left ml-5 mt-5">
          <div className="reg-label">
            Флегмове число <b className="text-xl">{phlegmNumber}</b>
          </div>
          <div className="reg-label">
            Об’єм СПН (3.5х3.5 0.25мм) <b className="text-xl">{result.volume} л</b>
          </div>
          <div className="reg-label">
            Вага СПН (3.5х3.5 0.25мм) <b className="text-xl">{result.weight} кг</b>
          </div>
          <div className="reg-label">
            Кількість теоретичних тарілок <b className="text-xl">{result.countTheoretical} шт</b>
          </div>
          <div className="reg-label">
            Ефективність процесу <b className="text-xl">{(result.efficiency * 100).toFixed(2)}%</b>
          </div>
        </div>
      </div>
    );
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

      <div
        className="flex-column flex-grow justify-content-start w-full"
        style={{
          maxHeight: '660px',
          overflowY: 'auto',
          width: '80%',
          marginLeft: '40px',
          display: 'flex',
        }}
      >
        {renderContent()}
      </div>
      <div style={{ display: 'flex', height: 300, marginRight: '40px' }} className="w-full">
        {chartData && chartData.length > 0 && (
          <Chart
            style={{ height: '100%' }}
            options={{
              data: chartData,
              primaryAxis,
              secondaryAxes,
              dark: true,
            }}
          />
        )}
      </div>
    </>
  );
};

export default CalculationPage;
