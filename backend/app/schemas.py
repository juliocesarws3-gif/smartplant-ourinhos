from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class SensorTickResponse(BaseModel):
    registro_id: str
    maquina_id: str
    tipo_equipamento: str
    linha_producao: str
    sensor_temp_c: float
    sensor_vibracao_mm_s: float
    pressao_psi: float
    corrente_eletrica_amp: float
    nivel_ruido_db: float
    status_operacional: str
    eficiencia_oee_percent: float
    componente_critico: str
    codigo_peca_reposicao: str
    fornecedor_homologado: str
    risco_parada_percent: float

class KPIResponse(BaseModel):
    avg_oee: float
    avg_mtbf: float
    avg_mttr: float
    total_leituras: int
    total_maquinas: int
    count_normal: int
    count_alerta: int
    count_critico: int

class ServiceOrderCreate(BaseModel):
    maquina_id: str
    titulo: str
    descricao: str
    componente_critico: str
    prioridade: str
    tecnico_responsavel: str
    custo_estimado: Optional[float] = 200.0

class ServiceOrderStatusUpdate(BaseModel):
    status: str
