@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Root of project is folder of this script
set ROOT=%~dp0
set BACKEND=%ROOT%backend\
set FRONTEND=%ROOT%frontend\
set FRONTEND_PORT=3002

REM 1) Check Node.js
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found on PATH. Install Node 16+ from https://nodejs.org and try again.
  pause
  exit /b 1
)

REM 2) Start backend in a new window
if exist "%BACKEND%server.js" (
  start "" cmd /k "cd /d \"%BACKEND%\" && npm install && npm run dev"
) else (
  echo [WARN] Backend server.js not found at %BACKEND% - skipping backend start.
)

REM 3) Start frontend (fixed port) in a new window
if exist "%FRONTEND%package.json" (
  start "" cmd /k "cd /d \"%FRONTEND%\" && npm install && set PORT=%FRONTEND_PORT% && npm start"
) else (
  echo [ERROR] Frontend package.json not found at %FRONTEND%
  pause
  exit /b 1
)

REM 4) Give the frontend a few seconds to start, then open browser
echo Waiting for frontend to start on port %FRONTEND_PORT% ...
timeout /t 12 /nobreak >nul
start "" "http://localhost:%FRONTEND_PORT%"

endlocal
