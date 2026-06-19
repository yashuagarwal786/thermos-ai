# ======================================================
# THERMOS AI - ONE-CLICK CLOUD DEPLOYMENT SCRIPT
# ======================================================
# Run this script in PowerShell to automate Git setup and trigger Vercel deploy.

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  THERMOS AI CLOUD DEPLOYMENT AUTOMATOR" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# 1. Initialize Git Repository locally
Write-Host "[Deploy] Initializing Git..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    git init
    git add .
    git commit -m "initial commit: Thermos AI Industry-Grade release"
    Write-Host "[Deploy] Git repository initialized and files committed." -ForegroundColor Green
} else {
    Write-Host "[Deploy] Git repository already exists." -ForegroundColor Green
}

# 2. Push to GitHub
Write-Host ""
$repo_url = Read-Host "Enter your GitHub Remote Repository URL (e.g. https://github.com/user/thermos-ai.git) [Press Enter to skip]"
if ($repo_url) {
    git remote remove origin 2>$null
    git remote add origin $repo_url
    git branch -M main
    Write-Host "[Deploy] Pushing code to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    Write-Host "[Deploy] Pushed successfully!" -ForegroundColor Green
}

# 3. Deploy Frontend to Vercel via CLI
Write-Host ""
$deploy_vercel = Read-Host "Do you want to deploy the frontend to Vercel now? (y/n)"
if ($deploy_vercel -eq 'y') {
    Write-Host "[Deploy] Checking Vercel CLI..." -ForegroundColor Yellow
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Host "[Deploy] Installing Vercel CLI globally..." -ForegroundColor Yellow
        npm install -g vercel
    }
    
    Write-Host "[Deploy] Authenticating and deploying to Vercel..." -ForegroundColor Yellow
    cd frontend
    vercel login
    vercel deploy --prod
    cd ..
    Write-Host "[Deploy] Frontend deployment command triggered." -ForegroundColor Green
}

# 4. Deploy Backend to Render
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Backend Microservices ready for Render Blueprint deployment!" -ForegroundColor Green
Write-Host "To finish:" -ForegroundColor Yellow
Write-Host "1. Push this project to GitHub (if not done)." -ForegroundColor Yellow
Write-Host "2. Go to https://dashboard.render.com -> Blueprint -> New Blueprint." -ForegroundColor Yellow
Write-Host "3. Link your repository." -ForegroundColor Yellow
Write-Host "==============================================" -ForegroundColor Cyan
