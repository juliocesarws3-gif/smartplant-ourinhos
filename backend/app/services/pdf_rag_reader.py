import json
from pathlib import Path
from typing import List, Dict, Any
from backend.app.core.config import settings

class PDFRagReader:
    def __init__(self, json_path: str = settings.PDF_FILE):
        self.json_path = Path(json_path)
        self.pages: List[Dict[str, Any]] = []
        self.load_knowledge()

    def load_knowledge(self):
        if self.json_path.exists():
            try:
                with open(self.json_path, "r", encoding="utf-8") as f:
                    self.pages = json.load(f)
            except Exception as e:
                print(f"[RAG Reader] Erro ao carregar PDF indexado: {e}")
                self.pages = []

    def get_full_text(self) -> str:
        return "\n\n".join([f"--- PÁGINA {p.get('page')} ---\n{p.get('text', '')}" for p in self.pages])

    def query_context(self, query: str, max_chars: int = 3500) -> str:
        """Busca seções relevantes do Dicionário Técnico para enriquecer o prompt da IA."""
        if not self.pages:
            return "Dicionário Técnico SENAI Ourinhos: SmartPlant - Monitoramento Preditivo e Manutenção Baseada em Condição (PdM)."
        
        # Filtra páginas mais relevantes (Página 1 e 2 são dedicadas ao SmartPlant)
        relevant_chunks = []
        for p in self.pages:
            text = p.get("text", "")
            if "SmartPlant" in text or "ISO 10816" in text or "manutencao" in text or "Manutenção" in text:
                relevant_chunks.append(text)
        
        combined = "\n\n".join(relevant_chunks) if relevant_chunks else self.get_full_text()
        return combined[:max_chars]

pdf_rag = PDFRagReader()
