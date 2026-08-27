@echo off
title DHARA AI - Disable Auto-Start
echo ===================================================
echo   DHARA AI - Disabling Windows Auto-Start
echo ===================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$Startup = [Environment]::GetFolderPath('Startup'); $Shortcut = Join-Path $Startup 'DHARA_AI_AutoStart.lnk'; if (Test-Path $Shortcut) { Remove-Item $Shortcut -Force; Write-Host '[SUCCESS] Removed DHARA AI from Windows Startup.' } else { Write-Host '[INFO] No auto-start shortcut found in Windows Startup.' }"

echo.
echo ===================================================
echo DHARA AI will NOT start automatically on boot.
echo You can start the servers manually whenever you want.
echo ===================================================
pause
