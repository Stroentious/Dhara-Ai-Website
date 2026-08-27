@echo off
title Stop DHARA AI Servers
echo ===================================================
echo   Stopping DHARA AI Backend ^& Frontend Servers
echo ===================================================
echo.

echo [1/2] Terminating servers on ports 8000 and 5173...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p8000 = (Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue).OwningProcess; if ($p8000) { Stop-Process -Id $p8000 -Force -ErrorAction SilentlyContinue }; $p5173 = (Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue).OwningProcess; if ($p5173) { Stop-Process -Id $p5173 -Force -ErrorAction SilentlyContinue }"

echo [2/2] Cleaning up launcher windows...
taskkill /FI "WINDOWTITLE eq DHARA AI Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq DHARA AI Frontend*" /F >nul 2>&1

echo.
echo [SUCCESS] DHARA AI servers have been stopped.
echo ===================================================
pause
