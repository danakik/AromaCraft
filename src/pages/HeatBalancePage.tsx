import React, { useState, useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { ACUserComp } from '../components/usercomp';
import { ACStatusComp } from '../components/statuscomp';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { AxisOptions, Chart } from 'react-charts';
import { toast } from 'react-toastify';
import { TXYDiagram } from '../components/txydiagramm';
import { useTranslation } from 'react-i18next';
import '../styles/process_page.css';

const HeatBalancePage = () => {
  const key = localStorage.getItem('samogonKey');
  const { t } = useTranslation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogHeader, setDialogHeader] = useState('');
  const [dialogHint, setDialogHint] = useState('');
  const [substance, setSubstance] = useState<string>('вода');
  const [dialogVisible2, setDialogVisible2] = useState(false);

  const handleClick = (header: string, hint: string) => {
    setDialogHeader(header);
    setDialogHint(hint);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const hideDialog2 = () => {
    setDialogVisible2(false);
  };

  // Типи коефіцієнтів Антуана
  type AntoineCoefficients = {
    A: number;
    B: number;
    C: number;
  };

  // Коефіцієнти для води та етанолу
  const substances: Record<string, AntoineCoefficients> = {
    вода: { A: 8.07131, B: 1730.63, C: 233.426 },
    етанол: { A: 8.20417, B: 1642.89, C: 230.3 },
  };

  const dataTable = [
    { t: 50, i: 100000, I: 230000 },
    { t: 60, i: 120000, I: 250000 },
    { t: 70, i: 140000, I: 270000 },
    { t: 80, i: 160000, I: 290000 },
    { t: 90, i: 180000, I: 310000 },
    { t: 100, i: 200000, I: 330000 },
  ];

  const substanceOptions = [
    { label: 'Вода', value: 'вода' },
    { label: 'Етанол', value: 'етанол' },
  ];

  type FormData = {
    xA: number;
    xF: number;
    xD: number;
    xW: number;
    P_A: number;
    P_B: number;
    t: number;
    F: number;
    W: number;
    i_F: number;
    i_W: number;
    i_f: number;
    I: number;
    R: number;
    Pch: number;
  };

  const initValues: FormData = {
    xA: 0.5, // молярна частка A в рідині
    xF: 0.5, // молярна частка A в живленні
    xD: 0.9, // молярна частка A у дистиляті
    xW: 0.1, // молярна частка A у залишку
    P_A: 607, // тиск пари компонента A (мм рт.ст.)
    P_B: 267, // тиск пари компонента B (мм рт.ст.)
    t: 78, // температура (°C)
    F: 100, // масова витрата живлення (кмоль/сек)
    W: 40, // масова витрата залишку (кмоль/сек)
    i_F: 40000, // ентальпія живлення, рідка фаза (Дж/кмоль)
    i_W: 30000, // ентальпія залишку, охолоджена рідина (Дж/кмоль)
    i_f: 35000, // ентальпія флегми, сконденсована рідина (Дж/кмоль)
    I: 100000, // ентальпія пари (перегріта або насичена) (Дж/кмоль)
    R: 0.7, // флегмове число
    Pch: 0.6, // парове число (пара/рідину)
  };

  const [diagramParams, setDiagramParams] = useState<Props>({
    xF: initValues.xF,
    xD: initValues.xD,
    xW: initValues.xW,
    PA: initValues.P_A,
    PB: initValues.P_B,
    R: initValues.R,
    e: 1,
  });

  const schema = yup.object().shape({
    xA: yup.number().typeError('Введіть число').positive().min(0).max(1).required(t('calculate_required')),
    xF: yup.number().typeError('Введіть число').positive().min(0).max(1).required(t('calculate_required')),
    xD: yup.number().typeError('Введіть число').positive().min(0).max(1).required(t('calculate_required')),
    xW: yup.number().typeError('Введіть число').positive().min(0).max(1).required(t('calculate_required')),
    P_A: yup.number().typeError('Введіть число').positive().required(t('calculate_required')),
    P_B: yup.number().typeError('Введіть число').positive().required(t('calculate_required')),
    t: yup
      .number()
      .typeError('Введіть число')
      .positive()
      .min(50, 'Температура повинна бути не меншою за 50°C')
      .max(80, 'Температура не повинна перевищувати 80°C')
      .required(t('calculate_required')),
    F: yup.number().typeError('Введіть число').positive().required(t('calculate_required')),
    W: yup.number().typeError('Введіть число').positive().required(t('calculate_required')),
    i_F: yup.number().typeError('Введіть число').positive().required(t('calculate_required')),
    i_W: yup.number().typeError('Введіть число').positive().required(t('calculate_required')),
    i_f: yup.number().typeError('Введіть число').positive().required(t('calculate_required')),
    I: yup.number().typeError('Введіть число').positive().required(t('calculate_required')),
    R: yup.number().typeError('Введіть число').positive().min(0.5).required(t('calculate_required')),
    Pch: yup.number().typeError('Введіть число').positive().required(t('calculate_required')),
  });

  const [results, setResults] = useState<{
    P: number;
    p_A: number;
    y_A: number;
    D: number;
    e: number;
    eW: number;
    Q: number;
    P_i: number;
    point_F: number;
    point_D: number;
    point_W: number;
  }>({
    P: 0,
    p_A: 0,
    y_A: 0,
    D: 0,
    e: 0,
    eW: 0,
    Q: 0,
    P_i: 0,
    point_F: 0,
    point_D: 0,
    point_W: 0,
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
    const P = parseFloat((data.P_A * data.xA + data.P_B * (1 - data.xA)).toFixed(2));
    const p_A = parseFloat((data.P_A * data.xA).toFixed(2));
    const y_A = parseFloat((p_A / P).toFixed(2));

    const D = parseFloat(((data.F * data.xF - data.W * data.xW) / data.xD).toFixed(2));
    const e = parseFloat((D / data.F).toFixed(2));
    const eW = parseFloat((1 - e).toFixed(2));

    const Q = parseFloat(((P * data.R * (data.I - data.i_f) + P * (data.I - data.i_F)) * 0.95).toFixed(2));
    const { A, B, C } = substances[substance];
    const logP = A - B / (C + data.t);
    const P_i = parseFloat(Math.pow(10, logP).toFixed(2));
    const point_F = (data.P_A * data.xF) / (data.P_A * data.xF + data.P_B * (1 - data.xF));
    const point_D = (data.P_A * data.xD) / (data.P_A * data.xD + data.P_B * (1 - data.xD));
    const point_W = (data.P_A * data.xW) / (data.P_A * data.xW + data.P_B * (1 - data.xW));
    setResults({ P, p_A, y_A, D, e, eW, Q, P_i, point_F, point_D, point_W });
    setDiagramParams({
      xF: data.xF,
      xD: data.xD,
      xW: data.xW,
      PA: data.P_A,
      PB: data.P_B,
      R: data.R,
      e: e,
    });
  };

  type Props = {
    xF: number;
    xD: number;
    xW: number;
    PA: number;
    PB: number;
    R: number;
    e: number;
  };

  return (
    <>
      <header className="mb-1">
        <div style={{ float: 'right' }}>
          <ACUserComp serial_number={key || ''} />
        </div>
      </header>
      <div
        className="flex flex-column w-full align-items-start justify-content-start mt-10 custom-scrollbar"
        style={{ maxHeight: '710px', overflowY: 'auto', width: '90%', paddingRight: '4px' }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-column w-full">
            <h3
              className="m-15"
              onClick={() =>
                handleClick(
                  'Рівновага в системах пар-рідина. Фазові рівноваги',
                  `Рівновага в системах пар–рідина - це стан, коли швидкість випаровування = швидкості конденсації. Температура та тиск постійні, а співвідношення компонентів у парі та рідині стабільне. Використовується для опису поведінки сумішей у ректифікації, дистиляції тощо.
                  Фазові рівноваги вказують, як компоненти розподіляються між фазами (рідина ↔ пара) при заданих умовах. Зображуються на фазових діаграмах Важливі для визначення умов переходу між фазами.
                  Закон Рауля описує парціальний тиск компонента в парі: чим більше компоненту в рідині, тим більше його пари.
                  Закон Дальтона. Парціальний тиск кожного газу в суміші пропорційний його частці. Загальний тиск — сума парціальних тисків усіх компонентів.
                  Ці закони разом дозволяють розраховувати склад пари та рідини в рівновазі.`,
                )
              }
              style={{ cursor: 'pointer' }}
            >
              Рівновага в системах пар-рідина. Фазові рівноваги
            </h3>
            <br />
            <div className="flex flex-row w-full justify-content-evenly align-content-evenly mt-20">
              {/*xA*/}
              <Controller
                name="xA"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      showButtons
                      minFractionDigits={2}
                      maxFractionDigits={2}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                    <span className="reg-label">
                      <label>{'Мольна частка компоненту A'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
              {/* P_A */}
              <Controller
                name="P_A"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      min={0}
                      suffix="мм рт.ст."
                    />
                    <span className="reg-label">
                      <label>{'Тиск насиченої пари компонента A'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
              {/* P_B */}
              <Controller
                name="P_B"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      min={0}
                      suffix="мм рт.ст."
                    />
                    <span className="reg-label">
                      <label>{'Тиск насиченої пари компонента B'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
            </div>
            <div className="flex flex-row w-full justify-content-center align-content-center">
              <p>Результат: </p>
              <span
                onClick={() =>
                  handleClick(
                    'Загальний тиск системи (P), мм рт. ст.',
                    `P = p_A + p_B = P_A * x_A + P_B * (1 - x_A) , де pA, pB - парціальні тиски компонентів А і В в парі; xA - мольна частка компонента А в рідині.`,
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                Загальний тиск системи (P): {results.P} мм рт. ст.
              </span>
            </div>
            <div className="flex flex-column w-full justify-content-evenly align-content-evenly mt-20">
              
              <Divider />
              <div className="flex flex-row w-full justify-content-center align-content-center gap-4">
                {/* t */}
                <Controller
                  name="t"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FloatLabel>
                      <InputNumber
                        value={value}
                        className="w-full"
                        onValueChange={(e) => onChange(e.value)}
                        min={50}
                        max={80}
                        step={0.1}
                        maxFractionDigits={1}
                        suffix="°C"
                      />
                      <span className="reg-label">
                        <label>{'Температура'}</label>
                      </span>
                    </FloatLabel>
                  )}
                />

                <FloatLabel>
                  <Dropdown
                    value={substance}
                    options={substanceOptions}
                    onChange={(e) => setSubstance(e.value)}
                    className="w-full"
                  />
                  <span className="reg-label">
                    <label htmlFor="substance">{'Речовина'}</label>
                  </span>
                </FloatLabel>
              </div>
              <span
                onClick={() =>
                  handleClick(
                    'Тиск насиченої пари компонетаи (P_i), мм рт. ст.',
                    `Визначення тиску насиченої пари для води чи етанолу (якщо немає експериментальних значень). Можна наблизити тиск насиченої пари для будь-якої температури з допомогою рівняння Антуана: P_i = log_10(P) = A - (B / (C + t)). Для етанолу: A = 8.20417; B = 1642.89; C = 230.3; Для води: A = 8.07131; B = 1730.63; C = 233.426 `,
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                Тиск насиченої пари компонета (P_i): {results.P_i} мм рт. ст.
              </span>
              <Divider />
            </div>
          </div>
          <div className="flex flex-column w-full">
            <h3
              className="m-15"
              onClick={() =>
                handleClick(
                  'Матеріальний баланс',
                  `Розрахунок матеріального балансу забезпечує: контроль кількості речовин у процесі; перевірку замкненості системи.; оцінку ефективності відбору продуктів.
                  Відносний відбір ректифікату допомагає оцінити, скільки цінного продукту вдалося відібрати.
                  Відносний відбір залишку дає уявлення, скільки важкого залишку залишилося в кубі.`,
                )
              }
              style={{ cursor: 'pointer' }}
            >
              Матеріальний баланс
            </h3>
            <br />
            <div className="flex flex-row w-full justify-content-evenly align-content-evenly mt-10">
              {/* xF */}
              <Controller
                name="xF"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      min={0}
                      max={1}
                      step={0.01}
                      maxFractionDigits={3}
                    />
                    <span className="reg-label">
                      <label>{'Мольна частка НК у вихідній суміші'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
              {/* xD */}
              <Controller
                name="xD"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      min={0}
                      max={1}
                      step={0.01}
                      maxFractionDigits={3}
                    />
                    <span className="reg-label">
                      <label>{'Мольна частка НК у дистиляті'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
              {/* xW */}
              <Controller
                name="xW"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      min={0}
                      max={1}
                      step={0.01}
                      maxFractionDigits={3}
                    />
                    <span className="reg-label">
                      <label>{'Мольна частка НК у залишку'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
            </div>
            <div className="flex flex-row w-full justify-content-evenly align-content-evenly mt-10">
              {/* F */}
              <Controller
                name="F"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      suffix="кмоль/сек"
                      min={0}
                      max={1000}
                      step={1}
                      maxFractionDigits={2}
                      showButtons
                    />
                    <span className="reg-label">
                      <label>{'Кількість суміші, що подається'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
              {/* W */}
              <Controller
                name="W"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      suffix="кмоль/сек"
                      min={0}
                      max={1000}
                      step={1}
                      maxFractionDigits={2}
                      showButtons
                    />
                    <span className="reg-label">
                      <label>{'Кількість залишку'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
            </div>
            <div className="flex flex-row w-full justify-content-evenly align-content-evenly mt-10">
              {/* R */}
              <Controller
                name="R"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      min={0.5}
                      max={10}
                      step={0.1}
                      maxFractionDigits={2}
                      showButtons
                    />
                    <span className="reg-label">
                      <label>{'Флегмове число'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
              {/* П */}
              <Controller
                name="Pch"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      min={0.5}
                      max={10}
                      step={0.1}
                      maxFractionDigits={2}
                      showButtons
                    />
                    <span className="reg-label">
                      <label>{'Парове число'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
            </div>
            <div className="flex flex-column w-full justify-content-center align-content-center">
              <p>Результат: </p>
              <span
                onClick={() =>
                  handleClick(
                    'Кількість отриманого дистиляту  (D),кмоль/сек',
                    `D = F - W, де F - кількість суміші, що поступає на ректифікацію , W - кількість залишку.`,
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                Кількість отриманого дистиляту (D): {results.D} кмоль/сек
              </span>
              <span
                onClick={() =>
                  handleClick(
                    'Відносний відбір ректифікату  (ε)',
                    `ε = D / F, де F - кількість суміші, що поступає на ректифікацію , D - кількість отриманого дистиляту.`,
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                Відносний відбір ректифікату (ε): {results.e}
              </span>
              <span
                onClick={() =>
                  handleClick(
                    'Відносний відбір залишку  (1-ε)',
                    `1-ε = 1 - W / F, де F - кількість суміші, що поступає на ректифікацію , W - кількість залишку.`,
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                Відносний відбір залишку (1-ε): {results.eW}
              </span>
            </div>
          </div>
          <div className="flex flex-column w-full">
            <Divider />
            <h3
              className="m-15"
              onClick={() =>
                handleClick(
                  'Тепловий баланс',
                  `Розрахунок теплового балансу допомагає визначити необхідну кількість тепла, яке треба подати в куб для підтримання процесу. Оцінити енергоспоживання та ефективність колони. Визначити навантаження на парогенератор. Знайти оптимальну температуру подачі та відбору.`,
                )
              }
              style={{ cursor: 'pointer' }}
            >
              Тепловий баланс
            </h3>
            <br />
            <div className="flex flex-row w-full justify-content-evenly align-content-evenly mt-10">
              {/* i_F */}
              <Controller
                name="i_F"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      suffix="Дж/кмоль"
                      min={0}
                      max={10000}
                      step={10}
                      maxFractionDigits={2}
                    />
                    <span className="reg-label">
                      <label>{'Ентальпія подачі'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
              {/* i_W */}
              <Controller
                name="i_W"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      suffix="Дж/кмоль"
                      min={0}
                      max={10000}
                      step={10}
                      maxFractionDigits={2}
                    />
                    <span className="reg-label">
                      <label>{'Ентальпія залишку'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
              {/* i_Ф */}
              <Controller
                name="i_f"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      suffix="Дж/кмоль"
                      min={0}
                      max={10000}
                      step={10}
                      maxFractionDigits={2}
                    />
                    <span className="reg-label">
                      <label>{'Ентальпія флегми'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
              {/* І */}
              <Controller
                name="I"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FloatLabel>
                    <InputNumber
                      value={value}
                      className="w-full"
                      onValueChange={(e) => onChange(e.value)}
                      suffix="Дж/кмоль"
                      min={0}
                      max={100000}
                      step={100}
                      maxFractionDigits={0}
                    />
                    <span className="reg-label">
                      <label>{'Ентальпія пари'}</label>
                    </span>
                  </FloatLabel>
                )}
              />
            </div>
            <div className="flex flex-row w-full justify-content-evenly align-content-evenly mt-10">
              <Button label="Таблиця ентальпій" onClick={() => setDialogVisible2(true)} />
              <Dialog
                header="Оцінка ентальпії (Дж/кмоль)"
                visible={dialogVisible2}
                style={{ width: '60%' }}
                onHide={hideDialog2}
              >
                <DataTable value={dataTable} tableStyle={{ minWidth: '95%' }} stripedRows>
                  <Column field="t" header="Температура, °C"></Column>
                  <Column
                    field="i"
                    header="Ентальпія рідини (i)"
                    body={(rowData) => `${rowData.i.toLocaleString()} Дж/кмоль`}
                  ></Column>
                  <Column
                    field="I"
                    header="Ентальпія пари (I)"
                    body={(rowData) => `${rowData.I.toLocaleString()} Дж/кмоль`}
                  ></Column>
                </DataTable>
              </Dialog>
            </div>
            <div className="flex flex-row w-full justify-content-center align-content-center">
              <p>Результат: </p>
              <span
                onClick={() =>
                  handleClick(
                    'Тепловий баланс (Q), Дж',
                    `Q = PR(I - i_Φ) + P(I - i_F) + W(i_W - i_F) + Q_вт , де Q – кількість тепла, що підводиться до кубу, Дж; W, Ф – кількість залишку та флегми, кмоль/ сек.; І – ентальпія парів, Дж/ кмоль; iF, iW, iФ – ентальпія суміші, залишку та флегми, Дж/ кмоль; P - загальний тиск в системі, мм.рт.ст.; R - флегмове число.`,
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                Тепловий баланс (Q): {results.Q} Дж
              </span>
            </div>
          </div>
          <div className="flex flex-row w-full justify-content-center align-content-center">
            <Button label={t('calculate_button')} type="submit" />
            <Dialog header={dialogHeader} visible={dialogVisible} onHide={hideDialog} className="dialog">
              <p>{dialogHint}</p>
            </Dialog>
          </div>
          <div className="flex flex-column w-full">
            <Divider />
            <h3
              className="m-15"
              onClick={() =>
                handleClick(
                  'ФАЗОВА ДІАГРАМА t – x – y',
                  `Фазова діаграма t–x–y (температура – мольна частка в рідині – мольна частка в парі) надає візуальне уявлення про фазову рівновагу в бінарній системі (двокомпонентній суміші)`,
                )
              }
              style={{ cursor: 'pointer' }}
            >
              ФАЗОВА ДІАГРАМА t – x – y
            </h3>
            <TXYDiagram
              xF={diagramParams.xF}
              xD={diagramParams.xD}
              xW={diagramParams.xW}
              PA={diagramParams.PA}
              PB={diagramParams.PB}
              R={diagramParams.R}
              e={diagramParams.e}
            />
          </div>
          <div className="flex flex-row w-full justify-content-evenly align-content-evenly">
            <span
              onClick={() =>
                handleClick(
                  'Рівноважна крива (Equilibrium curve)',
                  `Відображає співвідношення між складом рідини (x) і пари (y) у рівновазі. Побудована на основі законів Рауля та Дальтона. Крива завжди лежить вище діагоналі (y = x) для бінарної суміші, де леткі компоненти різні.`,
                )
              }
              style={{ cursor: 'pointer', color: '#3996b5' }}
            >
              Рівноважна крива
            </span>
            <span
              onClick={() =>
                handleClick(
                  'Зміцнююча секція (Rectifying section)',
                  `Верхня частина колони — вище точки живлення. В ній відбувається збагачення пари легколетким компонентом. Робоча лінія розміщується нижче рівноважної кривої. Рівняння: y = (R/(R+1))x+(x_D/(R+1))`,
                )
              }
              style={{ cursor: 'pointer', color: '#f6b15c' }}
            >
              Зміцнююча секція
            </span>
            <span
              onClick={() =>
                handleClick(
                  'Вичерпна секція (Stripping section)',
                  `Нижня частина колони — нижче точки живлення. В ній пар піднімається й видаляє леткий компонент із рідини.Робоча лінія теж нижче рівноважної, але має інший нахилю Рівняння: y=(L'/(L'-V))*(x-x_W), x_W — склад кубового залишку , L' — рідкий потік у цій секції `,
                )
              }
              style={{ cursor: 'pointer', color: '#f27e7e' }}
            >
              Вичерпна секція
            </span>
            <span
              onClick={() =>
                handleClick(
                  'Секція живлення (Feed section)',
                  `Тут з'єднуються дві робочі лінії: зміцнюючої та вичерпної.Характеризується параметром теплового стану живлення q, що показує, наскільки подача є парою чи рідиною. q=1 - насичена рідина, q=0 - насичена пара, 0<q<1 - парорідинна суміш. Рівняння: y = (q/(q-1))x-(x_F/(q-1))`,
                )
              }
              style={{ cursor: 'pointer', color: '#4ec3be' }}
            >
              Секція живлення
            </span>
            <span
              onClick={() =>
                handleClick(
                  'Точки F, D, W',
                  ` Точка F: (${diagramParams.xF} , ${(results.point_F).toFixed(2)})- (Feed) -	Склад і положення потоку живлення, Точка D: (${diagramParams.xD} , ${(results.point_D).toFixed(2)} ) - (Distillate) -	Склад дистиляту (верхній продукт), Точка W: (${diagramParams.xW} , ${(results.point_W).toFixed(2)} ) - (Bottoms) - Склад кубового залишку (нижній продукт).  F показує, де саме подається суміш у колоні та як це впливає на побудову секції живлення. D і W — цілі процесу: до яких концентрацій потрібно дійти згори та знизу. Точки служать контрольними відмітками при оптимізації: наприклад, як зміниться температура чи кількість тарілок при зміні складу F.`,
                )
              }
              style={{ cursor: 'pointer', color: '#8bbb21' }}
            >
              Точки F, D, W
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default HeatBalancePage;
