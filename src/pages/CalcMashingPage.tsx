import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { AxisOptions, Chart } from 'react-charts';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { temperatureKValues } from '../constants/mashing_costants';
import '../styles/process_page.css';
import '../styles/styles.css';

const CalcMashingPage = () => {
  const key = localStorage.getItem('samogonKey');
  const { t } = useTranslation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogHeader, setDialogHeader] = useState('');
  const [dialogHint, setDialogHint] = useState('');

  const handleClick = (header: string, hint: string) => {
    setDialogHeader(header);
    setDialogHint(hint);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const [results, setResults] = useState<{ R: number; tf: number; A: number; S: number }>({
    R: 0,
    tf: 0,
    A: 0,
    S: 0,
  });

  const chartData = [
    {
      label: 'Константа осахарювання',
      data: temperatureKValues.map(({ temperature, k }) => ({
        primary: temperature,
        secondary: k,
      })),
    },
  ];

  const primaryAxis = {
    getValue: (datum: { primary: number }) => datum.primary,
    label: 'Температура (°C)',
  };

  const secondaryAxes = [
    {
      getValue: (datum: { secondary: number }) => datum.secondary,
      label: 'Константа осахарювання (k, хв⁻¹)',
    },
  ];

  type FormData = {
    volume_water: number;
    mass_grain: number;
    sugar_content: number;
    sugar_content_max: number;
    time: number;
    temperature: number;
  };

  const initValues: FormData = {
    volume_water: 15,
    mass_grain: 4,
    sugar_content: 150,
    sugar_content_max: 150,
    time: 5,
    temperature: 75,
  };

  const schema = yup.object().shape({
    volume_water: yup.number().positive().required(t('calculate_required')),
    mass_grain: yup.number().positive().required(t('calculate_required')),
    sugar_content: yup.number().positive().required(t('calculate_required')),
    sugar_content_max: yup.number().positive().required(t('calculate_required')),
    time: yup.number().positive().required(t('calculate_required')),
    temperature: yup.number().positive().min(50).max(80).required(t('calculate_required')),
  });

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
    const k = getKValue(data.temperature);
    const R = parseFloat((data.volume_water / data.mass_grain).toFixed(2));
    const tf = parseFloat((data.sugar_content / ((data.sugar_content_max * (k * 60)) / 2)).toFixed(2));
    const A = parseFloat((0.51 * data.sugar_content * data.volume_water).toFixed(2));
    const S = parseFloat((data.sugar_content_max * (1 - Math.exp(-k * data.time))).toFixed(2));
    setResults({ R, tf, A, S });
  };

  const getKValue = (temp: number) => {
    const sortedValues = [...temperatureKValues].sort((a, b) => a.temperature - b.temperature);
    for (let i = 0; i < sortedValues.length - 1; i++) {
      if (temp === sortedValues[i].temperature) return sortedValues[i].k;
      if (temp > sortedValues[i].temperature && temp < sortedValues[i + 1].temperature) {
        return (sortedValues[i].k + sortedValues[i + 1].k) / 2;
      }
    }
    return sortedValues[sortedValues.length - 1].k;
  };

  return (
    <>
      <header className="mb-5">
        <div style={{ float: 'right' }}>
          <ACUserComp serial_number={key || ''} />
        </div>
      </header>
      <div className="flex flex-column w-full mt-10">
        <div className="flex flex-column">
          <form onSubmit={handleSubmit(onSubmit)} className="form-container flex flex-column flex-wrap">
            <div className="flex flex-row gap-2 w-full">
              {/* V_w (Об'єм води) */}
              <Controller
                name="volume_water"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      className="w-full"
                      value={value}
                      onValueChange={(e) => onChange(e.value)}
                      showButtons
                      suffix={'л'}
                    />
                    <span className="reg-label">
                      <label>{"Об'єм води"}</label>
                    </span>
                  </FloatLabel>
                )}
              />

              {/* m_g (Маса зерна) */}
              <Controller
                name="mass_grain"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      className="w-full"
                      value={value}
                      onValueChange={(e) => onChange(e.value)}
                      showButtons
                      suffix={'кг'}
                    />
                    <span className="reg-label">
                      <label>{'Маса зерна'}</label>
                    </span>
                  </FloatLabel>
                )}
              />

              {/* S (Вміст цукру) */}
              <Controller
                name="sugar_content"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      className="w-full"
                      value={value}
                      onValueChange={(e) => onChange(e.value)}
                      showButtons
                      suffix={'г/л'}
                    />
                    <span className="reg-label">
                      <label>{'Вміст цукру у суслі'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
            </div>

            <div className="flex flex-row gap-2 w-full">
              {/* S_max (Максимальний вміст цукру) */}
              <Controller
                name="sugar_content_max"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      className="w-full"
                      value={value}
                      onValueChange={(e) => onChange(e.value)}
                      showButtons
                      suffix={'г/л'}
                    />
                    <span className="reg-label">
                      <label>{'Максимальний початковий вміст цукру'}</label>
                    </span>
                  </FloatLabel>
                )}
              />

              {/* t (Час) */}
              <Controller
                name="time"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      className="w-full"
                      value={value}
                      onValueChange={(e) => onChange(e.value)}
                      showButtons
                      suffix={'год'}
                    />
                    <span className="reg-label">
                      <label>{'Час осахарювання'}</label>
                    </span>
                  </FloatLabel>
                )}
              />

              {/* T (Температура) */}
              <Controller
                name="temperature"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      className="w-full"
                      value={value}
                      onValueChange={(e) => onChange(e.value)}
                      showButtons
                      suffix={'°C'}
                    />
                    <span className="reg-label">
                      <label>{'Температура'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
            </div>

            <div className="flex flex-row align-content-center justify-content-center gap-2 w-full">
              <Button label={t('calculate_button')} type="submit" />
            </div>
          </form>
        </div>
        <div className="flex flex-row gap-2 m-2">
          <span
            onClick={() =>
              handleClick('Відношення води до зерна (R)', `R = V_w / m_g, де V_w - об'єм води, m_g - маса зерна.`)
            }
            style={{ cursor: 'pointer' }}
          >
            Відношення води до зерна (R): {results.R} л/кг
          </span>
          <span
            onClick={() =>
              handleClick('Час ферментації (t_f)', 't_f = S / k, де S - вміст цукру, k - константа осахарювання')
            }
            style={{ cursor: 'pointer' }}
          >
            Час ферментації: t<sub> f</sub> : {results.tf} год
          </span>
        </div>
        <div className="flex flex-row gap-2 m-2">
          <span
            onClick={() =>
              handleClick(
                'Маса етилового спирту (А)',
                `А = 0,51 * S * V_w, де 0.51 - константа, що враховує середню ефективність бродіння, S - вміст цукру, V_w - об'єм води.`,
              )
            }
            style={{ cursor: 'pointer' }}
          >
            Маса етилового спирту (A): {results.A} г
          </span>
          <span
            onClick={() =>
              handleClick(
                'Поточна концентрація цукру в суслі (S)',
                'S = S_max * (1 - e^(-kt)), де S_max - максимальна початкова концентрація цукру, k - константа осахарювання, t - час осахарювання.',
              )
            }
            style={{ cursor: 'pointer' }}
          >
            Поточна концентрація цукру в суслі (S): {results.S} г/л
          </span>

          <Dialog header={dialogHeader} visible={dialogVisible} onHide={hideDialog} className="dialog">
            <p>{dialogHint}</p>
          </Dialog>
        </div>
        <div className="flex flex-column w-full">
          <div className="flex flex-row w-full align-content-center justify-content-center">
            <p>Графік залежності коефіцієнта осахарювання від температури під час затирання в процесі пивоваріння</p>
          </div>
          <div className="flex flex-row w-full align-content-center justify-content-center" style={{ height: '300px' }}>
            <Chart
              style={{ height: '100%' }}
              options={{
                data: chartData,
                primaryAxis,
                secondaryAxes,
                dark: true,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CalcMashingPage;
