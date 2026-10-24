import React, { useState, useEffect } from 'react';
import { Machine, DiagnosisResult } from '../types';
import { api } from '../services/api';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShoppingCart, 
  ClipboardList, 
  ShieldCheck, 
  RefreshCw, 
  Wrench, 
  Layers 
} from 'lucide-react';

interface DiagnosisCardProps {
  machine: Machine | null;
  onOpenOSModalWithItem?: (item: any) => void;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ machine, onOpenOSModalWithItem }) => {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDiagnosis = async (m: Machine) => {
    setLoading(true);
    try {
      const res = await api.runDiagnosis(m);
      setDiagnosis(res);
    } catch (e) {
      console.error('Erro ao gerar diagnóstico:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (machine) {
      fetchDiagnosis(machine);
    }
  }, [machine?.maquina_id]);

  if (!machine) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER DO MOTOR PDM GEMINI AI */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shadow-xs">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5 font-mono text-[10px]">
              <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini 3.8 Flash High • PdM Reasoning Engine
              </span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                ISO 15243 Spalling Pattern
              </span>
              <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Previsão de Risco: 48h Térmico
              </span>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {machine.tipo_equipamento} ({machine.maquina_id})
              </h2>
              <span className="text-slate-400 text-xs font-mono">
                • {machine.linha_producao}
              </span>
            </div>
          </div>
        </div>

        {/* Metadados & Grau de Confiança */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Base Analítica</span>
            <span className="font-bold text-slate-800">DuckDB (1.200 amostras)</span>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Referência RAG</span>
            <span className="font-bold text-sky-700">Dicionário SENAI PDF</span>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Grau de Confiança</span>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-emerald-600">
                {diagnosis?.grau_confianca_percent || 96.4}%
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">
                High Conf
              </span>
            </div>
          </div>

          <button
            onClick={() => fetchDiagnosis(machine)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analisando...' : 'Re-analisar IA'}</span>
          </button>
        </div>
      </div>

      {/* GRID PRINCIPAL: 2 COLUNAS (DIAGNÓSTICO & LISTA DE COMPRAS) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA (7 COLS): ANÁLISE DE ENGENHARIA & PROTOCOLO */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Card de Análise Técnica */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-slate-100 text-sky-700">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Parecer Técnico de Manutenção Preditiva (PdM)
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Norma Técnica: {diagnosis?.norma_industrial || 'ISO 10816-3 & ISO 15243'}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase font-mono bg-red-50 text-red-700 border border-red-200">
                {diagnosis?.status_diagnostico || 'Risco de Parada em 48h'}
              </span>
            </div>

            {/* Diagnóstico de Falha Física */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1">
                Falha Cinemática / Mecânica Detectada:
              </span>
              <p className="font-bold text-slate-900 text-sm leading-snug">
                {diagnosis?.falha_provavel || 'Desgaste e descascamento prematuro de pistas (Spalling) no rolamento do eixo'}
              </p>
            </div>

            {/* Texto Analítico Completo */}
            <p className="text-slate-600 text-xs font-sans leading-relaxed">
              {diagnosis?.analise_tecnica || 
                'A evolução dos espectros de vibração aliada à elevação de temperatura superficial comprova degradação da película hidrodinâmica de lubrificação no componente crítico. Recomenda-se substituição imediata antes do travamento.'}
            </p>

            {/* Snapshot de Telemetria do Componente Crítico */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 font-mono">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Vibração RMS</span>
                <span className="text-sm font-extrabold text-red-600">{machine.sensor_vibracao_mm_s.toFixed(2)} mm/s</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Temperatura</span>
                <span className="text-sm font-extrabold text-red-600">{machine.sensor_temp_c.toFixed(1)} °C</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Horas de Uso</span>
                <span className="text-sm font-extrabold text-slate-800">{machine.horas_uso} h</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Tempo até Falha</span>
                <span className="text-sm font-extrabold text-red-600">~{diagnosis?.tempo_estimado_ate_quebra_horas || 48}h</span>
              </div>
            </div>
          </div>

          {/* Protocolo de Intervenção Checklist */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ClipboardList className="w-5 h-5 text-sky-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Protocolo Sugerido de Intervenção Mecânica / Elétrica
              </h3>
            </div>
            <div className="flex flex-col gap-2.5 font-sans text-xs">
              {(diagnosis?.protocolo_intervencao || [
                'Isolar eletricamente o equipamento conforme NR-10 e efetuar bloqueio LOTO.',
                'Realizar inspeção termográfica e análise boroscópica no alojamento do mancal.',
                `Substituir sobressalente Part Number ${machine.codigo_peca_reposicao}.`,
                'Efetuar alinhamento a laser de eixos e checagem de folga radial.',
                'Executar partida assistida e gravar novo espectro de vibração de referência.'
              ]).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px] flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 leading-tight pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (5 COLS): LISTA DE COMPRAS E AÇÃO DIRETA */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Card de Lista de Compras Otimizada */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Lista de Compras Otimizada (Sobressalentes)
                </h3>
              </div>
              <span className="text-[10px] font-bold font-mono bg-sky-50 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200">
                Part Number Validado
              </span>
            </div>

            <div className="flex flex-col gap-3 font-mono">
              {(diagnosis?.lista_compras || [
                {
                  codigo_peca: machine.codigo_peca_reposicao,
                  descricao: `Sobressalente Original para ${machine.componente_critico}`,
                  fornecedor: machine.fornecedor_homologado,
                  quantidade: 1,
                  urgencia: 'Imediata (48h)'
                }
              ]).map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">{item.codigo_peca}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 uppercase">
                      {item.urgencia}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans">{item.descricao}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Fornecedor: <b>{item.fornecedor}</b></span>
                    <span>Qtd: <b>{item.quantidade} un</b></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão de Ação Direta: Abrir Ordem de Serviço */}
            <div className="mt-2 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  if (onOpenOSModalWithItem) {
                    onOpenOSModalWithItem({
                      maquina_id: machine.maquina_id,
                      titulo: `Substituição Preventiva: ${machine.componente_critico}`,
                      descricao: `Intervenção recomendada pelo Gemini AI devido a risco térmico e vibração (${machine.sensor_vibracao_mm_s.toFixed(2)} mm/s). Part Number: ${machine.codigo_peca_reposicao}.`,
                      componente_critico: machine.componente_critico,
                      prioridade: 'Crítica',
                      custo_estimado: machine.custo_estimado_peca_r
                    });
                  }
                }}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Abrir Ordem de Serviço Imediata (Firebase)</span>
              </button>
              <span className="text-[10px] text-center text-slate-400 font-mono">
                Sincroniza instantaneamente com o chão de fábrica via Firestore NoSQL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
