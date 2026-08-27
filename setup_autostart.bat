@echo off
title DHARA AI Auto-Start Installer
echo ===================================================
echo   Installing DHARA AI Windows Auto-Start Service
echo ===================================================
echo.

set SCRIPT_DIR=%~dp0
set VBS_PATH=%SCRIPT_DIR%run_dharaai.vbs

echo [1/3] Creating Windows Startup shortcut...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$WshShell = New-Object -ComObject WScript.Shell; $Startup = [Environment]::GetFolderPath('Startup'); $Shortcut = $WshShell.CreateShortcut(\"$Startup\DHARA_AI_AutoStart.lnk\"); $Shortcut.TargetPath = 'wscript.exe'; $Shortcut.Arguments = '\"\"\"' + '%VBS_PATH%' + '\"\"\"'; $Shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $Shortcut.Description = 'DHARA AI Auto-Start Background Servers'; $Shortcut.Save()"

echo [2/3] Creating Desktop shortcut...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$WshShell = New-Object -ComObject WScript.Shell; $Desktop = [Environment]::GetFolderPath('Desktop'); $Shortcut = $WshShell.CreateShortcut(\"$Desktop\DHARA AI.lnk\"); $Shortcut.TargetPath = 'wscript.exe'; $Shortcut.Arguments = '\"\"\"' + '%VBS_PATH%' + '\"\"\"'; $Shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $Shortcut.Description = 'Open DHARA AI Website'; $Shortcut.Save()"

echo [3/3] Starting DHARA AI servers now...
wscript.exe "%VBS_PATH%"

echo.
echo ===================================================
echo [SUCCESS] Auto-Start installation completed!
echo.
echo - DHARA AI will now start automatically whenever your computer boots up.
echo - A "DHARA AI" shortcut has been created on your Desktop.
echo - Opening the website shortcut will ensure servers are active and open the browser.
echo ===================================================
pause
