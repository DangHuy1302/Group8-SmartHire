@echo off
chcp 65001 > nul
echo ========================================================
echo   KHỞI ĐỘNG HỆ THỐNG SMARTHIRE MINI (GROUP 8)
echo ========================================================
echo.
echo Đang mở Backend FastAPI tại http://127.0.0.1:8000 ...
start "SmartHire Backend (FastAPI)" cmd /k "chcp 65001 > nul && set PYTHONIOENCODING=utf-8 && call .\venv\Scripts\activate.bat && cd backend && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Đang chờ Backend khởi động (3 giây)...
timeout /t 3 /nobreak > nul

echo Đang mở Frontend React (Vite) tại http://localhost:3000 ...
start "SmartHire Frontend (Vite)" cmd /k "chcp 65001 > nul && cd frontend && npm run dev"

echo.
echo ========================================================
echo   HỆ THỐNG ĐÃ KHỞI CHẠY!
echo   - Giao diện ứng dụng: http://localhost:3000
echo   - Swagger API Docs:   http://127.0.0.1:8000/docs
echo ========================================================
echo Nhấn phím bất kỳ để thoát cửa sổ này (hai dịch vụ vẫn tiếp tục chạy).
pause > nul
