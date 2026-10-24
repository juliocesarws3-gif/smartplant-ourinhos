import React, { useState, useEffect } from 'react';
import { ServiceOrder } from '../types';
import { api } from '../services/api';
import { subscribeToOrders } from '../services/firebase';
import { 
  ClipboardCheck, 
  Plus, 
  Clock, 
  User, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Play, 
  CheckCheck 
} from 'lucide-react';

interface ServiceOrdersProps {
  initialModalData?: any;
  onClearInitialModalData?: () => void;
}

export const ServiceOrders: React.FC<ServiceOrdersProps> = ({
  initialModalData,
  onClearInitialModalData
}) => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [filter, setFilter] = useState<string>('TODAS');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State
  const [maquinaId, setMaquinaId] = useState('EQP-0413');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [componenteCritico, setComponenteCritico] = useState('');
  const [prioridade, setPrioridade] = useState('Alta');
  const [tecnico, setTecnico] = useState('Carlos Mendonça');
  const [custo, setCusto] = useState('250.00');

  const fetchOrders = async () => {
    try {
      const data = await api.getServiceOrders();
      setOrders(data);
    } catch (e) {
      console.error('Erro ao buscar OS:', e);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Listener reativo do Firestore
    const unsubscribe = subscribeToOrders((firestoreOrders) => {
      if (firestoreOrders && firestoreOrders.length > 0) {
        setOrders(firestoreOrders);
      }
    });

    return () => unsubscribe();
  }, []);

  // Abre modal se vier preenchido de outro componente
  useEffect(() => {
    if (initialModalData) {
      setMaquinaId(initialModalData.maquina_id || 'EQP-0413');
      setTitulo(initialModalData.titulo || '');
      setDescricao(initialModalData.descricao || '');
      setComponenteCritico(initialModalData.componente_critico || '');
      setPrioridade(initialModalData.prioridade || 'Crítica');
      setCusto(initialModalData.custo_estimado ? initialModalData.custo_estimado.toString() : '350.00');
      setIsModalOpen(true);
      if (onClearInitialModalData) onClearInitialModalData();
    }
  }, [initialModalData]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createServiceOrder({
        maquina_id: maquinaId,
        titulo,
        descricao,
        componente_critico: componenteCritico,
        prioridade,
        tecnico_responsavel: tecnico,
        custo_estimado: parseFloat(custo) || 250.0
      });
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error('Erro ao criar OS:', err);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    } catch (err) {
      console.error('Erro ao alterar status:', err);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'TODAS') return true;
    return o.status === filter;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER DAS ORDENS DE SERVIÇO */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 text-sky-700">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm">
                Ordens de Serviço de Manutenção (Firebase Firestore)
              </h3>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                NoSQL Sincronizado
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Controle reativo de intervenções preventivas e corretivas no chão de fábrica
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs de Filtro */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-mono">
            {['TODAS', 'ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'EM_ANDAMENTO' ? 'EM ANDAMENTO' : tab}
              </button>
            ))}
          </div>

          {/* Botão Nova OS */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova OS</span>
          </button>
        </div>
      </div>

      {/* LISTA DE CARDS DE ORDENS DE SERVIÇO */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredOrders.map(order => {
          const isDone = order.status === 'CONCLUIDA';
          const isProgress = order.status === 'EM_ANDAMENTO';
          const isCritical = order.prioridade.toLowerCase().includes('crítica') || order.prioridade.toLowerCase().includes('critica');

          return (
            <div
              key={order.id}
              className={`bg-white p-5 rounded-2xl border shadow-xs flex flex-col justify-between transition-all ${
                isProgress ? 'border-amber-300 ring-2 ring-amber-50' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header do Card OS */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs">{order.id}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {order.maquina_id}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isCritical
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {order.prioridade}
                  </span>
                </div>

                {/* Título & Descrição */}
                <div className="mt-3">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {order.titulo}
                  </h4>
                  <p className="text-xs text-slate-600 font-sans mt-1 leading-relaxed">
                    {order.descricao}
                  </p>
                </div>

                {/* Metadados Técnicos */}
                <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200/60 font-mono text-xs flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[10px] text-slate-400 uppercase">Componente:</span>
                    <span className="font-bold text-slate-800">{order.componente_critico}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[10px] text-slate-400 uppercase">Técnico:</span>
                    <span className="font-semibold text-slate-700">{order.tecnico_responsavel}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[10px] text-slate-400 uppercase">Data Abertura:</span>
                    <span className="text-slate-500 text-[11px]">{order.data_abertura}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 uppercase">Custo Est.:</span>
                    <span className="font-extrabold text-slate-900">R$ {order.custo_estimado.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status & Botões de Ação Rápida */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono uppercase tracking-wider ${
                  isDone
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isProgress
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {order.status === 'EM_ANDAMENTO' ? 'Em Andamento' : order.status}
                </span>

                <div className="flex items-center gap-1.5 font-mono text-xs">
                  {order.status === 'ABERTA' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'EM_ANDAMENTO')}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      <span>Iniciar</span>
                    </button>
                  )}

                  {order.status === 'EM_ANDAMENTO' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'CONCLUIDA')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Concluir</span>
                    </button>
                  )}

                  {order.status === 'CONCLUIDA' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'ABERTA')}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-[10px] cursor-pointer transition-colors"
                    >
                      Reabrir
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CRIAÇÃO DE NOVA ORDEM DE SERVIÇO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  Abertura de Ordem de Serviço (OS)
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="flex flex-col gap-3 font-sans text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Máquina / Ativo</label>
                <input
                  type="text"
                  value={maquinaId}
                  onChange={(e) => setMaquinaId(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 rounded-lg border border-slate-300 font-mono text-xs focus:outline-none focus:border-sky-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Título da Intervenção</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Troca de Rolamento Eixo Principal"
                  className="w-full h-9 px-3 bg-slate-50 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-sky-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição do Problema / Diagnóstico</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhes da intervenção preditiva..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-sky-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Componente Crítico</label>
                  <input
                    type="text"
                    value={componenteCritico}
                    onChange={(e) => setComponenteCritico(e.target.value)}
                    placeholder="Ex: Rolamento SKF"
                    className="w-full h-9 px-3 bg-slate-50 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-sky-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:border-sky-600"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica (24-48h)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Técnico Responsável</label>
                  <input
                    type="text"
                    value={tecnico}
                    onChange={(e) => setTecnico(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-sky-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custo Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={custo}
                    onChange={(e) => setCusto(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Salvar Ordem no Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
