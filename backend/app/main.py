from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.routers import sensors, scraper, diagnosis, os_firebase
from backend.app.core.database import db

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API de Manutenção Preditiva e Indústria 4.0 - Padrão SENAI Ourinhos Hackathon Antigravity"
)

# Configuração de CORS para permitir acesso do Frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de Routers
app.include_router(sensors.router, prefix=settings.API_V1_STR)
app.include_router(scraper.router, prefix=settings.API_V1_STR)
app.include_router(diagnosis.router, prefix=settings.API_V1_STR)
app.include_router(os_firebase.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "sistema": settings.PROJECT_NAME,
        "versao": settings.VERSION,
        "status": "Online",
        "docs_url": "/docs",
        "motor_olap": "DuckDB Massivo (1.200 leituras)",
        "rag_motor": "Guia Técnico SENAI PDF v2.0",
        "ai_engine": "Gemini AI PdM Engine"
    }

@app.get("/api/health")
def health_check():
    kpis = db.get_kpis()
    return {
        "status": "Healthy",
        "database": "DuckDB Connected",
        "total_registros": kpis["total_leituras"],
        "total_maquinas": kpis["total_maquinas"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
