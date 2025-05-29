import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import '../styles/process_page.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const HeatExchangerOptimizer: React.FC = () => {
  const [diameter, setDiameter] = useState<number>(0.01);
  const [velocity, setVelocity] = useState<number>(1.0);
  const [Q, setQ] = useState<number>(10000000);
  const [Tv1, setTv1] = useState<number>(64);
  const [Tv2, setTv2] = useState<number>(138);
  const [Tn, setTn] = useState<number>(175.4);
  const [teta, setTeta] = useState<number>(0.98);
  const [Delta_st, setDelta_st] = useState<number>(0.0025);
  const [Lam_st, setLam_st] = useState<number>(43);
  const [Ro, setRo] = useState<number>(957.66);
  const [Cp, setCp] = useState<number>(4221);
  const [v, setV] = useState<number>(0.293 / 1e6);
  const [Lam_v, setLam_v] = useState<number>(0.6832);
  const [Cena_F, setCena_F] = useState<number>(2000);
  const [Cena_ElEn, setCena_ElEn] = useState<number>(5);
  const [result, setResult] = useState<any>(null);
  const [chartVelData, setChartVelData] = useState<any>(null);
  const [chartDiamData, setChartDiamData] = useState<any>(null);

  const R_zagr = 0.00015;
  const Pr_c = 1.278;
  const Kw = 0.0001;
  const Tc = 138.2;
  const Lam_c = 0.685;
  const mu_c = 204.106 / 1e6;
  const L_tr = 3;
  const Pr = 1.735;
  const r1 = 2030.4;
  const mu_s = 157.5 / 1e6;
  const Lambda_s = 0.676;
  const Pr_s = 1.023;
  const Ro_s = 4.66;
  const w11 = 0.162;

  const calculateZ = (d: number, w: number): { Z: number; F_ta: number } => {
    const eps1 = Math.pow(Math.pow(Lam_c / Lambda_s, 3) * (mu_c / mu_s), 0.125);
    const an =
      0.725 * Math.pow((Math.pow(Lam_v, 3) * 9.81 * (Ro - Ro_s) * r1 * 1000) / (v * d * (Tn - Tc)), 0.25) * eps1;
    const a = 25.7 * Math.pow((Ro_s * w11 * w11) / (9.81 * Ro * d), 0.08) * Math.pow((an * d) / Lam_v, -0.5) * an;
    const Alfa_para = (a * 0.84) / Math.pow(10, 0.07);
    const Delta_t = (Tn - Tv1 - (Tn - Tv2)) / Math.log((Tn - Tv1) / (Tn - Tv2));
    const Alfa_vody = (0.021 * Math.pow((w * d) / v, 0.8) * Math.pow(Pr, 0.43) * Math.pow(Pr / Pr_c, 0.25) * Lam_v) / d;
    const K_tp = 1 / (1 / Alfa_para + Delta_st / Lam_st + 1 / Alfa_vody + R_zagr);
    const Q_ta = Q * teta;
    const F_ta = Q_ta / (K_tp * Delta_t);
    const Lambda = 0.11 * Math.pow(Kw / d + (v * 68) / (w * d), 0.25);
    const dP = Lambda * (L_tr / d) * (w ** 2 / 2) * Ro + 7.5 * ((Ro * w ** 2) / 2);
    const G_vody = Q_ta / (Cp * (Tv2 - Tv1));
    const N_nasosa = (G_vody * dP) / (Ro * 0.85);
    const Zatr_F = F_ta * Cena_F;
    const Zatr_ElEn = ((N_nasosa * 8400) / 1000) * Cena_ElEn;
    const Z = Zatr_F + Zatr_ElEn;
    return { Z, F_ta };
  };

  const optimize = () => {
    const { Z, F_ta } = calculateZ(diameter, velocity);
    setResult({ diameter, velocity, F_ta: F_ta.toFixed(2), Z: Z.toFixed(2) });

    const velocities = Array.from({ length: 20 }, (_, i) => 0.5 + i * 0.25);
    const zVel = velocities.map((v) => calculateZ(diameter, v).Z);
    setChartVelData({
      labels: velocities.map((v) => v.toFixed(2) + ' м/с'),
      datasets: [
        {
          label: 'Z від швидкості (грн)',
          data: zVel,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    });

    const diameters = Array.from({ length: 20 }, (_, i) => 0.005 + i * 0.001);
    const zDiam = diameters.map((d) => calculateZ(d, velocity).Z);
    setChartDiamData({
      labels: diameters.map((d) => d.toFixed(3) + ' м'),
      datasets: [
        {
          label: 'Z від діаметра (грн)',
          data: zDiam,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
      ],
    });
  };

  return (
    <div className="p-4 custom-scrollbar" style={{ maxHeight: '710px', overflowY: 'auto' }}>
      <h1 className="text-2xl font-bold text-white">Оптимізація теплообмінного апарата</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <label className="text-white">
          Діаметр труб (м):{' '}
          <input
            type="number"
            value={diameter}
            onChange={(e) => setDiameter(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          Швидкість (м/с):{' '}
          <input
            type="number"
            value={velocity}
            onChange={(e) => setVelocity(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          Q (Вт):{' '}
          <input
            type="number"
            value={Q}
            onChange={(e) => setQ(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          Tv1 (°C):{' '}
          <input
            type="number"
            value={Tv1}
            onChange={(e) => setTv1(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          Tv2 (°C):{' '}
          <input
            type="number"
            value={Tv2}
            onChange={(e) => setTv2(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          Tn (°C):{' '}
          <input
            type="number"
            value={Tn}
            onChange={(e) => setTn(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          Втрати (θ):{' '}
          <input
            type="number"
            value={teta}
            onChange={(e) => setTeta(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          δ стінки (м):{' '}
          <input
            type="number"
            value={Delta_st}
            onChange={(e) => setDelta_st(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          λ стінки (Вт/м·К):{' '}
          <input
            type="number"
            value={Lam_st}
            onChange={(e) => setLam_st(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          ρ рідини (кг/м³):{' '}
          <input
            type="number"
            value={Ro}
            onChange={(e) => setRo(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          cₚ (Дж/кг·К):{' '}
          <input
            type="number"
            value={Cp}
            onChange={(e) => setCp(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          В'язкість (м²/с):{' '}
          <input
            type="number"
            value={v}
            onChange={(e) => setV(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          λ теплоносія (Вт/м·К):{' '}
          <input
            type="number"
            value={Lam_v}
            onChange={(e) => setLam_v(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          Ціна поверхні (грн/м²):{' '}
          <input
            type="number"
            value={Cena_F}
            onChange={(e) => setCena_F(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
        <label className="text-white">
          Ціна ел.енергії (грн/кВт·год):{' '}
          <input
            type="number"
            value={Cena_ElEn}
            onChange={(e) => setCena_ElEn(parseFloat(e.target.value))}
            className="border p-1 w-full"
          />
        </label>
      </div>

      <button onClick={optimize} className="bg-blue-600 mt-2 text-white px-4 py-2 rounded">
        Розрахувати та побудувати графіки
      </button>

      {result && (
        <div className="mt-4 bg-black text-black p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2">Результати:</h2>
          <p>Площа теплообміну: {result.F_ta} м²</p>
          <p>Загальні витрати: {result.Z} грн</p>
        </div>
      )}

      {chartVelData && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-white mb-2">Графік: Z залежно від швидкості</h2>
          <Line data={chartVelData} />
        </div>
      )}

      {chartDiamData && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-white mb-2">Графік: Z залежно від діаметра</h2>
          <Line data={chartDiamData} />
        </div>
      )}
    </div>
  );
};

export default HeatExchangerOptimizer;
