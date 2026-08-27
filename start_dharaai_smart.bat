@echo off
title DHARA AI Smart Launcher
echo ===================================================
echo   DHARA AI - Smart Server Launcher ^& Auto-Checker
echo ===================================================
echo.

set SCRIPT_DIR=%~dp0
set BACKEND_DIR=%SCRIPT_DIR%backend
set FRONTEND_DIR=%SCRIPT_DIR%frontend

:: 1. Check Backend Server (Port 8000)
netstat -ano | findstr LISTENING | findstr ":8000 " >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Backend server is not running. Starting Backend on port 8000...
    cd /d "%BACKEND_DIR%"
    start "DHARA AI Backend" /min "%BACKEND_DIR%\venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000
    timeout /t 2 /nobreak >nul
) else (
    echo [+] Backend server is active on http://127.0.0.1:8000
)

:: 2. Check Frontend Server (Port 5173)
netstat -ano | findstr LISTENING | findstr ":5173 " >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Frontend server is not running. Starting Frontend on port 5173...
    cd /d "%FRONTEND_DIR%"
    start "DHARA AI Frontend" /min cmd /c npm run dev -- --port 5173
    timeout /t 2 /nobreak >nul
) else (
    echo [+] Frontend server is active on http://localhost:5173
)

echo.
echo ===================================================
echo DHARA AI servers are active!
echo Backend API:  http://127.0.0.1:8000
echo Frontend UI:  http://localhost:5173
echo ===================================================

