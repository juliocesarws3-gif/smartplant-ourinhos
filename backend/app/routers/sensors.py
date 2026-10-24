from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.core.database import db

router = APIRouter(prefix="/sensors", tags=["Sensors & Telemetry"])

@router.get("/kpis")
def get_kpis():
    """Retorna os KPIs consolidados da planta (OEE, MTBF, MTTR, Status)."""
    return db.get_kpis()

@router.get("/machines")
def get_machines():
    """Retorna a lista de máquinas industriais com a última leitura consolidada."""
    return db.get_all_machines()

@router.get("/machine/{maquina_id}")
def get_machine(maquina_id: str):
    """Retorna o histórico e última telemetria de um ativo específico."""
    data = db.get_machine_telemetry(maquina_id)
    if not data or not data.get("latest"):
        raise HTTPException(status_code=404, detail="Máquina não encontrada no histórico OLAP")
    return data

@router.get("/scatter")
def get_scatter():
    """Retorna pontos para o gráfico de dispersão e curva de risco (Temperatura x Vibração RMS)."""
    return db.get_scatter_data()

@router.get("/tick/{tick_id}")
def get_tick(tick_id: int):
    """Retorna leitura cíclica sequencial para simulação viva de telemetria em tempo real."""
    return db.get_stream_tick(tick_id)
