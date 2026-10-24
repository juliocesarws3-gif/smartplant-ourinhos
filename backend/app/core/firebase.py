import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime
from backend.app.core.config import settings

OS_FILE = Path("data/processed/service_orders.json")

class ServiceOrderManager:
    def __init__(self, storage_path: Path = OS_FILE):
        self.storage_path = storage_path
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        self.orders: List[Dict[str, Any]] = self._load()

    def _load(self) -> List[Dict[str, Any]]:
        if self.storage_path.exists():
            try:
                with open(self.storage_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        
        # Ordens de Serviço padrão iniciais baseadas no chão de fábrica do projeto
        initial_orders = [
            {
                "id": "OS-2026-081",
                "maquina_id": "EQP-0413",
                "titulo": "Substituição de Rolamento Eixo Principal",
                "descricao": "Detectado pico de vibração RMS (7.2 mm/s) e risco térmico. Parada planejada de 2h.",
                "componente_critico": "Rolamento SKF-6208-2Z",
                "prioridade": "Crítica",
                "status": "EM_ANDAMENTO",
                "tecnico_responsavel": "Carlos Mendonça (Eletromecânica SENAI)",
                "data_abertura": "2026-10-24 07:15",
                "data_previsao": "2026-10-24 14:00",
                "custo_estimado": 195.50
            },
            {
                "id": "OS-2026-080",
                "maquina_id": "EQP-0372",
                "titulo": "Calibração e Limpeza de Lentes Ópticas",
                "descricao": "Inspeção de rotina e alinhamento de sensores infravermelhos na Linha de Rotulagem.",
                "componente_critico": "Sensor Óptico Siemens",
                "prioridade": "Média",
                "status": "ABERTA",
                "tecnico_responsavel": "Mariana Souza (Automação)",
                "data_abertura": "2026-10-24 08:30",
                "data_previsao": "2026-10-25 10:00",
                "custo_estimado": 450.00
            },
            {
                "id": "OS-2026-079",
                "maquina_id": "EQP-0215",
                "titulo": "Revisão Preventiva de Servomotor ABB",
                "descricao": "Troca de selos mecânicos e reaperto de barramentos no Paletizador.",
                "componente_critico": "Selo Mecânico Duplo",
                "prioridade": "Baixa",
                "status": "CONCLUIDA",
                "tecnico_responsavel": "Roberto Silva",
                "data_abertura": "2026-10-23 11:00",
                "data_previsao": "2026-10-23 16:30",
                "custo_estimado": 310.00
            }
        ]
        self._save(initial_orders)
        return initial_orders

    def _save(self, orders: List[Dict[str, Any]]):
        try:
            with open(self.storage_path, "w", encoding="utf-8") as f:
                json.dump(orders, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[OS Manager] Erro ao salvar OS: {e}")

    def list_orders(self) -> List[Dict[str, Any]]:
        return self.orders

    def create_order(self, data: Dict[str, Any]) -> Dict[str, Any]:
        count = len(self.orders) + 82
        new_id = f"OS-2026-{count:03d}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        
        new_order = {
            "id": new_id,
            "maquina_id": data.get("maquina_id", "MAQ-GEN"),
            "titulo": data.get("titulo", "Manutenção Preditiva Padrão"),
            "descricao": data.get("descricao", "Intervenção gerada via SmartPlant AI."),
            "componente_critico": data.get("componente_critico", "Sobressalente Geral"),
            "prioridade": data.get("prioridade", "Média"),
            "status": "ABERTA",
            "tecnico_responsavel": data.get("tecnico_responsavel", "Plantão Manutenção"),
            "data_abertura": now_str,
            "data_previsao": data.get("data_previsao", now_str),
            "custo_estimado": float(data.get("custo_estimado", 250.0))
        }
        self.orders.insert(0, new_order)
        self._save(self.orders)
        return new_order

    def update_order_status(self, order_id: str, new_status: str) -> Optional[Dict[str, Any]]:
        for o in self.orders:
            if o["id"] == order_id:
                o["status"] = new_status
                self._save(self.orders)
                return o
        return None

os_manager = ServiceOrderManager()
