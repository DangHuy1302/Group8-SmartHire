@echo off
:: SmartHire Backend Runner
cd /d "%~dp0"
set "PYTHONIOENCODING=utf-8"
echo ========================================================
echo   SmartHire Backend (FastAPI)
echo   Running at: http://127.0.0.1:8000
echo   API Docs:   http://127.0.0.1:8000/docs
echo ========================================================
echo.
"%~dp0..\venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
if errorlevel 1 (
    echo.
    echo [ERROR] Backend process terminated with an error.
    pause
)

