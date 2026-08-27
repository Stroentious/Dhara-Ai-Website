@echo off
title DHARA AI Server Launcher
echo ===================================================
echo   Starting DHARA AI Backend ^& Frontend Servers
echo ===================================================
echo.

:: Start Backend Server
cd /d "c:\Users\abhin\abhinav\dharaAI\backend"
start "DHARA AI Backend" /min .\venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

:: Start Frontend Server
cd /d "c:\Users\abhin\abhinav\dharaAI\frontend"
start "DHARA AI Frontend" /min npm run dev -- --port 5173

echo Servers launched!
echo Access DHARA AI in your browser at: http://localhost:5173
echo.
