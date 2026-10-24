import React, { useState, useEffect } from 'react';
import { Activity, Database, Clock, RefreshCw, Cpu, Flame } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isStreaming,
  setIsStreaming
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs h-16">
      <div className="h-full w-full px-6 flex items-center justify-between">
        {/* Logo & Linha */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-sky-700 flex items-center justify-center text-white shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 tracking-tight text-base flex items-center gap-1.5">
                SmartPlant Ourinhos
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                  v4.2 PdM
                </span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Linha 02 • Moagem, Caldeiraria & Envase
              </span>
            </div>
          </div>
        </div>

        {/* Navegação Topo (Tabs) */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setActiveTab('telemetria')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'telemetria'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Painel & Telemetria
          </button>
          <button
            onClick={() => setActiveTab('diagnostico')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'diagnostico'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Diagnóstico Preditivo AI
          </button>
          <button
            onClick={() => setActiveTab('cotacao')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cotacao'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Cotação de Peças
          </button>
          <button
            onClick={() => setActiveTab('ordens')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ordens'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Ordens de Serviço (OS)
          </button>
        </nav>

        {/* Status Clusters & Tickers */}
        <div className="flex items-center gap-3">
          {/* Botão de Streaming em Tempo Real */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isStreaming
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}
            title="Alternar simulação de telemetria cíclica viva"
          >
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            {isStreaming ? 'Streaming IIoT Ativo' : 'Telemetria Pausada'}
          </button>

          {/* Badges IIoT & DuckDB */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-700">Firebase NoSQL</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-700">DuckDB OLAP</span>
            </div>
          </div>

          {/* Relógio de Turno */}
          <div className="hidden sm:flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">{timeStr || '07:42:19'}</span>
            <span className="text-[10px] text-slate-400 font-sans uppercase">Turno 1</span>
          </div>
        </div>
      </div>
    </header>
  );
};
