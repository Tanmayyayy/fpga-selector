# PowerShell script to start FPGA Selector Frontend
Write-Host "Starting FPGA Selector Frontend..." -ForegroundColor Green

Set-Location frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting development server..." -ForegroundColor Green
npm start

