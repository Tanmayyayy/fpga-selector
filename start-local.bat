@echo off
setlocal
set SCRIPT=%~dp0start-local.ps1

if not exist "%SCRIPT%" (
  echo PowerShell launcher not found: %SCRIPT%
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" -FrontendPort 3002

endlocal
