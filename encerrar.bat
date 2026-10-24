@echo off
chcp 65001 > nul
cls
echo ===================================================================
echo   🛑 ENCERRANDO SERVIÇOS DO SMARTPLANT OURINHOS
echo ===================================================================
echo.

echo [1/2] Finalizando processos na porta 8000 (Backend FastAPI)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    taskkill /F /PID %%a > nul 2>&1
)

echo [2/2] Finalizando processos na porta 5173 (Frontend Vite)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /F /PID %%a > nul 2>&1
)

echo.
echo ✅ Todos os serviços foram finalizados com segurança!
timeout /t 2 /nobreak > nul
