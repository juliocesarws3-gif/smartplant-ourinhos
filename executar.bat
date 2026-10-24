@echo off
setlocal
set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
cd /d "%ROOT_DIR%"
cls

echo ===================================================================
echo   SMARTPLANT OURINHOS - PLATAFORMA DE MANUTENCAO PREDITIVA 4.0
echo   Escola SENAI Ourinhos - Google Antigravity - Gemini 3.8 Flash
echo ===================================================================
echo.

echo [1/3] Inicializando DuckDB OLAP e Backend FastAPI na porta 8000...
start "SmartPlant-Backend" cmd /k "cd /d "%ROOT_DIR%" && python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

ping 127.0.0.1 -n 4 > nul

echo [2/3] Inicializando Interface Industrial React 19 + Vite na porta 5173...
start "SmartPlant-Frontend" cmd /k "cd /d "%ROOT_DIR%\frontend" && call npm run dev"

ping 127.0.0.1 -n 5 > nul

echo [3/3] Abrindo SmartPlant Ourinhos no navegador padrao...
start http://localhost:5173

echo.
echo ===================================================================
echo   AMBIENTE 100%% OPERACIONAL!
echo   - Backend e Swagger: http://localhost:8000/docs
echo   - Frontend Workspace: http://localhost:5173
echo.
echo   Para encerrar todos os processos, execute: encerrar.bat
echo ===================================================================
ping 127.0.0.1 -n 3 > nul
