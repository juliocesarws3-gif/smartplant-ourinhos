import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TelemetryPanel } from './components/TelemetryPanel';
import { GaugeDashboard } from './components/GaugeDashboard';
import { ScatterRiskChart } from './components/ScatterRiskChart';
import { MachineTable } from './components/MachineTable';
import { DiagnosisCard } from './components/DiagnosisCard';
import { PriceScraperView } from './components/PriceScraperView';
import { ServiceOrders } from './components/ServiceOrders';
import { Machine, KPI, ScatterPoint } from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('telemetria');
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState<string>('EQP-0413');
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [scatterData, setScatterData] = useState<ScatterPoint[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [tickIndex, setTickIndex] = useState<number>(0);
  const [modalOSData, setModalOSData] = useState<any>(null);

  // Carregamento inicial de dados
  const loadInitialData = async () => {
    try {
      const [kpisData, machinesData, scatter] = await Promise.all([
        api.getKPIs(),
        api.getMachines(),
        api.getScatter()
      ]);
      setKpis(kpisData);
      setMachines(machinesData);
      setScatterData(scatter);
      if (machinesData.length > 0 && !selectedMachineId) {
        setSelectedMachineId(machinesData[0].maquina_id);
      }
    } catch (e) {
      console.error('Erro ao carregar dados iniciais:', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Simulação de Streaming de Telemetria Dinâmica em Tempo Real (Loop dos 1.200 registros DuckDB)
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(async () => {
      try {
        setTickIndex(prev => {
          const next = prev + 1;
          // Busca leitura da telemetria do tick atual
          api.getTick(next).then(streamTick => {
            if (streamTick && streamTick.maquina_id) {
              setMachines(curr => curr.map(m => {
                if (m.maquina_id === streamTick.maquina_id) {
                  return { ...m, ...streamTick };
                }
                return m;
              }));
            }
          }).catch(() => {});
          return next;
        });
      } catch (err) {
        // Silencioso para não interromper UI
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const selectedMachine = machines.find(m => m.maquina_id === selectedMachineId) || machines[0] || null;

  const handleOpenOSModalWithItem = (itemData: any) => {
    setModalOSData(itemData);
    setActiveTab('ordens');
  };

  const handleGoToQuotes = (partNumber: string) => {
    setActiveTab('cotacao');
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Sidebar Fixo Lateral */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        machines={machines}
        selectedMachineId={selectedMachineId}
        setSelectedMachineId={setSelectedMachineId}
      />

      {/* Conteúdo Principal com Offset da Sidebar */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Header Superior Fixo */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isStreaming={isStreaming}
          setIsStreaming={setIsStreaming}
        />

        {/* Workspace Central */}
        <main className="w-full pt-20 p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
          {activeTab === 'telemetria' && (
            <>
              {/* Painel de Telemetria & KPIs Globais */}
              <TelemetryPanel kpis={kpis} selectedMachine={selectedMachine} />

              {/* Gauges Dinâmicos de Vibração, Temperatura e OEE */}
              <GaugeDashboard machine={selectedMachine} />

              {/* Matriz de Dispersão e Curva de Risco Térmico/Vibracional */}
              <ScatterRiskChart
                data={scatterData}
                selectedMachineId={selectedMachineId}
                onSelectMachine={setSelectedMachineId}
              />

              {/* Tabela do Parque de Máquinas com Ações Rápidas */}
              <MachineTable
                machines={machines}
                selectedMachineId={selectedMachineId}
                onSelectMachine={setSelectedMachineId}
                onGoToDiagnosis={(id) => {
                  setSelectedMachineId(id);
                  setActiveTab('diagnostico');
                }}
                onGoToQuotes={handleGoToQuotes}
              />
            </>
          )}

          {activeTab === 'diagnostico' && (
            <DiagnosisCard
              machine={selectedMachine}
              onOpenOSModalWithItem={handleOpenOSModalWithItem}
            />
          )}

          {activeTab === 'cotacao' && (
            <PriceScraperView
              onSelectPartForOS={(quote) => {
                handleOpenOSModalWithItem({
                  maquina_id: quote.maquina_id || selectedMachineId,
                  titulo: `Aquisição Sobressalente: ${quote.codigo_peca}`,
                  descricao: `Cotação web realizada via Scraper. Fornecedor: ${quote.fornecedor_encontrado}. Preço: R$ ${quote.preco_atual_r.toFixed(2)}.`,
                  componente_critico: quote.componente_critico || 'Componente Mecânico',
                  prioridade: 'Alta',
                  custo_estimado: quote.preco_atual_r
                });
              }}
            />
          )}

          {activeTab === 'ordens' && (
            <ServiceOrders
              initialModalData={modalOSData}
              onClearInitialModalData={() => setModalOSData(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
