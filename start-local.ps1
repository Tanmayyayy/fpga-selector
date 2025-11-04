Param(
    [switch]$NoInstall,
    [int]$FrontendPort = 3000
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

function Ensure-Node() {
    try {
        $v = (node -v)
        Write-Host "Node detected: $v" -ForegroundColor Green
    } catch {
        Write-Error "Node.js is not installed or not on PATH. Install Node 16+ from https://nodejs.org and try again."
        exit 1
    }
}

function Ensure-Dependencies($dir) {
    if ($NoInstall) { return }
    $pkg = Join-Path $dir "package.json"
    if (-not (Test-Path $pkg)) { return }

    $lock = Join-Path $dir "package-lock.json"
    $nodeModules = Join-Path $dir "node_modules"

    Push-Location $dir
    try {
        if (-not (Test-Path $nodeModules) -or -not (Get-ChildItem $nodeModules -ErrorAction SilentlyContinue)) {
            if (Test-Path $lock) {
                Write-Host "Installing dependencies in $dir (npm ci)..." -ForegroundColor Cyan
                npm ci | Write-Output
            } else {
                Write-Host "Installing dependencies in $dir (npm install)..." -ForegroundColor Cyan
                npm install | Write-Output
            }
        } else {
            Write-Host "Dependencies already present in $dir" -ForegroundColor DarkGray
        }
    } finally {
        Pop-Location
    }
}

function Start-Backend() {
    if (-not (Test-Path (Join-Path $backend "server.js"))) {
        Write-Host "Backend not found at $backend. Skipping backend start." -ForegroundColor Yellow
        return
    }

    Ensure-Dependencies $backend

    $cmd = "Set-Location `"$backend`"; npm run dev"
    Write-Host "Starting backend (port 3001) in new window..." -ForegroundColor Green
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit","-Command",$cmd | Out-Null
}

function Start-Frontend() {
    if (-not (Test-Path (Join-Path $frontend "package.json"))) {
        Write-Host "Frontend not found at $frontend. Skipping frontend start." -ForegroundColor Yellow
        return
    }

    Ensure-Dependencies $frontend

    $cmd = "Set-Location `"$frontend`"; $env:PORT=$FrontendPort; npm start"
    Write-Host "Starting frontend (port $FrontendPort) in new window..." -ForegroundColor Green
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit","-Command",$cmd | Out-Null
}

function Open-Browser() {
    $url = "http://localhost:$FrontendPort"
    Write-Host "Waiting for frontend to become available at $url ..." -ForegroundColor Cyan
    $maxWait = 60
    $elapsed = 0
    while ($elapsed -lt $maxWait) {
        try {
            $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) {
                break
            }
        } catch {
            Start-Sleep -Seconds 2
            $elapsed += 2
            continue
        }
    }
    try { Start-Process $url | Out-Null } catch {}
}

Write-Host "Launching FPGA Selector..." -ForegroundColor White
Ensure-Node
Start-Backend
Start-Frontend
Open-Browser

Write-Host "Done. Two PowerShell windows should be running: backend (3001) and frontend ($FrontendPort)." -ForegroundColor White
