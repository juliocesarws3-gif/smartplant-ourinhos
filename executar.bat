@echo off
chcp 65001 > nul
cls
echo ===================================================================
echo   🏭 SMARTPLANT OURINHOS - PLATAFORMA DE MANUTENÇÃO PREDITIVA 4.0
echo   Escola SENAI Ourinhos • Google Antigravity • Gemini 3.8 Flash
echo ===================================================================
echo.

echo [1/3] Inicializando DuckDB OLAP e Backend FastAPI na porta 8000...
start "SmartPlant - Backend FastAPI (Porta 8000)" cmd /k "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak > nul

echo [2/3] Inicializando Interface Industrial React 19 + Vite na porta 5173...
start "SmartPlant - Frontend Vite (Porta 5173)" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak > nul

echo [3/3] Abrindo SmartPlant Ourinhos no navegador padrão...
start http://localhost:5173

echo.
echo ===================================================================
echo   ✅ AMBIENTE 100%% OPERACIONAL!
echo   - Backend & Swagger: http://localhost:8000/docs
echo   - Frontend Workspace: http://localhost:5173
echo.
echo   Para encerrar todos os processos, execute: encerrar.bat
echo ===================================================================
