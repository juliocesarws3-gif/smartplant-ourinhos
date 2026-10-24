import React from 'react';
import { KPI, Machine } from '../types';
import { Gauge, Timer, Wrench, ShieldCheck, Database, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface TelemetryPanelProps {
  kpis: KPI | null;
  selectedMachine: Machine | null;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ kpis, selectedMachine }) => {
  const oee = kpis?.avg_oee ?? 84.6;
  const mtbf = kpis?.avg_mtbf ?? 148.0;
  const mttr = kpis?.avg_mttr ?? 4.2;
  const totalLeituras = kpis?.total_leituras ?? 1200;
  const countNormal = kpis?.count_normal ?? 17;
  const countAlerta = kpis?.count_alerta ?? 2;
  const countCritico = kpis?.count_critico ?? 1;

  const isAlert = selectedMachine?.status_operacional.toLowerCase().includes('alerta');
  const isCritical = selectedMachine?.status_operacional.toLowerCase().includes('crítico') || 
                     selectedMachine?.status_operacional.toLowerCase().includes('critico');

  const badgeColor = isCritical
    ? 'text-red-700 bg-red-50 border-red-300'
    : isAlert
    ? 'text-amber-700 bg-amber-50 border-amber-300'
    : 'text-emerald-700 bg-emerald-50 border-emerald-300';

  return (
    <div className="flex flex-col gap-5">
      {/* BARRA DE ATIVO EM DESTAQUE & STATUS OPERACIONAL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Ativo sob Análise */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
            <span className="material-symbols-outlined text-sky-700 text-[24px]">
              precision_manufacturing
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Ativo sob Análise Preditiva
              </span>
              <span className="font-bold text-slate-900 text-sm tracking-tight">
                {selectedMachine ? `${selectedMachine.maquina_id} • ${selectedMachine.tipo_equipamento}` : 'Bomba Centrífuga P-102'}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {selectedMachine?.linha_producao || 'Linha 02 - Moagem'} • Turno: {selectedMachine?.turno_operacao || 'Manhã (T-01)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isCritical ? 'bg-red-400' : isAlert ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                isCritical ? 'bg-red-600' : isAlert ? 'bg-amber-600' : 'bg-emerald-600'
              }`} />
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeColor}`}>
              {selectedMachine?.status_operacional || 'Operando Normal'}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              | ISO 10816 Classe III
            </span>
          </div>
        </div>

        {/* Metadados DuckDB e Cluster de Saúde da Planta */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-700" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase font-bold">Base DuckDB</span>
              <span className="font-bold text-slate-800">{totalLeituras.toLocaleString()} pts</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase font-bold">Saudáveis</span>
              <span className="font-bold text-slate-800">{countNormal}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase font-bold">Alerta</span>
              <span className="font-bold text-amber-600">{countAlerta}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase font-bold">Crítico</span>
              <span className="font-bold text-red-600">{countCritico}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BENTO GRID 4 COLUNAS: KPIS GLOBAIS DE MANUTENÇÃO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* OEE GERAL */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
              OEE Geral da Planta
            </span>
            <span className="p-2 rounded-xl bg-slate-100 text-sky-700">
              <Gauge className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {oee.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-slate-400">%</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mr-3">
              <div className="bg-sky-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, oee)}%` }} />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 whitespace-nowrap font-mono">
              +1.8% Turno
            </span>
          </div>
        </div>

        {/* MTBF */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
              MTBF (Entre Falhas)
            </span>
            <span className="p-2 rounded-xl bg-slate-100 text-sky-700">
              <Timer className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {mtbf.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-slate-400 font-mono">horas</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Meta: 140h</span>
            <span className="text-emerald-600 font-bold">No SLA</span>
          </div>
        </div>

        {/* MTTR */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
              MTTR (Tempo Reparo)
            </span>
            <span className="p-2 rounded-xl bg-slate-100 text-sky-700">
              <Wrench className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {mttr.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-slate-400 font-mono">horas</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Meta: &lt; 5.0h</span>
            <span className="text-emerald-600 font-bold">Otimizado</span>
          </div>
        </div>

        {/* UPTIME & DISPONIBILIDADE */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
              Disponibilidade Geral
            </span>
            <span className="p-2 rounded-xl bg-slate-100 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              99.4
            </span>
            <span className="text-sm font-bold text-slate-400">%</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>20 Máquinas Ativas</span>
            <span className="text-emerald-600 font-bold">Controle Ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
