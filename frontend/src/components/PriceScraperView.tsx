import React, { useState, useEffect } from 'react';
import { PartQuote } from '../types';
import { api } from '../services/api';
import { 
  ReceiptText, 
  RefreshCw, 
  TrendingDown, 
  Bolt, 
  Truck, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Filter 
} from 'lucide-react';

interface PriceScraperViewProps {
  onSelectPartForOS?: (quote: PartQuote) => void;
}

export const PriceScraperView: React.FC<PriceScraperViewProps> = ({ onSelectPartForOS }) => {
  const [quotes, setQuotes] = useState<PartQuote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshingPart, setRefreshingPart] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await api.getQuotes();
      setQuotes(data);
    } catch (e) {
      console.error('Erro ao buscar cotações:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSingle = async (partNumber: string, basePrice: number, sup: string) => {
    setRefreshingPart(partNumber);
    try {
      const updated = await api.getQuote(partNumber, basePrice, sup);
      setQuotes(prev => prev.map(q => q.codigo_peca === partNumber ? { ...q, ...updated } : q));
    } catch (e) {
      console.error('Erro ao re-cotar peça:', e);
    } finally {
      setRefreshingPart(null);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const filteredQuotes = quotes.filter(q => 
    q.codigo_peca.toLowerCase().includes(search.toLowerCase()) ||
    q.fornecedor_encontrado.toLowerCase().includes(search.toLowerCase()) ||
    (q.componente_critico && q.componente_critico.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      {/* KPI METRIC SUMMARY BAR DO SCRAPER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
              Economia em Cotações
            </span>
            <span className="p-2 rounded-xl bg-slate-100 text-emerald-600">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">-4.2%</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
              Economia Média
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full w-[72%] rounded-full" />
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2">
            R$ 14.820 poupados em 48h
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
              Part Numbers Ativos
            </span>
            <span className="p-2 rounded-xl bg-slate-100 text-sky-700">
              <Bolt className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {quotes.length || 20}
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">códigos rastreados</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-sky-500 h-full w-[95%] rounded-full" />
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2">
            Varredura contínua na web
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
              Disponibilidade Média
            </span>
            <span className="p-2 rounded-xl bg-slate-100 text-sky-700">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">2.4</span>
            <span className="text-xs font-bold text-slate-500 font-mono">dias lead time</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full w-[88%] rounded-full" />
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2">
            Hub Regional Sudoeste
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
              Status do Scraper Worker
            </span>
            <span className="p-2 rounded-xl bg-slate-100 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-extrabold text-emerald-600 tracking-tight">4/4 Nodes</span>
            <span className="text-xs font-bold text-slate-500 font-mono">100% Online</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full w-[100%] rounded-full" />
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2">
            Delay Sync: ~340ms
          </span>
        </div>
      </div>

      {/* TABELA DE COTAÇÃO VIVA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-100 text-sky-700">
              <ReceiptText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Cotações Vivas de Componentes Industriais (Scraper)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Varredura automatizada por Part Number e cruzamento com fornecedores homologados
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Buscar código de peça ou fornecedor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-sky-600 font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={fetchQuotes}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-400 font-mono border-b border-slate-200">
                <th className="py-3 px-4">Part Number</th>
                <th className="py-3 px-4">Componente Crítico</th>
                <th className="py-3 px-4">Fornecedor Encontrado</th>
                <th className="py-3 px-3 text-right">Preço Atual</th>
                <th className="py-3 px-3 text-right">Ref. ERP</th>
                <th className="py-3 px-3 text-center">Variação %</th>
                <th className="py-3 px-3 text-center">Lead Time</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredQuotes.map((q) => {
                const isRefreshing = refreshingPart === q.codigo_peca;
                const isSaving = q.variacao_percent <= 0;

                return (
                  <tr key={q.codigo_peca} className="hover:bg-slate-50 transition-colors">
                    {/* Part Number */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                        <span>{q.codigo_peca}</span>
                      </div>
                    </td>

                    {/* Componente */}
                    <td className="py-3 px-4 font-sans text-slate-700">
                      <div>
                        <span>{q.componente_critico || 'Componente Mecânico'}</span>
                        {q.maquina_id && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {q.maquina_id}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Fornecedor */}
                    <td className="py-3 px-4 font-sans text-slate-600 text-[11px]">
                      {q.fornecedor_encontrado}
                    </td>

                    {/* Preço Atual Scraper */}
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                      R$ {q.preco_atual_r.toFixed(2)}
                    </td>

                    {/* Referência ERP */}
                    <td className="py-3 px-3 text-right text-slate-400">
                      R$ {q.preco_referencia_r.toFixed(2)}
                    </td>

                    {/* Variação */}
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        isSaving ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {q.variacao_percent > 0 ? `+${q.variacao_percent}%` : `${q.variacao_percent}%`}
                      </span>
                    </td>

                    {/* Lead Time */}
                    <td className="py-3 px-3 text-center text-slate-600">
                      {q.lead_time_dias} dias
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRefreshSingle(q.codigo_peca, q.preco_referencia_r, q.fornecedor_encontrado)}
                          disabled={isRefreshing}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                          <span>{isRefreshing ? 'Cotando...' : 'Re-cotar'}</span>
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
    </div>
  );
};
