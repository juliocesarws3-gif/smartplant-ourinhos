from fastapi import APIRouter, Body
from typing import Dict, Any
from backend.app.services.ai_diagnostician import ai_diagnostician
from backend.app.services.pdf_rag_reader import pdf_rag
from backend.app.core.database import db

router = APIRouter(prefix="/diagnosis", tags=["AI Diagnosis & RAG"])

@router.post("/analyze")
def analyze_machine(payload: Dict[str, Any] = Body(...)):
    """Gera diagnóstico de engenharia preditiva via Gemini AI cruzado com o RAG do PDF SENAI."""
    maquina_id = payload.get("maquina_id")
    machine_data = payload
    if maquina_id:
        existing = db.get_machine_telemetry(maquina_id)
        if existing and existing.get("latest"):
            # Mescla dados atualizados
            machine_data = {**existing["latest"], **payload}
            
    diagnosis = ai_diagnostician.generate_diagnosis(machine_data)
    return diagnosis

@router.get("/rag-context")
def get_rag_context(query: str = "SmartPlant ISO 10816"):
    """Retorna o trecho auditado do Guia Técnico e Dicionário de Dados do SENAI."""
    return {
        "query": query,
        "context": pdf_rag.query_context(query)
    }
