import React, { useState, useEffect, useMemo } from 'react';
import { Chart } from 'react-charts';

type TXYProps = {
  xF: number;
  xD: number;
  xW: number;
  PA: number;
  PB: number;
  R: number;
  e: number;
};

export const TXYDiagram: React.FC<TXYProps> = ({ xF, xD, xW, PA, PB, R, e }) => {
  const xVals = useMemo(() => {
    const points: number[] = [];
    const step = 1 / 200;
    for (let i = 0; i <= 1; i += step) {
      points.push(i);
    }
    return points;
  }, []);

  const equilibrium = (x: number) => (PA * x) / (PA * x + PB * (1 - x));
  const enriching = (x: number) => (R / (R + 1)) * x + xD / (R + 1);
  const stripping = (x: number) => {
    const P = e !== 0 ? 1 / e : 1000;
    return ((P + 1) / P) * x - xW / P;
  };
  const feed = (x: number) => xF / e + ((1 - e) * x) / e;

  const chartData = useMemo(() => [
    {
      label: 'Рівноважна крива',
      data: xVals.map((x) => ({ primary: x, secondary: equilibrium(x) })),
    },
    {
      label: 'Зміцнююча секція',
      data: xVals.map((x) => ({ primary: x, secondary: enriching(x) })),
    },
    {
      label: 'Вичерпна секція',
      data: xVals.map((x) => ({ primary: x, secondary: stripping(x) })),
    },
    {
      label: 'Секція живлення',
      data: xVals.map((x) => ({ primary: x, secondary: feed(x) })),
    },
    {
      label: 'Точки F, D, W',
      data: [
        { primary: xF, secondary: equilibrium(xF) },
        { primary: xD, secondary: equilibrium(xD) },
        { primary: xW, secondary: equilibrium(xW) },
      ],
    },
  ], [xVals, xF, xD, xW, PA, PB, R, e]);

  const primaryAxis = useMemo(() => ({
    getValue: (d: { primary: number }) => d.primary,
    label: 'x (мольна частка у рідині)',
  }), []);

  const secondaryAxes = useMemo(() => [{
    getValue: (d: { secondary: number }) => d.secondary,
    label: 'y (мольна частка у парі)',
  }], []);

  return (
    <div style={{ height: '500px', width: '85%' }}>
      <Chart
      style={{ height: '100%', width: '100%' }}
        options={{
          data: chartData,
          primaryAxis,
          secondaryAxes,
          dark: true,
        }}
      />
      Осі: x (мольна частка у рідині), y (мольна частка у парі)
    </div>
  );
};
