import React, { useState } from 'react';
import { ScatterPoint } from '../types';
import { Info, ShieldAlert } from 'lucide-react';

interface ScatterRiskChartProps {
  data: ScatterPoint[];
  selectedMachineId: string;
  onSelectMachine: (id: string) => void;
}

export const ScatterRiskChart: React.FC<ScatterRiskChartProps> = ({
  data,
  selectedMachineId,
  onSelectMachine
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null);

  // Amostra representativa para renderização SVG ultra-fluida (150 pontos distribuídos)
  const displayData = data.slice(0, 180);

  // Mapeamento de coordenadas (X: Temp 40 a 110 °C -> 40 a 560px)
  // (Y: Vibração 0.5 a 10 mm/s -> 260 a 30px)
  const mapX = (temp: number) => {
    const min = 40, max = 110;
    const clamped = Math.max(min, Math.min(max, temp));
    return 50 + ((clamped - min) / (max - min)) * 500;
  };

  const mapY = (vib: number) => {
    const min = 0.5, max = 9.5;
    const clamped = Math.max(min, Math.min(max, vib));
    return 240 - ((clamped - min) / (max - min)) * 200;
  };

  const getColor = (status: string, risco: number) => {
    if (risco >= 70 || status.toLowerCase().includes('crítico') || status.toLowerCase().includes('critico')) {
      return '#DC2626';
    }
    if (risco >= 35 || status.toLowerCase().includes('alerta')) {
      return '#D97706';
    }
    return '#059669';
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-100 text-sky-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Matriz de Dispersão e Curva de Risco Preditivo
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Cruzamento Multivariável: Temperatura Superficial (°C) × Vibração RMS (mm/s)
            </span>
          </div>
        </div>

        {/* Legenda de Zonas */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-slate-600">Estável</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Alerta Térmico/Vib</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="text-slate-600">Risco Crítico (48h)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Scatter Plot */}
      <div className="relative w-full h-[280px] bg-slate-50/70 rounded-xl border border-slate-200 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 580 270" preserveAspectRatio="none">
          {/* Zonas de Severidade de Fundo */}
          {/* Zona Crítica (Canto Superior Direito) */}
          <rect
            x={mapX(85)}
            y="30"
            width={560 - mapX(85)}
            height={mapY(7.1) - 30}
            fill="#FEF2F2"
            opacity="0.8"
          />
          <text
            x={545}
            y={50}
            textAnchor="end"
            className="text-[10px] font-bold fill-red-400 font-mono uppercase tracking-wider"
          >
            Zona Crítica ISO 10816
          </text>

          {/* Linhas de Grade de Referência */}
          <line x1="50" y1="240" x2="560" y2="240" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="50" y1="30" x2="50" y2="240" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Linha ISO 10816 Limite de Alerta: 2.8 mm/s */}
          <line
            x1="50"
            y1={mapY(2.8)}
            x2="560"
            y2={mapY(2.8)}
            stroke="#D97706"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text x="55" y={mapY(2.8) - 4} className="text-[9px] fill-amber-700 font-mono">
            Limite Alerta (2.8 mm/s)
          </text>

          {/* Linha ISO 10816 Limite Crítico: 7.1 mm/s */}
          <line
            x1="50"
            y1={mapY(7.1)}
            x2="560"
            y2={mapY(7.1)}
            stroke="#DC2626"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text x="55" y={mapY(7.1) - 4} className="text-[9px] fill-red-700 font-mono font-bold">
            Limite Crítico (7.1 mm/s)
          </text>

          {/* Linha Térmica Limite: 85°C */}
          <line
            x1={mapX(85)}
            y1="30"
            x2={mapX(85)}
            y2="240"
            stroke="#DC2626"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text x={mapX(85) + 4} y="235" className="text-[9px] fill-red-700 font-mono">
            85°C Risco
          </text>

          {/* Plotagem de Pontos */}
          {displayData.map((pt, idx) => {
            const cx = mapX(pt.sensor_temp_c);
            const cy = mapY(pt.sensor_vibracao_mm_s);
            const isSelected = pt.maquina_id === selectedMachineId;
            const color = getColor(pt.status_operacional, pt.risco_parada_percent);

            return (
              <g key={idx} className="cursor-pointer" onClick={() => onSelectMachine(pt.maquina_id)}>
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    className="animate-ping opacity-75"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : 4}
                  fill={color}
                  stroke={isSelected ? '#0F172A' : '#FFFFFF'}
                  strokeWidth={isSelected ? 2 : 1}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="transition-transform hover:scale-150"
                />
              </g>
            );
          })}
        </svg>

        {/* Eixo X Labels */}
        <div className="absolute bottom-1 left-12 right-6 flex justify-between text-[10px] text-slate-400 font-mono">
          <span>40°C</span>
          <span>55°C</span>
          <span>70°C</span>
          <span>85°C</span>
          <span>100°C</span>
          <span>110°C</span>
        </div>

        {/* Tooltip Dinâmico ao passar o mouse */}
        {hoveredPoint && (
          <div
            className="absolute bg-slate-900/95 text-white p-2.5 rounded-lg text-xs shadow-lg pointer-events-none z-20 border border-slate-700 font-mono max-w-xs"
            style={{
              left: `${Math.min(420, Math.max(20, mapX(hoveredPoint.sensor_temp_c) - 60))}px`,
              top: `${Math.max(10, mapY(hoveredPoint.sensor_vibracao_mm_s) - 75)}px`
            }}
          >
            <div className="font-bold text-sky-400">{hoveredPoint.maquina_id} • {hoveredPoint.tipo_equipamento}</div>
            <div className="text-[11px] text-slate-300">{hoveredPoint.linha_producao}</div>
            <div className="mt-1 flex items-center justify-between gap-3 text-[11px]">
              <span>Vib: <b>{hoveredPoint.sensor_vibracao_mm_s.toFixed(2)} mm/s</b></span>
              <span>Temp: <b>{hoveredPoint.sensor_temp_c.toFixed(1)} °C</b></span>
            </div>
            <div className="mt-0.5 text-[10px] text-amber-300">
              Risco: {hoveredPoint.risco_parada_percent.toFixed(0)}% • {hoveredPoint.status_operacional}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
        <span>Clique em qualquer ponto do gráfico para selecionar e auditar o ativo</span>
        <span className="text-slate-700 font-semibold">
          Ativo Selecionado: <span className="text-sky-700">{selectedMachineId}</span>
        </span>
      </div>
    </div>
  );
};
