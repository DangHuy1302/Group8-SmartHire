@echo off
setlocal

:: -----------------------------------------------------------
:: SmartHire Mini - Automated Setup Script (Group 8)
:: Safe for paths with spaces, brackets and Unicode characters
:: -----------------------------------------------------------

cd /d "%~dp0"

echo ========================================================
echo   SMARTHIRE MINI - SETUP SCRIPT (GROUP 8)
echo ========================================================
echo Project Directory: %~dp0
echo.

:: [1/5] Check Python
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 goto ERR_NO_PYTHON
python --version

:: [2/5] Check Node.js and npm
echo.
echo [2/5] Checking Node.js and npm...
node --version >nul 2>&1
if errorlevel 1 goto ERR_NO_NODE
node --version

call npm --version >nul 2>&1
if errorlevel 1 goto ERR_NO_NPM
call npm --version

:: [3/5] Setup Python Virtual Environment
echo.
echo [3/5] Setting up Python virtual environment...
if not exist "%~dp0venv\Scripts\python.exe" (
    echo [*] Creating virtual environment in: venv
    python -m venv "%~dp0venv"
    if errorlevel 1 goto ERR_VENV
    echo [OK] Virtual environment created successfully.
) else (
    echo [OK] Existing virtual environment found.
)

echo [*] Upgrading pip...
set "PYTHONIOENCODING=utf-8"
"%~dp0venv\Scripts\python.exe" -m pip install --upgrade pip >nul 2>&1

echo [*] Installing Python dependencies from requirements.txt...
"%~dp0venv\Scripts\python.exe" -m pip install -r "%~dp0requirements.txt"
if errorlevel 1 goto ERR_PIP
echo [OK] Python dependencies installed successfully.

:: [4/5] Install Frontend npm dependencies
echo.
echo [4/5] Installing Frontend dependencies (npm install)...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 goto ERR_NPM_INSTALL
cd /d "%~dp0"
echo [OK] Frontend dependencies installed successfully.

:: [5/5] Initialize SQLite database
echo.
echo [5/5] Initializing SQLite database and seed data...
set "PYTHONIOENCODING=utf-8"
"%~dp0venv\Scripts\python.exe" "%~dp0backend\run_seed.py"
if errorlevel 1 goto ERR_SEED
echo [OK] Database seeded successfully (20 candidates, 5 employers, 15 jobs, 40 apps).

echo.
echo ========================================================
echo   SETUP COMPLETED SUCCESSFULLY!
echo   Double-click 'start.bat' to run SmartHire Mini.
echo ========================================================
echo.
pause
exit /b 0

:: -----------------------------------------------------------
:: ERROR HANDLERS (Clean ASCII labels, no parentheses blocks)
:: -----------------------------------------------------------
:ERR_NO_PYTHON
echo.
echo [ERROR] Python is not installed or not found in system PATH.
echo Please install Python 3.10+ from python.org and check 'Add Python to PATH'.
pause
exit /b 1

:ERR_NO_NODE
echo.
echo [ERROR] Node.js is not installed or not found in system PATH.
echo Please install Node.js LTS from nodejs.org and restart terminal.
pause
exit /b 1

:ERR_NO_NPM
echo.
echo [ERROR] npm is not installed or not found in system PATH.
echo Please reinstall Node.js LTS from nodejs.org.
pause
exit /b 1

:ERR_VENV
echo.
echo [ERROR] Failed to create Python virtual environment.
pause
exit /b 1

:ERR_PIP
echo.
echo [ERROR] Failed to install Python dependencies from requirements.txt.
pause
exit /b 1

:ERR_NPM_INSTALL
echo.
echo [ERROR] Failed to install frontend npm packages.
cd /d "%~dp0"
pause
exit /b 1

:ERR_SEED
echo.
echo [ERROR] Failed to seed SQLite database.
pause
exit /b 1
