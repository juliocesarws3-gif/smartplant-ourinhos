import React from 'react';
import { Machine } from '../types';
import { Gauge, AlertTriangle, CheckCircle2, Flame, Activity } from 'lucide-react';

interface GaugeDashboardProps {
  machine: Machine | null;
}

export const GaugeDashboard: React.FC<GaugeDashboardProps> = ({ machine }) => {
  if (!machine) return null;

  const vib = machine.sensor_vibracao_mm_s || 2.4;
  const temp = machine.sensor_temp_c || 68.5;
  const oee = machine.eficiencia_oee_percent || 84.6;

  // Cálculo da agulha para Vibração RMS (0 a 12 mm/s -> -90deg a +90deg)
  const vibAngle = Math.min(90, Math.max(-90, ((vib / 12) * 180) - 90));
  // Temperatura (0 a 120 °C -> -90deg a +90deg)
  const tempAngle = Math.min(90, Math.max(-90, ((temp / 120) * 180) - 90));
  // OEE (0 a 100% -> -90deg a +90deg)
  const oeeAngle = Math.min(90, Math.max(-90, ((oee / 100) * 180) - 90));

  const getVibStatus = (val: number) => {
    if (val < 2.8) return { label: 'Zona A/B: Normal', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (val <= 7.1) return { label: 'Zona C: Alerta de Severidade', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { label: 'Zona D: Risco Crítico de Falha', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  };

  const getTempStatus = (val: number) => {
    if (val < 70) return { label: 'Térmica Estável', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (val < 85) return { label: 'Atenção Térmica', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { label: 'Sobreaquecimento Crítico', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  };

  const getOeeStatus = (val: number) => {
    if (val >= 85) return { label: 'World-Class (Classe Mundial)', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (val >= 65) return { label: 'Operação Típica', color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' };
    return { label: 'Perda de Eficiência', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
  };

  const vibStatus = getVibStatus(vib);
  const tempStatus = getTempStatus(temp);
  const oeeStatus = getOeeStatus(oee);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* GAUGE 1: VIBRAÇÃO RMS (ISO 10816-3) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-100 text-sky-700">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Vibração Global RMS</h3>
              <span className="text-[11px] text-slate-400 font-mono">ISO 10816-3 • Classe III</span>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${vibStatus.bg} ${vibStatus.color}`}>
            {vibStatus.label}
          </span>
        </div>

        {/* Arco SVG Medidor */}
        <div className="relative flex flex-col items-center justify-center my-4">
          <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
            {/* Faixa Normal: 0 a 2.8 mm/s */}
            <path
              d="M 20 100 A 80 80 0 0 1 65 30"
              fill="none"
              stroke="#059669"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Faixa Alerta: 2.8 a 7.1 mm/s */}
            <path
              d="M 69 27 A 80 80 0 0 1 140 30"
              fill="none"
              stroke="#D97706"
              strokeWidth="14"
            />
            {/* Faixa Crítico: > 7.1 mm/s */}
            <path
              d="M 144 32 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#DC2626"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Centro */}
            <circle cx="100" cy="100" r="7" fill="#0F172A" />
            {/* Agulha */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{
                transformOrigin: '100px 100px',
                transform: `rotate(${vibAngle}deg)`,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            />
          </svg>

          <div className="flex flex-col items-center mt-[-8px]">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {vib.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-mono">mm/s RMS</span>
          </div>
        </div>

        {/* Faixas de Referência */}
        <div className="grid grid-cols-3 gap-1 pt-3 border-t border-slate-100 text-[10px] text-center font-mono">
          <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded">
            &lt; 2.8 Normal
          </div>
          <div className="bg-amber-50 text-amber-800 p-1.5 rounded">
            2.8-7.1 Alerta
          </div>
          <div className="bg-red-50 text-red-800 p-1.5 rounded">
            &gt; 7.1 Crítico
          </div>
        </div>
      </div>

      {/* GAUGE 2: TEMPERATURA SUPERFICIAL */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-100 text-amber-600">
              <Flame className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Temperatura Componente</h3>
              <span className="text-[11px] text-slate-400 font-mono">{machine.componente_critico}</span>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tempStatus.bg} ${tempStatus.color}`}>
            {tempStatus.label}
          </span>
        </div>

        {/* Arco SVG Medidor Temperatura */}
        <div className="relative flex flex-col items-center justify-center my-4">
          <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
            <path
              d="M 20 100 A 80 80 0 0 1 85 24"
              fill="none"
              stroke="#059669"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 90 23 A 80 80 0 0 1 145 35"
              fill="none"
              stroke="#D97706"
              strokeWidth="14"
            />
            <path
              d="M 149 37 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#DC2626"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="7" fill="#0F172A" />
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{
                transformOrigin: '100px 100px',
                transform: `rotate(${tempAngle}deg)`,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            />
          </svg>

          <div className="flex flex-col items-center mt-[-8px]">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {temp.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-mono">°C Superfície</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 pt-3 border-t border-slate-100 text-[10px] text-center font-mono">
          <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded">
            &lt; 65°C Segura
          </div>
          <div className="bg-amber-50 text-amber-800 p-1.5 rounded">
            65-85°C Limiar
          </div>
          <div className="bg-red-50 text-red-800 p-1.5 rounded">
            &gt; 85°C Térmico
          </div>
        </div>
      </div>

      {/* GAUGE 3: EFICIÊNCIA GLOBAL OEE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-100 text-sky-700">
              <Gauge className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">OEE do Equipamento</h3>
              <span className="text-[11px] text-slate-400 font-mono">Disponib. × Desemp. × Qual.</span>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${oeeStatus.bg} ${oeeStatus.color}`}>
            {oeeStatus.label}
          </span>
        </div>

        {/* Arco SVG Medidor OEE */}
        <div className="relative flex flex-col items-center justify-center my-4">
          <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
            <path
              d="M 20 100 A 80 80 0 0 1 80 26"
              fill="none"
              stroke="#D97706"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 85 24 A 80 80 0 0 1 130 26"
              fill="none"
              stroke="#0284C7"
              strokeWidth="14"
            />
            <path
              d="M 135 28 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#059669"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="7" fill="#0F172A" />
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{
                transformOrigin: '100px 100px',
                transform: `rotate(${oeeAngle}deg)`,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            />
          </svg>

          <div className="flex flex-col items-center mt-[-8px]">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {oee.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-mono">% OEE Calculado</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 pt-3 border-t border-slate-100 text-[10px] text-center font-mono">
          <div className="bg-amber-50 text-amber-800 p-1.5 rounded">
            &lt; 65% Baixo
          </div>
          <div className="bg-sky-50 text-sky-800 p-1.5 rounded">
            65-85% Típico
          </div>
          <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded">
            &gt; 85% Classe A
          </div>
        </div>
      </div>
    </div>
  );
};
