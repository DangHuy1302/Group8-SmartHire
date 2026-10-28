@echo off
chcp 65001 > nul
echo ========================================================
echo   SMARTHIRE MINI — SETUP TỰ ĐỘNG (GROUP 8)
echo ========================================================
echo.

echo [1/4] Kiểm tra Python và Node.js...
python --version
if errorlevel 1 (
    echo [LỖI] Chưa cài đặt Python hoặc Python chưa được thêm vào PATH!
    pause
    exit /b 1
)

node --version
if errorlevel 1 (
    echo [LỖI] Chưa cài đặt Node.js hoặc Node.js chưa được thêm vào PATH!
    pause
    exit /b 1
)

echo.
echo [2/4] Thiết lập môi trường ảo Python và cài đặt dependencies...
if not exist "venv" (
    python -m venv venv
)
set PYTHONIOENCODING=utf-8
call .\venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt

echo.
echo [3/4] Cài đặt dependencies cho Frontend (React + Vite)...
cd frontend
call npm install
cd ..

echo.
echo [4/4] Khởi tạo và nạp dữ liệu mẫu SQLite (seed data)...
python backend\run_seed.py

echo.
echo ========================================================
echo   CÀI ĐẶT HOÀN TẤT THÀNH CÔNG!
echo   Bây giờ bạn có thể chạy 'start.bat' để mở ứng dụng.
echo ========================================================
pause
