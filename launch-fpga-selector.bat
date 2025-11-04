@echo off
echo Starting FPGA Selector Tool...
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo Starting backend server...
start "FPGA Selector Backend" cmd /k "cd backend && npm install && npm start"

timeout /t 3 /nobreak >nul

echo Starting frontend...
start "FPGA Selector Frontend" cmd /k "cd frontend && npm install && npm start"

echo.
echo Both servers are starting...
echo Backend will be available at http://localhost:3001
echo Frontend will be available at http://localhost:3000
echo.
echo Press any key to exit this window (servers will continue running)...
pause >nul

