@echo off
setlocal
set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
cd /d "%ROOT_DIR%"
cls

echo ===================================================================
echo   ENCERRANDO SERVICOS DO SMARTPLANT OURINHOS
echo ===================================================================
echo.

echo [1/3] Finalizando processos na porta 8000 (Backend FastAPI)...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo [2/3] Finalizando processos na porta 5173 (Frontend Vite)...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo [3/3] Fechando janelas do console do SmartPlant...
taskkill /F /FI "WINDOWTITLE eq SmartPlant-Backend*" > nul 2>&1
taskkill /F /FI "WINDOWTITLE eq SmartPlant-Frontend*" > nul 2>&1

echo.
echo ===================================================================
echo   Todos os servicos foram finalizados com sucesso!
echo ===================================================================
ping 127.0.0.1 -n 3 > nul
