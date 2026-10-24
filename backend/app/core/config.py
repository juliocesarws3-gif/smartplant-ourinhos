import os
from pathlib import Path
from dataclasses import dataclass

# Diretórios base
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
CSV_PATH = DATA_DIR / "data_smartplant_manutencao_2.csv"
DUCKDB_PATH = PROCESSED_DIR / "smartplant.duckdb"
PDF_KNOWLEDGE_PATH = PROCESSED_DIR / "pdf_knowledge.json"
ENV_PATH = BASE_DIR / ".env"

def load_env_file():
    """Carrega variáveis do arquivo .env local se existirem."""
    if ENV_PATH.exists():
        try:
            with open(ENV_PATH, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip().rstrip(",")
                    if "=" in line and not line.startswith("#"):
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k and not os.environ.get(k):
                            os.environ[k] = v
        except Exception:
            pass

load_env_file()

@dataclass
class Settings:
    PROJECT_NAME: str = "SmartPlant Ourinhos"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    
    # Chaves de API lidas de variáveis de ambiente (.env)
    GEMINI_API_KEY: str = os.getenv("Gemini_API_KEY", "")
    GITHUB_PERSONAL_KEY: str = os.getenv("GitHub_Personal_Key", "")
    STITCH_API_KEY: str = os.getenv("Stich_API_KEY", "")
    
    # Firebase
    FIREBASE_API_KEY: str = os.getenv("apiKey", "")
    FIREBASE_PROJECT_ID: str = os.getenv("projectId", "smartplant-ourinhos")
    FIREBASE_AUTH_DOMAIN: str = os.getenv("authDomain", "smartplant-ourinhos.firebaseapp.com")
    FIREBASE_APP_ID: str = os.getenv("appId", "")

    # Arquivos
    CSV_FILE: str = str(CSV_PATH)
    DB_FILE: str = str(DUCKDB_PATH)
    PDF_FILE: str = str(PDF_KNOWLEDGE_PATH)

settings = Settings()
