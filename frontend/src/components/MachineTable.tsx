import React, { useState } from 'react';
import { Machine } from '../types';
import { Search, BrainCircuit, ExternalLink, Activity, ArrowUpDown } from 'lucide-react';

interface MachineTableProps {
  machines: Machine[];
  selectedMachineId: string;
  onSelectMachine: (id: string) => void;
  onGoToDiagnosis: (id: string) => void;
  onGoToQuotes: (partNumber: string) => void;
}

export const MachineTable: React.FC<MachineTableProps> = ({
  machines,
  selectedMachineId,
  onSelectMachine,
  onGoToDiagnosis,
  onGoToQuotes
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = machines.filter(m => 
    m.maquina_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.tipo_equipamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.linha_producao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.componente_critico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
      {/* Header da Tabela */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-100 text-sky-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Parque de Máquinas Industriais em Tempo Real
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              20 Ativos Monitorados • Indexados via DuckDB OLAP
            </span>
          </div>
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Filtrar máquina, linha ou peça..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-sky-600 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-400 font-mono border-b border-slate-200">
              <th className="py-3 px-4">Ativo Industrial</th>
              <th className="py-3 px-4">Linha / Setor</th>
              <th className="py-3 px-3 text-center">Vibração RMS</th>
              <th className="py-3 px-3 text-center">Temp (°C)</th>
              <th className="py-3 px-3 text-center">OEE (%)</th>
              <th className="py-3 px-4">Componente Crítico</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Ações Preditivas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {filtered.map((m) => {
              const isSelected = m.maquina_id === selectedMachineId;
              const isCrit = m.status_operacional.toLowerCase().includes('crítico') || m.status_operacional.toLowerCase().includes('critico');
              const isAlert = m.status_operacional.toLowerCase().includes('alerta');

              return (
                <tr
                  key={m.maquina_id}
                  onClick={() => onSelectMachine(m.maquina_id)}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-sky-50/60 font-semibold' : ''
                  }`}
                >
                  {/* Ativo */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        isCrit ? 'bg-red-600 animate-ping' : isAlert ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{m.maquina_id}</span>
                        <span className="text-[11px] text-slate-500 font-sans">{m.tipo_equipamento}</span>
                      </div>
                    </div>
                  </td>

                  {/* Linha */}
                  <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                    {m.linha_producao}
                  </td>

                  {/* Vibração */}
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      m.sensor_vibracao_mm_s >= 7.1
                        ? 'bg-red-100 text-red-800'
                        : m.sensor_vibracao_mm_s >= 2.8
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {m.sensor_vibracao_mm_s.toFixed(2)} mm/s
                    </span>
                  </td>

                  {/* Temp */}
                  <td className="py-3 px-3 text-center">
                    <span className={`font-semibold ${
                      m.sensor_temp_c >= 85 ? 'text-red-600' : m.sensor_temp_c >= 70 ? 'text-amber-600' : 'text-slate-700'
                    }`}>
                      {m.sensor_temp_c.toFixed(1)}°C
                    </span>
                  </td>

                  {/* OEE */}
                  <td className="py-3 px-3 text-center text-slate-800">
                    {m.eficiencia_oee_percent.toFixed(1)}%
                  </td>

                  {/* Componente Crítico */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-sans">{m.componente_critico}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{m.codigo_peca_reposicao}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCrit
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : isAlert
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {m.status_operacional}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onGoToDiagnosis(m.maquina_id)}
                        className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                        title="Ver Diagnóstico AI"
                      >
                        <BrainCircuit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onGoToQuotes(m.codigo_peca_reposicao)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        title="Cotar Part Number"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
