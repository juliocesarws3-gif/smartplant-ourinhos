import React from 'react';
import { 
  Activity, 
  BrainCircuit, 
  ReceiptText, 
  ClipboardCheck, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  HardDriveDownload 
} from 'lucide-react';
import { Machine } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  machines: Machine[];
  selectedMachineId: string;
  setSelectedMachineId: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  machines,
  selectedMachineId,
  setSelectedMachineId
}) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col justify-between py-4 border-r border-slate-200 shadow-xs">
      <div className="flex flex-col gap-4">
        {/* Unidade Operacional */}
        <div className="px-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Unidade Operacional
          </span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-700 text-[20px]">
              precision_manufacturing
            </span>
            <span className="font-bold text-slate-800 text-sm tracking-tight">
              Plant Control SENAI
            </span>
          </div>
        </div>

        {/* Seletor de Ativo Industrial */}
        <div className="px-4">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
            Ativo sob Monitoramento
          </label>
          <div className="relative">
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 font-mono text-xs text-slate-800 rounded-lg border border-slate-300 focus:outline-none focus:border-sky-600 pr-8 appearance-none cursor-pointer truncate"
            >
              {machines.map((m) => (
                <option key={m.maquina_id} value={m.maquina_id}>
                  {m.maquina_id} - {m.tipo_equipamento}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Menus de Navegação */}
        <nav className="flex flex-col gap-1 px-3">
          <button
            onClick={() => setActiveTab('telemetria')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'telemetria'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Painel & Telemetria</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostico')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'diagnostico'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Diagnóstico Preditivo AI</span>
          </button>

          <button
            onClick={() => setActiveTab('cotacao')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'cotacao'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>Cotação de Peças</span>
          </button>

          <button
            onClick={() => setActiveTab('ordens')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ordens'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Ordens de Serviço</span>
          </button>
        </nav>
      </div>

      {/* Footer Industrial do Sidebar */}
      <div className="px-4 border-t border-slate-200 pt-3 flex flex-col gap-2 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-500">
          <span>Shift ID</span>
          <span className="font-semibold text-slate-800">T-01A (Manhã)</span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span>Uptime Linha</span>
          <span className="font-semibold text-emerald-600">99.4%</span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span>Motor OLAP</span>
          <span className="font-semibold text-sky-700">DuckDB 1.2k</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 font-sans leading-tight">
          Padrão SENAI Indústria 4.0 • Google Antigravity
        </div>
      </div>
    </aside>
  );
};
