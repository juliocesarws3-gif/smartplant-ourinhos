from fastapi import APIRouter, Query
from typing import List, Dict, Any
from backend.app.services.web_scraper import web_scraper
from backend.app.core.database import db

router = APIRouter(prefix="/scraper", tags=["Web Scraper"])

@router.get("/quotes")
async def get_all_quotes():
    """Varre cotações de peças de todos os componentes críticos das máquinas cadastradas."""
    machines = db.get_all_machines()
    quotes = await web_scraper.get_all_quotes(machines)
    return quotes

@router.get("/quote/{part_number}")
async def get_single_quote(part_number: str, base_price: float = Query(250.0), supplier: str = Query("Fornecedor Homologado")):
    """Cota um part number específico em tempo real na web."""
    quote = await web_scraper.scrape_part_quote(part_number, base_price, supplier)
    return quote
