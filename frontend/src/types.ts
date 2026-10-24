export interface Machine {
  maquina_id: string;
  tipo_equipamento: string;
  linha_producao: string;
  turno_operacao: string;
  sensor_temp_c: number;
  sensor_vibracao_mm_s: number;
  pressao_psi: number;
  corrente_eletrica_amp: number;
  nivel_ruido_db: number;
  status_operacional: string;
  horas_uso: number;
  mtbf_horas: number;
  mttr_horas: number;
  eficiencia_oee_percent: number;
  componente_critico: string;
  codigo_peca_reposicao: string;
  fornecedor_homologado: string;
  custo_estimado_peca_r: number;
  lead_time_fornecedor_dias: number;
  historico_falhas_30d: number;
  risco_parada_percent: number;
  proxima_manutencao_dias: number;
  diagnostico_preditivo_ia: string;
  timestamp_leitura?: string;
}

export interface KPI {
  avg_oee: number;
  avg_mtbf: number;
  avg_mttr: number;
  total_leituras: number;
  total_maquinas: number;
  count_normal: number;
  count_alerta: number;
  count_critico: number;
}

export interface ScatterPoint {
  maquina_id: string;
  tipo_equipamento: string;
  linha_producao: string;
  sensor_temp_c: number;
  sensor_vibracao_mm_s: number;
  risco_parada_percent: number;
  status_operacional: string;
  eficiencia_oee_percent: number;
}

export interface ShoppingItem {
  codigo_peca: string;
  descricao: string;
  fornecedor: string;
  quantidade: number;
  urgencia: string;
}

export interface DiagnosisResult {
  status_diagnostico: string;
  grau_confianca_percent: number;
  falha_provavel: string;
  norma_industrial: string;
  tempo_estimado_ate_quebra_horas: number;
  analise_tecnica: string;
  protocolo_intervencao: string[];
  lista_compras: ShoppingItem[];
  resumo_executivo: string;
}

export interface PartQuote {
  codigo_peca: string;
  fornecedor_encontrado: string;
  preco_atual_r: number;
  preco_referencia_r: number;
  variacao_percent: number;
  economia_potencial_r: number;
  lead_time_dias: number;
  disponibilidade: string;
  status_cotacao: string;
  data_cotacao: string;
  maquina_id?: string;
  componente_critico?: string;
}

export interface ServiceOrder {
  id: string;
  maquina_id: string;
  titulo: string;
  descricao: string;
  componente_critico: string;
  prioridade: string;
  status: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  tecnico_responsavel: string;
  data_abertura: string;
  data_previsao: string;
  custo_estimado: number;
}
