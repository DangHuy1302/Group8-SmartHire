@echo off
:: SmartHire Frontend Runner
cd /d "%~dp0"
echo ========================================================
echo   SmartHire Frontend (Vite + React)
echo   Running at: http://localhost:3000
echo ========================================================
echo.
call npm run dev
if errorlevel 1 (
    echo.
    echo [ERROR] Frontend process terminated with an error.
    pause
)
