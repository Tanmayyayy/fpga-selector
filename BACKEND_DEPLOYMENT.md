# Backend Deployment Guide

This project includes a backend server for AI features. To deploy the backend:

## Option 1: Railway (Recommended - Free Tier Available)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select this repository
5. Railway will auto-detect the backend (uses `railway.json`)
6. Add environment variables in Railway dashboard:
   - `GOOGLE_API_KEY` (required)
   - `OPENAI_API_KEY` (optional)
   - `ANTHROPIC_API_KEY` (optional)
   - `PORT` (Railway sets this automatically)
7. Copy the Railway URL (e.g., `https://your-app.railway.app`)
8. Add it as GitHub Secret: `REACT_APP_BACKEND_URL`

## Option 2: Render (Free Tier Available)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect this repository
5. Settings:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
6. Add environment variables in Render dashboard
7. Copy the Render URL and add as GitHub Secret

## Option 3: Vercel (Serverless Functions)

The backend can be adapted to Vercel serverless functions. See Vercel docs for Express.js deployment.

## Setting GitHub Secret

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `REACT_APP_BACKEND_URL`
4. Value: Your deployed backend URL (e.g., `https://your-app.railway.app`)
5. Click "Add secret"

The frontend will automatically use this URL when deployed to GitHub Pages.

