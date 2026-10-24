from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any
from backend.app.core.firebase import os_manager
from backend.app.schemas import ServiceOrderCreate, ServiceOrderStatusUpdate

router = APIRouter(prefix="/os", tags=["Service Orders & Firebase"])

@router.get("")
def list_orders():
    """Lista as Ordens de Serviço (OS) ativas e histórico."""
    return os_manager.list_orders()

@router.post("")
def create_order(payload: ServiceOrderCreate):
    """Cria uma nova Ordem de Serviço preventiva/corretiva."""
    return os_manager.create_order(payload.model_dump())

@router.patch("/{order_id}")
def update_status(order_id: str, payload: ServiceOrderStatusUpdate):
    """Atualiza o status de uma Ordem de Serviço (ABERTA, EM_ANDAMENTO, CONCLUIDA)."""
    updated = os_manager.update_order_status(order_id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Ordem de Serviço não encontrada")
    return updated
