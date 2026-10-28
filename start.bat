@echo off
setlocal EnableDelayedExpansion

:: -----------------------------------------------------------
:: SmartHire Mini - System Launcher (Group 8)
:: Safe for paths with spaces, brackets and Unicode characters
:: -----------------------------------------------------------

cd /d "%~dp0"

echo ========================================================
echo   SMARTHIRE MINI - SYSTEM LAUNCHER (GROUP 8)
echo ========================================================
echo.

:: Check prerequisites
if not exist "%~dp0venv\Scripts\python.exe" goto ERR_NO_SETUP
if not exist "%~dp0frontend\node_modules" goto ERR_NO_SETUP

:: 1. Check & Launch FastAPI Backend (Port 8000)
netstat -ano | findstr ":8000 " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Port 8000 is already in use.
    echo        FastAPI Backend appears to be already running.
) else (
    echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
    start "SmartHire_Backend" "%~dp0backend\run_server.bat"
)

:: Wait 2 seconds using ping (safe in all environments, avoids timeout redirection bug)
ping 127.0.0.1 -n 3 >nul

:: 2. Check & Launch Vite Frontend (Port 3000)
netstat -ano | findstr ":3000 " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Port 3000 is already in use.
    echo        Frontend Vite appears to be already running.
) else (
    echo [2/2] Launching Frontend Vite on http://localhost:3000 ...
    start "SmartHire_Frontend" "%~dp0frontend\run_frontend.bat"
)

echo.
echo ========================================================
echo   SMARTHIRE MINI IS RUNNING
echo ========================================================
echo.
echo   * Web Application:  http://localhost:3000
echo   * Backend API:      http://127.0.0.1:8000
echo   * API Docs:         http://127.0.0.1:8000/docs
echo.
echo Both services are running in dedicated command windows.
echo You can minimize this window or close it.
echo ========================================================
echo.
pause
exit /b 0

:: -----------------------------------------------------------
:: ERROR HANDLER
:: -----------------------------------------------------------
:ERR_NO_SETUP
echo.
echo [ERROR] Project environment is not ready.
echo Missing Python venv or Frontend node_modules.
echo.
echo Please run 'setup.bat' first to prepare the environment.
echo.
pause
exit /b 1
