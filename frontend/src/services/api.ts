import { KPI, Machine, ScatterPoint, DiagnosisResult, PartQuote, ServiceOrder } from '../types';

const API_BASE = 'http://localhost:8000/api';

export const api = {
  async getKPIs(): Promise<KPI> {
    const res = await fetch(`${API_BASE}/sensors/kpis`);
    if (!res.ok) throw new Error('Erro ao carregar KPIs');
    return res.json();
  },

  async getMachines(): Promise<Machine[]> {
    const res = await fetch(`${API_BASE}/sensors/machines`);
    if (!res.ok) throw new Error('Erro ao carregar máquinas');
    return res.json();
  },

  async getMachine(maquinaId: string): Promise<{ latest: Machine; history: Machine[] }> {
    const res = await fetch(`${API_BASE}/sensors/machine/${maquinaId}`);
    if (!res.ok) throw new Error('Erro ao carregar telemetria da máquina');
    return res.json();
  },

  async getScatter(): Promise<ScatterPoint[]> {
    const res = await fetch(`${API_BASE}/sensors/scatter`);
    if (!res.ok) throw new Error('Erro ao carregar dados de dispersão');
    return res.json();
  },

  async getTick(tickId: number): Promise<Machine> {
    const res = await fetch(`${API_BASE}/sensors/tick/${tickId}`);
    if (!res.ok) throw new Error('Erro ao carregar tick de telemetria');
    return res.json();
  },

  async runDiagnosis(machineData: Partial<Machine>): Promise<DiagnosisResult> {
    const res = await fetch(`${API_BASE}/diagnosis/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(machineData)
    });
    if (!res.ok) throw new Error('Erro ao executar diagnóstico AI');
    return res.json();
  },

  async getQuotes(): Promise<PartQuote[]> {
    const res = await fetch(`${API_BASE}/scraper/quotes`);
    if (!res.ok) throw new Error('Erro ao carregar cotações de peças');
    return res.json();
  },

  async getQuote(partNumber: string, basePrice: number, supplier: string): Promise<PartQuote> {
    const params = new URLSearchParams({
      base_price: basePrice.toString(),
      supplier: supplier
    });
    const res = await fetch(`${API_BASE}/scraper/quote/${encodeURIComponent(partNumber)}?${params}`);
    if (!res.ok) throw new Error('Erro ao cotar peça');
    return res.json();
  },

  async getServiceOrders(): Promise<ServiceOrder[]> {
    const res = await fetch(`${API_BASE}/os`);
    if (!res.ok) throw new Error('Erro ao carregar ordens de serviço');
    return res.json();
  },

  async createServiceOrder(data: {
    maquina_id: string;
    titulo: string;
    descricao: string;
    componente_critico: string;
    prioridade: string;
    tecnico_responsavel: string;
    custo_estimado?: number;
  }): Promise<ServiceOrder> {
    const res = await fetch(`${API_BASE}/os`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao abrir ordem de serviço');
    return res.json();
  },

  async updateOrderStatus(orderId: string, status: string): Promise<ServiceOrder> {
    const res = await fetch(`${API_BASE}/os/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Erro ao atualizar status da OS');
    return res.json();
  }
};
